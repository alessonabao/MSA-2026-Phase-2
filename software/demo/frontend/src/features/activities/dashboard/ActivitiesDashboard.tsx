import type { Activity } from "@/lib/types";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";
import { ActivityForm } from "../form/ActivityForm";

type Props = {
  activities: Activity[];
  selectActivity: (id: string) => void;
  cancelSelectActivity: () => void;
  selectedActivity?: Activity;
};

export default function ActivitiesDashboard({
  activities,
  selectActivity,
  cancelSelectActivity,
  selectedActivity,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr]">
        {/* Events Cards*/}
        <div>
          <ActivityList
            activities={activities}
            selectActivity={selectActivity}
          />
        </div>

        {/* Events Actions */}
        <div>
          {selectedActivity && (
            <ActivityDetail
              activity={selectedActivity}
              cancelSelectActivity={cancelSelectActivity}
            />
          )}
          <ActivityForm />
        </div>
      </div>
    </>
  );
}
