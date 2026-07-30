import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/lib/hooks/useProfile";
import ProfileHeader from "./ProfileHeader";
import ProfileEditDialog from "./ProfileEditDialog";
import ProfileCompletionBanner from "./ProfileCompletionBanner";
import ProfileBadges from "./ProfileBadges";
import ProfileTimeline from "./ProfileTimeline";
import ProfileContact from "./ProfileContact";

export default function Profile() {
  const { profile, isLoadingProfile } = useProfile();
  const [editOpen, setEditOpen] = useState(false);

  if (isLoadingProfile) {
    return <p className="text-muted-foreground">Loading profile...</p>;
  }

  if (!profile) {
    return null;
  }

  const openEdit = () => setEditOpen(true);

  return (
    <div>
      <ProfileHeader profile={profile} onEditProfile={openEdit} />

      {profile.role === "Member" ? (
        <>
          {!profile.isProfileComplete && (
            <ProfileCompletionBanner
              profile={profile}
              onEditProfile={openEdit}
            />
          )}

          <Tabs defaultValue="badges" className="mt-10">
            <div className="border-b border-border">
              <TabsList variant="line">
                <TabsTrigger value="badges">Badges & Merits</TabsTrigger>
                <TabsTrigger value="timeline">Event Timeline</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="badges" className="pt-6">
              <ProfileBadges profile={profile} onEditProfile={openEdit} />
            </TabsContent>

            <TabsContent value="timeline" className="pt-6">
              <ProfileTimeline />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <ProfileContact profile={profile} onEditProfile={openEdit} />
      )}

      <ProfileEditDialog
        profile={profile}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
