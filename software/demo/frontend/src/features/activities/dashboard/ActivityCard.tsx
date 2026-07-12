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
};

export default function ActivityCard({ activity }: Props) {
  return (
    <>
      <Card className="relative mx-auto w-full max-w pt-0 mb-10">
        <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
        <img
          src="/sabre.jpg"
          alt="Event cover"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        <CardHeader>
          <CardAction>
            <Badge variant="secondary">{activity.weapon}</Badge>
            <Badge variant="secondary">{activity.skillLevel}</Badge>
            <Badge variant="secondary">{activity.type}</Badge>
          </CardAction>
          <CardTitle>{activity.title}</CardTitle>
          <CardDescription>{activity.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Date */}
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{activity.date}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{activity.venue}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">${activity.price}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <Clock7 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                {activity.startTime} - {activity.endTime}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">View Event</Button>
        </CardFooter>
      </Card>
    </>
  );
}
