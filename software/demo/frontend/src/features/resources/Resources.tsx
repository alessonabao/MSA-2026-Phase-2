import { Card, CardContent } from "@/components/ui/card";
import VideoCarousel from "./VideoCarousel";
import {
  Dumbbell,
  PersonStanding,
  Footprints,
  Sword,
  Swords,
} from "lucide-react";

const weaponInfo = [
  {
    title: "Foil",
    duration: "2:24",
    description:
      "Foil is often introduced as a beginner weapon because it teaches the foundations of fencing technique. Points are scored using the tip of the blade with the torso as a target area. Foil also uses the concept of right of way, meaning fencers must understand the order of attacks and defensive actions",
    videoSrc: "https://www.youtube.com/embed/g-P_q5gdvRM",
  },
  {
    title: "Épée",
    duration: "2:16",
    description:
      "Épée is the closest weapon to traditional duelling. The entire body is a valid target and there are no right-of-way rules. This makes timing, patience, and strategy especially important.",
    videoSrc: "https://www.youtube.com/embed/88mBQ2u2Wb0",
  },
  {
    title: "Sabre",
    duration: "2:52",
    description:
      "Sabre is the fastest fencing discipline. Fencers can score using both the tip and edge of the blade, with the valid target area including everything above the waist except the hands. Sabre focuses heavily on speed, reactions, and aggressive attacks.",
    videoSrc: "https://www.youtube.com/embed/g-P_q5gdvRM",
  },
];

const trainingItems = [
  {
    icon: <Dumbbell className="w-10 h-10" />,
    label: "Warm-up exercises",
  },
  {
    icon: <PersonStanding className="w-10 h-10" />,
    label: "Learning the en garde position",
  },
  {
    icon: <Footprints className="w-10 h-10" />,
    label: "Practising footwork",
  },
  {
    icon: <Sword className="w-10 h-10" />,
    label: "Basic weapon movements",
  },
  { icon: <Swords className="w-10 h-10" />, label: "Partner drills" },
];

export default function Resources() {
  return (
    <>
      {/* Introduction */}
      <div id="introduction-section">
        <Card className="relative overflow-hidden w-full h-100 border-none rounded-xl">
          {/* The background image */}
          <img
            src="images/placeholder.jpg"
            alt="Scenic landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Text Content Container */}
          <CardContent className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
            <h3 className="page-title">Welcome to the art of Fencing</h3>
            <p className="text-lg text-gray-200 mt-1">
              Fencing is a sport that combines physical agility, strategy, and
              discipline. From your first lunge to club competition, En Garde is
              your technical parter in excellence.
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Fencing Position */}
      <div>
        <h2 className="section-title">Learning the Basic Fencing Position</h2>
        <p>
          The first skill every fencer learns is the en garde position. This is
          the ready position used before starting a movement or a bout. A good
          en garde position provides balance and allows you to move quickly in
          any direction. Your knees should be slightly bent, your body relaxed,
          and your weight evenly distributed between both legs. Your weapon hand
          should be ready while maintaining control and awareness of your
          opponent. The goal is not to stand still, but to create a position
          where you are always prepared to attack, defend, or move away.
        </p>
        <div className="grid grid-cols-1 gap-6 pt-4">
          <Card className="overflow-hidden border border-border rounded-xl p-0 gap-0">
            {/* Video with duration badge*/}
            <div className="relative aspect-video max-h-90 bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/tWZ_Tnsl7lU"
                title="The En Garde Position"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {/* Duration badge */}
              <span className="absolute bottom-3 left-3 bg-[#1a2a4a]/90 text-white text-xs font-mono font-semibold px-2 py-0.5 rounded">
                3:17
              </span>
            </div>
            {/* Text content */}
            <CardContent className="p-5 space-y-2 grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Advance</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  An advance is a forward movement used to close distance with
                  your opponent. The front foot moves first, followed by the
                  back foot, while maintaining your fencing stance.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">Retreat</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A retreat moves backwards to create distance or avoid an
                  opponent's attack. The back foot moves first, followed by the
                  front foot.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">Lunge</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The lunge is an attacking movement where the fencer extends
                  their weapon arm and pushes forward to reach the opponent.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Weapons info */}
      <VideoCarousel
        heading="Understanding the Three Fencing Weapons"
        items={weaponInfo}
      />
      {/* Fencing Equipment */}
      <div>
        <h2 className="section-title">Understanding Fencing Equipment</h2>
        <Card className="overflow-hidden border border-border rounded-xl p-0 gap-0">
          {/* Video with duration badge*/}
          <div className="relative aspect-video max-h-110 bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/hewxp0mFlj0"
              title="Fencing 101. The Uniform, Blades, and how to order equipment."
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Duration badge */}
            <span className="absolute bottom-3 left-3 bg-[#1a2a4a]/90 text-white text-xs font-mono font-semibold px-2 py-0.5 rounded">
              10:26
            </span>
          </div>

          {/* Text content */}
          <CardContent className="p-5 space-y-2">
            <div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Fencing uses specialised protective equipment designed to keep
                athletes safe during training and competitions. Beginners
                usually start with club-provided equipment, including a mask,
                jacket, glove, and weapon. Comfortable athletic clothing and
                indoor sports shoes are usually recommended for first sessions.
                As you continue fencing, you may choose to purchase your own
                equipment. A properly fitted glove, comfortable mask, and
                reliable weapon can make training more enjoyable and consistent.
                Before every session, fencers should check that their equipment
                is secure and in good condition.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Training */}
      <div className="ml-15 mr-15 mt-6">
        <h2 className="section-title text-center">
          What Happens During Your First Beginner Training Session?
        </h2>
        <div className="mt-4 space-y-4 flex flex-col items-center">
          {trainingItems.map((trainingItem) => (
            <div
              key={trainingItem.label}
              className="flex items-center gap-4 w-72"
            >
              {trainingItem.icon}
              <span className="text-lg font-medium">{trainingItem.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Community */}
      <div id="community-section">
        <Card className="relative overflow-hidden w-full h-100 border-none rounded-xl mt-6">
          {/* The background image */}
          <img
            src="images/weaponImages/Sabre.jpg"
            alt="Scenic landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Text Content Container */}
          <CardContent className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
            <h3 className="page-title">Becoming Part of the Fencing Club</h3>
            <p className="text-lg text-gray-200 mt-1">
              Joining a fencing club is about more than learning how to fence.
              It is about becoming part of a supportive community where people
              encourage each other to learn, improve, and enjoy the sport
              together. Whether you're picking up a sword for the first time or
              returning after years away, you'll find a place where everyone
              starts somewhere and every achievement is celebrated.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
