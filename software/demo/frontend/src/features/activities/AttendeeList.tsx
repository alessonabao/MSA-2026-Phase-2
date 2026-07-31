import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, resolveImageUrl } from "@/lib/utils";
import type { Attendee } from "@/lib/types";

type Props = {
  attendees: Attendee[];
  trigger: ReactNode;
};

// Shared between the event card and the activity details page so both render the
// same real ActivityAttendance-backed list instead of duplicating the dialog markup.
export default function AttendeeList({ attendees, trigger }: Props) {
  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex max-h-[85vh] flex-col">
        <DialogHeader>
          <DialogTitle>Attendee Details</DialogTitle>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar min-h-0 flex-1 overflow-y-auto px-4">
          {attendees.length === 0 && (
            <p className="py-2 text-sm text-muted-foreground">no one</p>
          )}
          {attendees.map((attendee) => (
            <div
              key={attendee.userId}
              className="flex min-w-0 items-center gap-3 py-2"
            >
              <Avatar>
                <AvatarImage
                  src={
                    attendee.profileImageUrl
                      ? resolveImageUrl(attendee.profileImageUrl)
                      : undefined
                  }
                  alt={`@${attendee.profileName}`}
                />
                <AvatarFallback>
                  {getInitials(attendee.profileName)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => navigate(`/profile/${attendee.userId}`)}
                className="min-w-0 truncate text-left text-sm font-medium hover:underline"
              >
                {attendee.profileName}
              </button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
