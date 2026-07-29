import { useParams } from "react-router";
import { useActivities } from "@/lib/hooks/useActivities";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsDescription from "./ActivityDetailsDescription";
import ActivityDetailsForum from "./ActivityDetailsForum";

export default function ActivityDetailsPage() {
  const { id } = useParams();
  const { activity, isLoadingActivity } = useActivities(id);

  if (isLoadingActivity) {
    return "Loading...";
  }

  if (!activity) {
    return "Activity not found";
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityDetailsHeader />
          <ActivityDetailsDescription />
          <ActivityDetailsForum />
        </div>
        <div>
          <ActivityDetailsSidebar />
        </div>
      </div>
    </>
  );
}
