import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resolveImageUrl } from "@/lib/utils";
import { useProfile } from "@/lib/hooks/useProfile";
import {
  profileSchema,
  type ProfileSchema,
} from "@/lib/schemas/profileSchema";
import type { Profile } from "@/lib/types";

const weaponItems = [
  { label: "Foil", value: "Foil" },
  { label: "Épée", value: "Épée" },
  { label: "Sabre", value: "Sabre" },
  { label: "Mixed", value: "Mixed" },
];

const skillLevelItems = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

type Props = {
  profile: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// The form (and its staged-picture/field state) is only rendered while the dialog is open, so
// it mounts fresh - with the latest profile as its defaults - every time it's opened, instead of
// needing an effect to reset stale state left over from the last time it was open.
export default function ProfileEditDialog({
  profile,
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        {open && (
          <ProfileEditForm profile={profile} onOpenChange={onOpenChange} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProfileEditForm({
  profile,
  onOpenChange,
}: {
  profile: Profile;
  onOpenChange: (open: boolean) => void;
}) {
  const { updateProfile, uploadProfilePicture } = useProfile();
  const isAdmin = profile.role === "ClubAdmin";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);

  const { control, handleSubmit } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      profileName: profile.profileName,
      profileBio: profile.profileBio ?? "",
      weapon: profile.weapon ?? undefined,
      skillLevel: profile.skillLevel ?? undefined,
      contactInfo: profile.contactInfo ?? "",
    },
  });

  const stagedPreviewUrl = useMemo(
    () => (stagedFile ? URL.createObjectURL(stagedFile) : null),
    [stagedFile],
  );

  useEffect(() => {
    return () => {
      if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
    };
  }, [stagedPreviewUrl]);

  const currentPhotoUrl =
    stagedPreviewUrl ??
    (profile.profileImageUrl
      ? resolveImageUrl(profile.profileImageUrl)
      : "/images/placeholder.jpg");

  const isSaving = updateProfile.isPending || uploadProfilePicture.isPending;

  async function onSubmit(data: ProfileSchema) {
    try {
      if (stagedFile) {
        await uploadProfilePicture.mutateAsync(stagedFile);
      }

      await updateProfile.mutateAsync({
        profileName: data.profileName,
        profileBio: data.profileBio,
        weapon: isAdmin ? undefined : data.weapon,
        skillLevel: isAdmin ? undefined : data.skillLevel,
        contactInfo: isAdmin ? data.contactInfo : undefined,
      });

      toast.success("Profile updated successfully.");
      onOpenChange(false);
    } catch (error) {
      let message =
        "Something went wrong while updating your profile. Please try again.";
      if (isAxiosError(error) && !error.response) {
        message = "Unable to reach the server. Please check your connection.";
      }
      toast.error(message);
    }
  }

  return (
    <>
      <form id="form-profile" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <img
              src={currentPhotoUrl}
              alt="Profile preview"
              className="size-16 shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <CameraIcon />
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, or WEBP. Max 5MB.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => setStagedFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Name */}
          <Controller
            name="profileName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="profile-name"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Bio */}
          <Controller
            name="profileBio"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
                <Textarea
                  {...field}
                  id="profile-bio"
                  placeholder="Tell other members a bit about yourself."
                  rows={3}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {isAdmin ? (
            /* Contact Info (Club Admin only) */
            <Controller
              name="contactInfo"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="profile-contact-info">
                    Club Contact Information
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="profile-contact-info"
                    placeholder="How should members reach the club? e.g. email, phone, enquiry hours."
                    rows={4}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Weapon of Choice (Member only) */}
              <Controller
                name="weapon"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="profile-weapon">
                      Weapon of Choice
                    </FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <SelectTrigger id="profile-weapon" className="w-full">
                        <SelectValue placeholder="Not set" />
                      </SelectTrigger>
                      <SelectContent>
                        {weaponItems.map((weapon) => (
                          <SelectItem key={weapon.value} value={weapon.value}>
                            {weapon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Skill Level (Member only) */}
              <Controller
                name="skillLevel"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="profile-skill-level">
                      Skill Level
                    </FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <SelectTrigger id="profile-skill-level" className="w-full">
                        <SelectValue placeholder="Not set" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillLevelItems.map((skillLevel) => (
                          <SelectItem
                            key={skillLevel.value}
                            value={skillLevel.value}
                          >
                            {skillLevel.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          )}
        </FieldGroup>
      </form>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          id="profile-save-btn"
          type="submit"
          form="form-profile"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </>
  );
}
