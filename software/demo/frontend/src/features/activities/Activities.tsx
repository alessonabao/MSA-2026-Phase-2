import type { Activity } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";

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
        <ul>
          {clubActivities.map((activity) => (
            <li key={activity.id}>{activity.title}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
