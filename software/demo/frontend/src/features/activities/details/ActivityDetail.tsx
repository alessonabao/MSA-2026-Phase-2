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
import { useActivities } from "@/lib/hooks/useActivities";

type Props = {
  selectedActivity: Activity;
  cancelSelectActivity: () => void;
  openForm: (id: string) => void;
};

export default function ActivityDetail({
  selectedActivity,
  cancelSelectActivity,
  openForm,
}: Props) {
  const { activities } = useActivities();
  const activity = activities?.find(
    (activi) => activi.id === selectedActivity.id,
  );

  if (!activity) {
    return "Loading...";
  }
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
        <CardFooter className="grid grid-rows-2 gap-2">
          <Button onClick={() => openForm(activity.id)}>Edit</Button>
          <Button variant="secondary" onClick={cancelSelectActivity}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
