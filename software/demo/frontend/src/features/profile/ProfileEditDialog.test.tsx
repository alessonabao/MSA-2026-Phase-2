import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileEditDialog from "./ProfileEditDialog";
import { useProfile } from "@/lib/hooks/useProfile";
import { toast } from "sonner";
import type { Profile } from "@/lib/types";

vi.mock("@/lib/hooks/useProfile");
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockUseProfile = vi.mocked(useProfile);

beforeAll(() => {
  URL.createObjectURL = vi.fn(() => "blob:mock-url");
  URL.revokeObjectURL = vi.fn();
});

const memberProfile: Profile = {
  id: "1",
  email: "portia@example.com",
  profileName: "Portia Knight",
  profileBio: "Loves fencing.",
  profileImageUrl: null,
  role: "Member",
  weapon: "Épée",
  skillLevel: "Advanced",
  contactInfo: null,
  isProfileComplete: true,
  badges: [],
};

const adminProfile: Profile = {
  ...memberProfile,
  id: "2",
  role: "ClubAdmin",
  weapon: null,
  skillLevel: null,
  contactInfo: "club@example.com",
};

function makeProfileHooks(overrides: Record<string, unknown> = {}) {
  return {
    profile: undefined,
    isLoadingProfile: false,
    updateProfile: { isPending: false, mutateAsync: vi.fn().mockResolvedValue(undefined) },
    uploadProfilePicture: {
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    },
    ...overrides,
  } as unknown as ReturnType<typeof useProfile>;
}

describe("ProfileEditDialog", () => {
  it("shows weapon/skill level fields (not contact info) for a Member", () => {
    mockUseProfile.mockReturnValue(makeProfileHooks());
    render(
      <ProfileEditDialog profile={memberProfile} open onOpenChange={vi.fn()} />,
    );

    expect(screen.getByLabelText("Weapon of Choice")).toBeInTheDocument();
    expect(screen.getByLabelText("Skill Level")).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Club Contact Information"),
    ).not.toBeInTheDocument();
  });

  it("shows contact info (not weapon/skill level) for a ClubAdmin", () => {
    mockUseProfile.mockReturnValue(makeProfileHooks());
    render(
      <ProfileEditDialog profile={adminProfile} open onOpenChange={vi.fn()} />,
    );

    expect(
      screen.getByLabelText("Club Contact Information"),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Weapon of Choice")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Skill Level")).not.toBeInTheDocument();
  });

  it("submits a member update with weapon/skillLevel and no contactInfo", async () => {
    const user = userEvent.setup();
    const updateProfile = {
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    };
    mockUseProfile.mockReturnValue(makeProfileHooks({ updateProfile }));
    const onOpenChange = vi.fn();
    render(
      <ProfileEditDialog
        profile={memberProfile}
        open
        onOpenChange={onOpenChange}
      />,
    );

    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Portia K.");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() =>
      expect(updateProfile.mutateAsync).toHaveBeenCalledWith({
        profileName: "Portia K.",
        profileBio: memberProfile.profileBio,
        weapon: memberProfile.weapon,
        skillLevel: memberProfile.skillLevel,
        contactInfo: undefined,
      }),
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Profile updated successfully.",
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("submits an admin update with contactInfo and no weapon/skillLevel", async () => {
    const user = userEvent.setup();
    const updateProfile = {
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    };
    mockUseProfile.mockReturnValue(makeProfileHooks({ updateProfile }));
    render(
      <ProfileEditDialog profile={adminProfile} open onOpenChange={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() =>
      expect(updateProfile.mutateAsync).toHaveBeenCalledWith({
        profileName: adminProfile.profileName,
        profileBio: adminProfile.profileBio,
        weapon: undefined,
        skillLevel: undefined,
        contactInfo: adminProfile.contactInfo,
      }),
    );
  });

  it("shows an error toast and keeps the dialog open when the update fails", async () => {
    const user = userEvent.setup();
    const updateProfile = {
      isPending: false,
      mutateAsync: vi.fn().mockRejectedValue({
        isAxiosError: true,
        response: undefined,
      }),
    };
    mockUseProfile.mockReturnValue(makeProfileHooks({ updateProfile }));
    const onOpenChange = vi.fn();
    render(
      <ProfileEditDialog
        profile={memberProfile}
        open
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Unable to reach the server. Please check your connection.",
      ),
    );
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("uploads a staged profile picture before saving profile fields", async () => {
    const user = userEvent.setup();
    const uploadProfilePicture = {
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    };
    const updateProfile = {
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    };
    mockUseProfile.mockReturnValue(
      makeProfileHooks({ uploadProfilePicture, updateProfile }),
    );
    render(
      <ProfileEditDialog profile={memberProfile} open onOpenChange={vi.fn()} />,
    );

    // Dialog content is rendered into a Radix portal (document.body), not the
    // local RTL container, so query from the document instead.
    const file = new File(["binary"], "photo.png", { type: "image/png" });
    const fileInput = document.body.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    await user.upload(fileInput, file);

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() =>
      expect(uploadProfilePicture.mutateAsync).toHaveBeenCalledWith(file),
    );
    expect(updateProfile.mutateAsync).toHaveBeenCalled();
  });
});
