import type { Activity } from "@/lib/types";
import ActivityList from "./ActivityList";

type Props = {
  activities: Activity[];
};

export default function ActivitiesDashboard({ activities }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr]">
        {/* Events Cards*/}
        <div className="bg-amber-500">
          <ActivityList activities={activities} />
        </div>

        {/* Events Actions */}
        <div className="bg-green-500"></div>
      </div>
    </>
  );
}
