import ActivityCard from "./ActivityCard";
import { useActivities } from "@/lib/hooks/useActivities";
import { useAccount } from "@/lib/hooks/useAccount";
import { filterActivities, type ActivityFilters } from "./ActivityFilters";

type Props = {
  filters: ActivityFilters;
};

function ActivityList({ filters }: Props) {
  const { currentUser } = useAccount();
  const { activities, isLoading } = useActivities();

  if (!currentUser) {
    return "You need to be logged in to view events.";
  }

  if (!activities || isLoading) {
    return "Loading...";
  }

  const filteredActivities = filterActivities(activities, filters);

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
