import type { Activity } from "@/lib/types";
import { useState } from "react";
import ActivitiesDashboard from "./dashboard/ActivitiesDashboard";
import { Button } from "@/components/ui/button";
import { useActivities } from "@/lib/hooks/useActivities";

export default function Activities() {
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);
  const { activities, isPending } = useActivities();

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities!.find((activity) => activity.id === id));
  };

  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
  };

  const handleOpenForm = (id?: string) => {
    if (id) {
      handleSelectActivity(id);
    } else {
      handleCancelSelectActivity();
    }
    setEditMode(true);
  };

  const handleFormClose = () => {
    setEditMode(false);
  };

  const handleDelete = (id: string) => {
    // setClubActivities(
    //   clubActivities.filter((clubActivity) => clubActivity.id !== id),
    // );
    console.log(id);
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-4">
          <div className="col-span-3">
            <h1 className="text-4xl font-semibold tracking-wide pb-8">
              Events Discovery
            </h1>
          </div>
          <div className="flex pt-1 justify-center">
            <Button
              id="create-event-btn"
              className="px-8 py-4 text-lg"
              onClick={() => handleOpenForm()}
            >
              Create an Event
            </Button>
          </div>
        </div>
        {!activities || isPending ? (
          <h1>Loading...</h1>
        ) : (
          <ActivitiesDashboard
            activities={activities}
            selectActivity={handleSelectActivity}
            cancelSelectActivity={handleCancelSelectActivity}
            selectedActivity={selectedActivity}
            editMode={editMode}
            openForm={handleOpenForm}
            closeForm={handleFormClose}
            deleteActivity={handleDelete}
          />
        )}
      </div>
    </>
  );
}
