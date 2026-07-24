import type { Activity } from "@/lib/types";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";
import { ActivityForm } from "../form/ActivityForm";

type Props = {
  activities: Activity[];
  selectActivity: (id: string) => void;
  cancelSelectActivity: () => void;
  selectedActivity?: Activity;
  editMode: boolean;
  openForm: (id: string) => void;
  closeForm: () => void;
  submitForm: (activity: Activity) => void;
};

export default function ActivitiesDashboard({
  activities,
  selectActivity,
  cancelSelectActivity,
  selectedActivity,
  editMode,
  openForm,
  closeForm,
  submitForm,
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
          {selectedActivity && !editMode && (
            <ActivityDetail
              activity={selectedActivity}
              cancelSelectActivity={cancelSelectActivity}
              openForm={openForm}
            />
          )}
          {editMode && (
            <ActivityForm
              closeForm={closeForm}
              activity={selectedActivity}
              submitForm={submitForm}
            />
          )}
        </div>
      </div>
    </>
  );
}
