import { useState } from "react";
import ActivityList from "./ActivityList";
import ActivityDashboardSidebar from "./ActivityDashboardSidebar";
import { DEFAULT_ACTIVITY_FILTERS } from "./ActivityFilters";
import { useActivities } from "@/lib/hooks/useActivities";
import { useAccount } from "@/lib/hooks/useAccount";

export default function ActivitiesDashboard() {
  const [filters, setFilters] = useState(DEFAULT_ACTIVITY_FILTERS);
  const { activities } = useActivities();
  const { currentUser } = useAccount();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr]">
      {/* Events Cards*/}
      <div className="pt-4">
        <ActivityList filters={filters} />
      </div>

      {/* Events Actions */}
      {currentUser && (
        <div className="pt-4">
          <ActivityDashboardSidebar
            filters={filters}
            onFiltersChange={setFilters}
            activities={activities}
          />
        </div>
      )}
    </div>
  );
}
