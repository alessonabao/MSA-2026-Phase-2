import type { Activity } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

// icons
import {
  CalendarDays,
  Wallet,
  MapPin,
  Clock7,
  EllipsisVertical,
  TrashIcon,
  BookHeart,
} from "lucide-react";
import { useNavigate } from "react-router";
import { formatDate, getInitials, resolveImageUrl } from "@/lib/utils";
import { useAccount } from "@/lib/hooks/useAccount";
import {
  useActivities,
  useActivityAttendees,
  useMyAttendedActivities,
} from "@/lib/hooks/useActivities";
import AttendeeList from "../AttendeeList";

type Props = {
  activity: Activity;
};

function getAttendeesLabel(names: string[]) {
  if (names.length === 0) return "no one";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;

  const extraCount = names.length - 2;
  return `${names[0]}, ${names[1]} +${extraCount} ${extraCount === 1 ? "other" : "others"}`;
}

export default function ActivityCard({ activity }: Props) {
  const navigate = useNavigate();
  const { currentUser } = useAccount();
  const { deleteActivity } = useActivities();
  const { attendees } = useActivityAttendees(activity.id);
  const { myAttendedActivities } = useMyAttendedActivities();
  const isHost = currentUser?.role === "ClubAdmin";
  const myAttendance = myAttendedActivities.find(
    (a) => a.activity.id === activity.id,
  );
  const isGoing = !!myAttendance && !myAttendance.isCancelled;
  const isCancelled = !!myAttendance?.isCancelled;

  // Priority: the event itself being cancelled by an admin outranks the
  // current user's own attendance relationship, which in turn outranks
  // "you are hosting" (a ClubAdmin has no ActivityAttendance row of their own).
  const status = activity.isCancelled
    ? { label: "Event Cancelled", variant: "destructive" as const }
    : isCancelled
      ? { label: "Cancelled", variant: "destructive" as const }
      : isHost
        ? { label: "You are hosting", variant: "default" as const }
        : isGoing
          ? { label: "Attending", variant: "success" as const }
          : null;

  const visibleAttendees = attendees.slice(0, 3);
  const hiddenAttendeesCount = attendees.length - visibleAttendees.length;

  return (
    <>
      <Card className="relative mx-auto w-full max-w mb-10 pt-5">
        <CardHeader>
          <CardAction>
            <Badge id="card-activity-weapon" variant="secondary">
              {activity.weapon}
            </Badge>
            <Badge id="card-activity-skillLevel" variant="secondary">
              {activity.skillLevel}
            </Badge>
            <Badge id="card-activity-type" variant="secondary">
              {activity.type}
            </Badge>
            {status && <Badge variant={status.variant}>{status.label}</Badge>}
            {/* Delete event menu */}
            {isHost && (
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive"
                      >
                        <TrashIcon />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this event?</AlertDialogTitle>

                    <AlertDialogDescription>
                      This will permanently remove{" "}
                      <strong>{activity.title}</strong>. This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      variant="destructive"
                      disabled={deleteActivity.isPending}
                      onClick={() => {
                        deleteActivity.mutate(activity.id, {
                          onSuccess: () => {
                            toast.success("Event deleted", {
                              description: `"${activity.title}" has been deleted successfully.`,
                            });
                          },
                          onError: () => {
                            toast.error("Failed to delete event", {
                              description: "Please try again.",
                            });
                          },
                        });
                      }}
                    >
                      <TrashIcon />
                      Delete Event
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardAction>
          <CardTitle id="card-activity-title">{activity.title}</CardTitle>
          <CardDescription
            id="card-activity-description"
            className="line-clamp-2 pt-4"
          >
            {activity.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Date */}
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span id="card-activity-date" className="text-sm">
                {formatDate(activity.date)}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span id="card-activity-venue" className="text-sm">
                {activity.venue}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-muted-foreground" />
              <span id="card-activity-price" className="text-sm">
                $ {activity.price}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <Clock7 className="h-5 w-5 text-muted-foreground" />
              <span id="card-activity-startTime" className="text-sm">
                {activity.startTime} -
              </span>
              <span id="card-activity-endTime" className="text-sm">
                {activity.endTime}
              </span>
            </div>

            {/* Organiser */}
            <div className="flex items-center gap-2">
              <BookHeart className="h-5 w-5 text-muted-foreground" />
              <span id="card-activity-organiser" className="text-sm">
                {`Organised by Fencing Club`}
              </span>
            </div>

            {/* Attendees */}
            <div className="flex min-w-0 items-center gap-2">
              <AttendeeList
                attendees={attendees}
                trigger={
                  <Button
                    variant="ghost"
                    className="w-full min-w-0 justify-start gap-2 px-2"
                  >
                    <AvatarGroup className="shrink-0">
                      {visibleAttendees.map((attendee) => (
                        <Avatar key={attendee.userId}>
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
                      ))}
                      {hiddenAttendeesCount > 0 && (
                        <AvatarGroupCount>
                          +{hiddenAttendeesCount}
                        </AvatarGroupCount>
                      )}
                    </AvatarGroup>
                    <span
                      id="card-activity-attendee"
                      className="min-w-0 flex-1 truncate text-left text-sm"
                    >
                      {`Joined by ${getAttendeesLabel(attendees.map((a) => a.profileName))}`}
                    </span>
                  </Button>
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            id="card-view-event-btn"
            className="w-full col-span-2"
            onClick={() => navigate(`${activity.id}`)}
          >
            View Event
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
