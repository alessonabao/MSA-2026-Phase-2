import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  // Omitted when viewing another user's public profile - hides the edit
  // affordance rather than duplicating this card into a read-only variant.
  onEditProfile?: () => void;
};

export default function ProfileContact({ profile, onEditProfile }: Props) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="size-5" />
          Club Contact
        </CardTitle>
      </CardHeader>
      <CardContent>
        {profile.contactInfo ? (
          <p className="whitespace-pre-line text-sm text-muted-foreground">
            {profile.contactInfo}
          </p>
        ) : onEditProfile ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">
              Add your club contact information so members know how to reach
              you.
            </p>
            <Button
              id="contact-add-btn"
              size="sm"
              variant="outline"
              onClick={onEditProfile}
            >
              Add Contact Info
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No contact info provided.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
