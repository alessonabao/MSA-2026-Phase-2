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
import { useNavigate, useParams } from "react-router";
import { useActivities } from "@/lib/hooks/useActivities";

export default function ActivityDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { activity, isLoadingActivity } = useActivities(id);

  if (isLoadingActivity) {
    return "Loading...";
  }

  if (!activity) {
    return "Activity not found";
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
          <Button onClick={() => navigate(`${activity.id}`)}>Edit</Button>
          <Button variant="secondary" onClick={() => navigate("/activities")}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
