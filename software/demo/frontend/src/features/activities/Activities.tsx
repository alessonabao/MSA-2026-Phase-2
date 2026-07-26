import { Button } from "@/components/ui/button";
import ActivitiesDashboard from "./dashboard/ActivitiesDashboard";
import { useNavigate } from "react-router";

export default function Activities() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] items-center gap-6">
        <div className="flex items-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide">
            Events Discovery
          </h1>
        </div>

        <div className="flex">
          <Button
            id="create-event-btn"
            className="w-full text-lg"
            onClick={() => navigate("createActivity")}
          >
            Create an Event
          </Button>
        </div>
      </div>

      <ActivitiesDashboard />
    </div>
  );
}
