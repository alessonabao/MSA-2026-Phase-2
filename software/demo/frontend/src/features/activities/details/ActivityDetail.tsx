import type { Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// icons
import { CalendarDays } from "lucide-react";

type Props = {
  activity: Activity;
  cancelSelectActivity: () => void;
};

export default function ActivityDetail({
  activity,
  cancelSelectActivity,
}: Props) {
  return (
    <>
      <Card className="relative mx-auto w-full max-w-sm pt-0">
        <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
        <img
          src={`/images/weaponImages/${activity.weapon}.jpg`}
          alt="Event cover"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        <CardHeader>
          <CardTitle>{activity.title}</CardTitle>
          <CardDescription>{activity.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Date */}
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">{activity.date}</span>
          </div>
        </CardContent>
        <CardFooter className="grid grid-rows-2">
          <Button>Edit</Button>
          <Button variant="secondary" onClick={cancelSelectActivity}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
