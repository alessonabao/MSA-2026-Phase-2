import type { Activity } from "@/lib/types";
import ActivityCard from "./ActivityCard";

type Props = {
  activities: Activity[];
};

function ActivityList({ activities }: Props) {
  return (
    <>
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </>
  );
}
export default ActivityList;
