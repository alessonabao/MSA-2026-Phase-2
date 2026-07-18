import type { Activity } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import ActivitiesDashboard from "./dashboard/ActivitiesDashboard";

export default function Activities() {
  const [clubActivities, setClubActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);

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

  return (
    <>
      <div>
        <h1 className="text-4xl font-semibold tracking-wide pb-8">
          Events Discovery
        </h1>
        <ActivitiesDashboard
          activities={clubActivities}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          selectedActivity={selectedActivity}
        />
      </div>
    </>
  );
}
