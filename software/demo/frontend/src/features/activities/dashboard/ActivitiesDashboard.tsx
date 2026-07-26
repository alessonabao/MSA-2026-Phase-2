import ActivityList from "./ActivityList";

export default function ActivitiesDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr]">
        {/* Events Cards*/}
        <div>
          <ActivityList />
        </div>

        {/* Events Actions */}
        <div>Activity Filters</div>
      </div>
    </>
  );
}
