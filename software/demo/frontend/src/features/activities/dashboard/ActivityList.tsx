import type { Activity } from "@/lib/types";
import ActivityCard from "./ActivityCard";

type Props = {
  activities: Activity[];
  selectActivity: (id: string) => void;
};

function ActivityList({ activities, selectActivity }: Props) {
  return (
    <>
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          selectActivity={selectActivity}
        />
      ))}
    </>
  );
}
export default ActivityList;
