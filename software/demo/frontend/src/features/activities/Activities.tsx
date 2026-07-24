import type { Activity } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import ActivitiesDashboard from "./dashboard/ActivitiesDashboard";
import { Button } from "@/components/ui/button";

export default function Activities() {
  const [clubActivities, setClubActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get<Activity[]>("http://localhost:5000/api/activities")
      .then((response) => setClubActivities(response.data));
  }, []);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(clubActivities.find((activity) => activity.id === id));
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

        <ActivitiesDashboard
          activities={clubActivities}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          openForm={handleOpenForm}
          closeForm={handleFormClose}
        />
      </div>
    </>
  );
}
