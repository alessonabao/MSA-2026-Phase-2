import ActivityCard from "./ActivityCard";
import { useActivities, useMyAttendedActivities } from "@/lib/hooks/useActivities";
import { useAccount } from "@/lib/hooks/useAccount";
import { filterActivities } from "./ActivityFilters";
import { useActivityFilterStore } from "@/lib/stores/useActivityFilterStore";

function ActivityList() {
  const { currentUser } = useAccount();
  const { activities, isLoading } = useActivities();
  const { myAttendedActivities } = useMyAttendedActivities();
  const filters = useActivityFilterStore((state) => state.filters);

  if (!currentUser) {
    return "You need to be logged in to view events.";
  }

  if (!activities || isLoading) {
    return "Loading...";
  }

  const goingActivityIds = new Set(
    myAttendedActivities
      .filter((a) => !a.isCancelled)
      .map((a) => a.activity.id),
  );
  const filteredActivities = filterActivities(
    activities,
    filters,
    goingActivityIds,
  );

  if (filteredActivities.length === 0) {
    return "No activities match the selected filters.";
  }

  return (
    <>
      {filteredActivities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </>
  );
}
export default ActivityList;
