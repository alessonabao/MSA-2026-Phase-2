import type { Activity } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// icons
import { CalendarDays, Wallet, MapPin, Clock7 } from "lucide-react";

type Props = {
  activity: Activity;
  selectActivity: (id: string) => void;
};

export default function ActivityCard({ activity, selectActivity }: Props) {
  return (
    <>
      <Card className="relative mx-auto w-full max-w mb-10 pt-5">
        <CardHeader>
          <CardAction>
            <Badge id="card-activity-weapon" variant="secondary">
              {activity.weapon}
            </Badge>
            <Badge id="card-activity-skillLevel" variant="secondary">
              {activity.skillLevel}
            </Badge>
            <Badge id="card-activity-type" variant="secondary">
              {activity.type}
            </Badge>
          </CardAction>
          <CardTitle id="card-activity-title">{activity.title}</CardTitle>
          <CardDescription
            id="card-activity-description"
            className="line-clamp-2"
          >
            {activity.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Date */}
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span id="card-activity-date" className="text-sm">
                {activity.date}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span id="card-activity-venue" className="text-sm">
                {activity.venue}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-muted-foreground" />
              <span id="card-activity-price" className="text-sm">
                $ {activity.price}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <Clock7 className="h-5 w-5 text-muted-foreground" />
              <span id="card-activity-startTime" className="text-sm">
                {activity.startTime} -
              </span>
              <span id="card-activity-endTime" className="text-sm">
                {activity.endTime}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            id="card-view-event-btn"
            className="w-full"
            onClick={() => selectActivity(activity.id)}
          >
            View Event
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
