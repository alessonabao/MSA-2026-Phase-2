import ActivityCard from "./ActivityCard";
import { useActivities } from "@/lib/hooks/useActivities";
import { filterActivities, type ActivityFilters } from "./ActivityFilters";

type Props = {
  filters: ActivityFilters;
};

function ActivityList({ filters }: Props) {
  const { activities, isPending } = useActivities();

  if (!activities || isPending) {
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
