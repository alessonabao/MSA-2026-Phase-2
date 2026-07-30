import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import type { Profile } from "../types";

export type UpdateProfileData = {
  profileName: string;
  profileBio?: string;
  weapon?: string;
  skillLevel?: string;
  contactInfo?: string;
};

export const useProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await agent.get<Profile>("/profile");
      return response.data;
    },
  });

  const invalidateProfile = async () => {
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    // profileName/profileImageUrl are also cached under ["user"] (useAccount), which
    // drives the nav bar - keep it in sync after an edit instead of leaving it stale.
    await queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  const updateProfile = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await agent.put<Profile>("/profile", data);
      return response.data;
    },
    onSuccess: invalidateProfile,
  });

  const uploadProfilePicture = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await agent.post<Profile>("/profile/picture", formData);
      return response.data;
    },
    onSuccess: invalidateProfile,
  });

  return {
    profile,
    isLoadingProfile,
    updateProfile,
    uploadProfilePicture,
  };
};

// Public profile view for any other user - any authenticated user can view any
// other user's profile, so this hits GET /profile/{id} rather than the caller's
// own GET /profile.
export const useUserProfile = (userId?: string) => {
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const response = await agent.get<Profile>(`/profile/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  return { profile, isLoadingProfile };
};
