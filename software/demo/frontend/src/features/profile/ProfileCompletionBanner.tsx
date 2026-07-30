import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/lib/types";
import { getMissingProfileFields } from "./profileCompletion";

const ALL_FIELDS = [
  "Profile Picture",
  "Bio",
  "Weapon of Choice",
  "Skill Level",
];

type Props = {
  profile: Profile;
  onEditProfile: () => void;
};

export default function ProfileCompletionBanner({
  profile,
  onEditProfile,
}: Props) {
  const missing = getMissingProfileFields(profile);

  return (
    <Card className="mt-8 border-dashed bg-muted/40">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">
            Complete your profile to unlock your first badge!
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {ALL_FIELDS.map((field) => (
              <li key={field} className="flex items-center gap-1.5">
                {missing.includes(field) ? (
                  <Circle className="size-3.5" />
                ) : (
                  <CheckCircle2 className="size-3.5 text-primary" />
                )}
                {field}
              </li>
            ))}
          </ul>
        </div>

        <Button
          id="complete-profile-btn"
          onClick={onEditProfile}
          className="shrink-0"
        >
          Complete Profile
        </Button>
      </CardContent>
    </Card>
  );
}
