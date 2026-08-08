import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { useAccount } from "@/lib/hooks/useAccount";
import { useActivities } from "@/lib/hooks/useActivities";
import { Link, useParams } from "react-router";

// Asset filenames are plain ASCII (deploy zip tooling mangles accented filenames),
// so "Épée" needs a separate lookup from its display label.
const WEAPON_IMAGE_FILENAME: Record<string, string> = {
  Épée: "Epee",
};

export default function ActivityDetailsHeader() {
  const { id } = useParams();
  const { currentUser } = useAccount();
  const {
    activity,
    isLoadingActivity,
    attendance,
    joinActivity,
    cancelAttendance,
    cancelActivity,
    resumeActivity,
  } = useActivities(id);
  const isHost = currentUser?.role === "ClubAdmin";
  const isCancelled = activity?.isCancelled ?? false;
  const isGoing = attendance?.isGoing ?? false;
  const loading = joinActivity.isPending || cancelAttendance.isPending;

  if (isLoadingActivity) {
    return null;
  }

  if (!activity) {
    return null;
  }

  const handleToggleAttendance = () => {
    if (!id) return;

    const action = isGoing ? cancelAttendance : joinActivity;
    action.mutate(id, {
      onError: () => {
        toast.error(
          isGoing
            ? "Couldn't cancel your attendance. Please try again."
            : "Couldn't join the event. Please try again.",
        );
      },
    });
  };

  const handleCancelEvent = () => {
    if (!id) return;

    cancelActivity.mutate(id, {
      onSuccess: () => {
        toast.success("Event cancelled", {
          description: `"${activity.title}" has been cancelled.`,
        });
      },
      onError: () => {
        toast.error("Couldn't cancel the event. Please try again.");
      },
    });
  };

  const handleResumeEvent = () => {
    if (!id) return;

    resumeActivity.mutate(id, {
      onSuccess: () => {
        toast.success("Event resumed", {
          description: `"${activity.title}" is open again.`,
        });
      },
      onError: () => {
        toast.error("Couldn't resume the event. Please try again.");
      },
    });
  };

  return (
    <>
      <Card className="relative overflow-hidden rounded-xl pt-0 mb-4">
        {/* Cover Image */}
        <img
          src={`/images/weaponImages/${WEAPON_IMAGE_FILENAME[activity.weapon] ?? activity.weapon}.jpg`}
          alt={`${activity.weapon} fencing`}
          className="h-50 w-full object-cover brightness-60 grayscale sm:h-65 lg:h-80 dark:brightness-40"
        />

        {/* Cancelled Badge */}
        {isCancelled && (
          <Badge variant="destructive" className="absolute left-6 top-6 z-20">
            Cancelled
          </Badge>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

        {/* Information */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 p-4 text-white sm:gap-6 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {activity.title}
            </h1>

            <p className="mt-1 text-sm text-gray-200">Hosted by Fencing Club</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isHost ? (
              <>
                {isCancelled ? (
                  <Button
                    variant="success"
                    disabled={resumeActivity.isPending}
                    onClick={handleResumeEvent}
                  >
                    Resume Event
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Cancel Event</Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel this event?</AlertDialogTitle>

                        <AlertDialogDescription>
                          Every member currently going to{" "}
                          <strong>{activity.title}</strong> will have their RSVP
                          cancelled and notified in their event timeline. Even
                          if you resume the event afterwards, those RSVPs can't
                          be restored. Attendees would need to rejoin
                          themselves.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Event</AlertDialogCancel>

                        <AlertDialogAction
                          variant="destructive"
                          disabled={cancelActivity.isPending}
                          onClick={handleCancelEvent}
                        >
                          Cancel Event
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                <Button asChild disabled={isCancelled}>
                  <Link to={`/manage/${activity.id}`}>Manage Event</Link>
                </Button>
              </>
            ) : (
              <Button
                variant={isGoing ? "secondary" : "success"}
                disabled={isCancelled || loading}
                onClick={handleToggleAttendance}
              >
                {isGoing ? "Cancel Attendance" : "Join Event"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
