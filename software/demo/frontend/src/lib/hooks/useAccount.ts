import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginSchema } from "../schemas/loginSchema";
import agent from "../api/agent";
import type { User } from "../types";
import type { RegisterSchema } from "../schemas/registerSchema";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginUser = useMutation({
    mutationFn: async (loginCreds: LoginSchema) => {
      await agent.post("/login/?useCookies=true", loginCreds);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const logoutUser = useMutation({
    mutationFn: async () => {
      await agent.post("/account/logout");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const registerUser = useMutation({
    mutationFn: async (registerCreds: RegisterSchema) => {
      const { profileName, email, password } = registerCreds;
      await agent.post("/account/register", { profileName, email, password });
    },
    onSuccess: () => {
      toast.success("Registered successfully. Please log in.");
      navigate("/login");
    },
  });

  const { data: currentUser, isLoading: loadingUserInfo } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await agent.get<User>("/account/user-info");
      return response.data;
    },
  });

  return {
    loginUser,
    logoutUser,
    registerUser,
    currentUser,
    loadingUserInfo,
  };
};
