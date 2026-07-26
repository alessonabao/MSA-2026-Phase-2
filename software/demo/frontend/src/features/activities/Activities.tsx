import ActivitiesDashboard from "./dashboard/ActivitiesDashboard";
import { Button } from "@/components/ui/button";

export default function Activities() {
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
              onClick={() => {}}
            >
              Create an Event
            </Button>
          </div>
        </div>
        <ActivitiesDashboard />
      </div>
    </>
  );
}
