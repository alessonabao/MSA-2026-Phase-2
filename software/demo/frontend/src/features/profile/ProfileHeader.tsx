import { Camera, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveImageUrl } from "@/lib/utils";
import type { Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  onEditProfile: () => void;
};

export default function ProfileHeader({ profile, onEditProfile }: Props) {
  const photoUrl = profile.profileImageUrl
    ? resolveImageUrl(profile.profileImageUrl)
    : "/images/placeholder.jpg";

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:w-56">
        <img
          src={photoUrl}
          alt={profile.profileName}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          aria-label="Change profile photo"
          onClick={onEditProfile}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs transition-colors hover:bg-primary/80"
        >
          <Camera className="size-4" />
        </button>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            {profile.profileName}
          </h1>
          <Button
            id="edit-profile-btn"
            variant="outline"
            size="sm"
            onClick={onEditProfile}
          >
            <Pencil />
            Edit Profile
          </Button>
        </div>

        {profile.profileBio ? (
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {profile.profileBio}
          </p>
        ) : (
          <p className="mt-3 max-w-2xl text-muted-foreground italic">
            No bio yet. Add one so other members can get to know you.
          </p>
        )}

        {profile.role === "Member" && (
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-lg bg-muted px-4 py-3">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Primary Weapon
              </p>
              <p className="text-lg font-bold text-primary">
                {profile.weapon ?? "Not set"}
              </p>
            </div>

            <div className="rounded-lg bg-muted px-4 py-3">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Skill Level
              </p>
              <p className="text-lg font-bold text-primary">
                {profile.skillLevel ?? "Not set"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
