import { Award, CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getMissingProfileFields } from "./profileCompletion";

type Props = {
  profile: Profile;
  onEditProfile: () => void;
};

export default function ProfileBadges({ profile, onEditProfile }: Props) {
  if (profile.badges.length === 0) {
    const missing = getMissingProfileFields(profile);

    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Award className="size-6 text-muted-foreground" />
        </div>

        <p className="font-semibold">No badges yet</p>

        {missing.length > 0 ? (
          <>
            <p className="max-w-sm text-sm text-muted-foreground">
              Complete your profile to earn the Profile Complete badge!
            </p>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Missing: {missing.join(", ")}
            </p>
            <Button
              id="badges-complete-profile-btn"
              size="sm"
              className="mt-1"
              onClick={onEditProfile}
            >
              Complete Profile
            </Button>
          </>
        ) : (
          <p className="max-w-sm text-sm text-muted-foreground">
            Keep participating in club events to start earning badges.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {profile.badges.map((badge) => (
        <Card key={badge.id} className="text-center">
          <CardContent className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
              <CalendarCheck className="size-6 text-foreground" />
            </div>

            <div>
              <p className="font-bold">{badge.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {badge.description}
              </p>
            </div>

            <Badge variant="secondary">
              Earned: {formatDate(badge.awardedAt)}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
