import ActivityList from "./ActivityList";
import ActivityDashboardSidebar from "./ActivityDashboardSidebar";
import { useActivities } from "@/lib/hooks/useActivities";
import { useAccount } from "@/lib/hooks/useAccount";

// Filters used to live here as useState and get threaded down through props
// to both children below. They now live in useActivityFilterStore (Zustand),
// so each child reads/writes the slice it needs directly - see ActivityList
// and ActivityDashboardSidebar.
export default function ActivitiesDashboard() {
  const { activities } = useActivities();
  const { currentUser } = useAccount();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr]">
      {/* Events Cards*/}
      <div className="pt-4">
        <ActivityList />
      </div>

      {/* Events Actions */}
      {currentUser && (
        <div className="pt-4">
          <ActivityDashboardSidebar activities={activities} />
        </div>
      )}
    </div>
  );
}
