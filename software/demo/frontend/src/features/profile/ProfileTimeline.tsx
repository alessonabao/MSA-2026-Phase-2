import { CalendarX } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAttendedActivities } from "@/lib/hooks/useActivities";
import { formatDate } from "@/lib/utils";

type Props = {
  userId?: string;
};

// Public on every profile, same as the badges tab - not restricted to the
// profile owner viewing their own page.
export default function ProfileTimeline({ userId }: Props) {
  const { attendedActivities, isLoadingAttendedActivities } =
    useAttendedActivities(userId);

  if (isLoadingAttendedActivities) {
    return <p className="text-muted-foreground">Loading timeline...</p>;
  }

  if (attendedActivities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <CalendarX className="size-6 text-muted-foreground" />
        </div>

        <p className="font-semibold">No events attended yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Joining an upcoming event will start building event history here.
        </p>

        <Button asChild size="sm" className="mt-1">
          <Link to="/activities">Browse Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {attendedActivities.map(({ activity, isCancelled }) => (
        <Link
          key={activity.id}
          to={`/activities/${activity.id}`}
          className="flex items-center justify-between gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <div>
            <p className="font-semibold">{activity.title}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(activity.date)}
            </p>
          </div>
          <Badge variant={isCancelled ? "destructive" : "success"}>
            {isCancelled ? "Cancelled" : "Attending"}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
