import { useState } from "react";
import { useParams } from "react-router";
import { Award, CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/lib/hooks/useProfile";
import { useAccount } from "@/lib/hooks/useAccount";
import { formatDate } from "@/lib/utils";
import ProfileHeader from "./ProfileHeader";
import ProfileContact from "./ProfileContact";
import ProfileTimeline from "./ProfileTimeline";
import ProfileEditDialog from "./ProfileEditDialog";
import ProfileCompletionBanner from "./ProfileCompletionBanner";
import ProfileBadges from "./ProfileBadges";

// Shown for any authenticated user (see ActivitiesController/ProfileController:
// GET /profile/{id} isn't restricted to the caller's own id), with edit access
// restored when the viewed profile belongs to the current user. Viewing someone
// else's badges deliberately skips ProfileBadges, since that component marks
// badges as "seen" in the viewer's own local gamification store - doing that
// here would mark another user's badges as seen in the current browser's storage.
export default function UserProfilePage() {
  const { userId } = useParams();
  const { profile, isLoadingProfile } = useUserProfile(userId);
  const { currentUser } = useAccount();
  const [editOpen, setEditOpen] = useState(false);

  if (isLoadingProfile) {
    return <p className="text-muted-foreground">Loading profile...</p>;
  }

  if (!profile) {
    return null;
  }

  const isOwnProfile = !!currentUser && currentUser.id === profile.id;
  const openEdit = isOwnProfile ? () => setEditOpen(true) : undefined;

  return (
    <div>
      <ProfileHeader profile={profile} onEditProfile={openEdit} />

      {profile.role === "Member" ? (
        <>
          {isOwnProfile && !profile.isProfileComplete && (
            <ProfileCompletionBanner profile={profile} onEditProfile={openEdit!} />
          )}

          <Tabs defaultValue="badges" className="mt-10">
            <div className="border-b border-border">
              <TabsList variant="line">
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="timeline">Event Timeline</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="badges" className="pt-6">
              {isOwnProfile ? (
                <ProfileBadges profile={profile} onEditProfile={openEdit!} />
              ) : profile.badges.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <Award className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-semibold">No badges yet</p>
                </div>
              ) : (
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
              )}
            </TabsContent>

            <TabsContent value="timeline" className="pt-6">
              <ProfileTimeline userId={userId} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <ProfileContact profile={profile} onEditProfile={openEdit} />
      )}

      {isOwnProfile && (
        <ProfileEditDialog
          profile={profile}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </div>
  );
}
