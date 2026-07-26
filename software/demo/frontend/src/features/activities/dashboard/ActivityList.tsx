import ActivityCard from "./ActivityCard";
import { useActivities } from "@/lib/hooks/useActivities";

function ActivityList() {
  const { activities, isPending } = useActivities();

  if (!activities || isPending) {
    return "Loading...";
  }
  return (
    <>
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </>
  );
}
export default ActivityList;
