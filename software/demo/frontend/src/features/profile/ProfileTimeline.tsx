import { CalendarX } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function ProfileTimeline() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <CalendarX className="size-6 text-muted-foreground" />
      </div>

      <p className="font-semibold">No events attended yet</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Join an upcoming event to start building your history.
      </p>

      <Button asChild size="sm" className="mt-1">
        <Link to="/activities">Browse Events</Link>
      </Button>
    </div>
  );
}
