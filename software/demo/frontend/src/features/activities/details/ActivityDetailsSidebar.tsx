import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { useActivities } from "@/lib/hooks/useActivities";

const MAP_BOUNDS_DELTA = 0.005;

export default function ActivityDetailsSidebar() {
  const { id } = useParams();
  const { activity, isLoadingActivity } = useActivities(id);

  if (isLoadingActivity) {
    return null;
  }

  if (!activity) {
    return null;
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${activity.latitude},${activity.longitude}`;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    activity.longitude - MAP_BOUNDS_DELTA
  }%2C${activity.latitude - MAP_BOUNDS_DELTA}%2C${
    activity.longitude + MAP_BOUNDS_DELTA
  }%2C${
    activity.latitude + MAP_BOUNDS_DELTA
  }&layer=mapnik&marker=${activity.latitude}%2C${activity.longitude}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Registration Fee */}
      <Card className="bg-muted">
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Registration Fee
            </p>
            <p className="text-3xl font-bold text-primary">
              {activity.price === 0 ? "FREE" : `$${activity.price.toFixed(2)}`}
            </p>
          </div>

          <Button
            size="lg"
            className="w-full font-bold tracking-wide uppercase"
          >
            Join Event
          </Button>
        </CardContent>
      </Card>

      {/* Venue */}
      <Card className="gap-0 py-0">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${activity.venue} on Google Maps`}
          className="group relative block aspect-video overflow-hidden bg-slate-400"
        >
          <iframe
            title={`Map of ${activity.venue}`}
            src={mapEmbedUrl}
            loading="lazy"
            className="pointer-events-none h-full w-full grayscale-25"
          />
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold tracking-widest text-white uppercase">
              View on Google Maps
            </span>
          </div>
        </a>

        <CardContent className="flex flex-col gap-1 py-(--card-spacing)">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Venue
          </p>
          <p className="text-base font-bold">{activity.venue}</p>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {activity.city}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
