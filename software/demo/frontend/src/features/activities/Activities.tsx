import type { Activity } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import ActivitiesDashboard from "./dashboard/ActivitiesDashboard";

export default function Activities() {
  const [clubActivities, setClubActivities] = useState<Activity[]>([]);

  useEffect(() => {
    axios
      .get<Activity[]>("http://localhost:5000/api/activities")
      .then((response) => setClubActivities(response.data));
  }, []);

  return (
    <>
      <div>
        <h1>Events Discovery</h1>
        <ActivitiesDashboard activities={clubActivities} />
      </div>
    </>
  );
}
