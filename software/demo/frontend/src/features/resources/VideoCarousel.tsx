import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type CarouselItem = {
  title: string;
  duration: string;
  description: string;
  videoSrc: string;
};

type Props = {
  heading: string;
  items: CarouselItem[];
  itemsPerPage?: number;
};

export default function VideoCarousel({
  heading,
  items,
  itemsPerPage = 2,
}: Props) {
  const [page, setPage] = useState(0);

  // Show 2 items at a time
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const visible = items.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage,
  );

  const colClass =
    itemsPerPage === 1
      ? "md:grid-cols-1"
      : itemsPerPage === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div id="weapons-section">
      <div id="weapons-header" className="grid grid-cols-4">
        <div className="section-title col-span-3">{heading}</div>
        <div id="weapons-carousel-btn">
          {/* Previous / Next buttons in weapons section */}
          <section className="px-[50%] py-5 max-w-6xl mx-auto">
            <div className="flex gap-2 mt-1">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                disabled={page === 0}
                className="h-10 w-10 rounded-md"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {/* Next Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                disabled={page === totalPages - 1}
                className="h-10 w-10 rounded-md"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        </div>
      </div>
      <div id="weapons-content">
        <div className={`grid grid-cols-1 gap-5 ${colClass}`}>
          {visible.map((item) => (
            <Card
              key={item.title}
              className="overflow-hidden border border-border rounded-xl p-0 gap-0"
            >
              {/* Video with duration badge */}
              <div className="relative aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={item.videoSrc}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* Duration badge */}
                <span className="absolute bottom-3 left-3 bg-[#1a2a4a]/90 text-white text-xs font-mono font-semibold px-2 py-0.5 rounded">
                  {item.duration}
                </span>
              </div>
              {/* Text content */}
              <CardContent className="p-5 space-y-2">
                <h3 className="text-lg font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Page indicator dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === page
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
