import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useActivities, useActivityAttendees } from "@/lib/hooks/useActivities";
import { useParams } from "react-router";
import { CalendarDays, MapPin, Clock7, Users } from "lucide-react";
import { formatDate, formatTimeRange } from "@/lib/utils";
import AttendeeList from "../AttendeeList";

function ActivityDetailsDescription() {
  const { id } = useParams();
  const { activity, isLoadingActivity } = useActivities(id);
  const { attendees } = useActivityAttendees(id);

  if (isLoadingActivity) {
    return null;
  }

  if (!activity) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 pl-8 pr-8 sm:grid-cols-2">
        {/* Date */}
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 shrink-0 text-muted-foreground" />
          <span id="card-activity-date" className="text-sm">
            {formatDate(activity.date)}
          </span>
        </div>
        {/* Time */}
        <div className="flex items-center gap-2">
          <Clock7 className="h-5 w-5 shrink-0 text-muted-foreground" />
          <span id="card-activity-time" className="text-sm">
            {formatTimeRange(activity.startTime, activity.endTime)}
          </span>
        </div>
        {/* Venue */}
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
          <span id="card-activity-venue" className="text-sm">
            {activity.venue}
          </span>
        </div>
        {/* Attendees */}
        <div className="flex items-center gap-2">
          <AttendeeList
            attendees={attendees}
            trigger={
              <Button variant="ghost" className="gap-2 px-2 justify-start">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span id="card-activity-attendee" className="text-sm">
                  {attendees.length}{" "}
                  {attendees.length === 1 ? "attendee" : "attendees"}
                </span>
              </Button>
            }
          />
        </div>
      </div>
      <Separator className="mt-4 mb-4" />
      <div>
        <div className="mb-4">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Description
          </h1>
        </div>
        {activity.description}
      </div>
      <Separator className="mt-4 mb-4" />
    </>
  );
}
export default ActivityDetailsDescription;
