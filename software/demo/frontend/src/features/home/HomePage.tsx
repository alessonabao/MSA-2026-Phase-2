import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section id="introduction-section">
        <Card className="relative overflow-hidden rounded-xl border-none h-[350px] md:h-[450px]">
          <img
            src="/images/weaponImages/Foil.jpg"
            alt="Fencing Club"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <CardContent className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10 text-white">
            <h1 className="text-3xl font-semibold tracking-wide md:text-5xl">
              Welcome to the Fencing Club
            </h1>

            <p className="mt-4 max-w-3xl text-base text-gray-200 md:text-lg">
              Our club caters to fencers of all skill levels, from complete
              beginners to experienced fencers. Whatever your level of
              experience or fitness, and whether you're a student or not, we
              welcome you to join us.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* About Us */}
      <section className="py-12">
        <h2 className="mb-8 text-3xl font-semibold tracking-wide md:text-4xl">
          About Us
        </h2>

        <div
          id="home-about-us"
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          <div className="lg:col-span-2">
            <img
              src="/images/weaponImages/Epee.jpg"
              alt="Épée"
              className="aspect-video w-full rounded-xl object-cover"
            />
          </div>

          <div className="flex items-center">
            <p className="text-justify leading-8 text-muted-foreground">
              We are a welcoming community of students brought together by a
              shared passion for fencing. Whether you're picking up a weapon for
              the first time or have years of experience on the piste, there's a
              place for you in our club. We provide quality coaching, regular
              training sessions, club equipment, competitions, and social events
              that help members grow both as fencers and as part of a supportive
              community.
            </p>
          </div>
        </div>
      </section>

      {/* Club Values */}
      <section className="pb-12">
        <h2 className="mb-10 text-center text-3xl font-semibold tracking-wide">
          Our Values
        </h2>

        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-[220px_1fr] md:gap-x-10">
          <h3 className="text-center text-2xl font-semibold md:text-left">
            Inclusive
          </h3>

          <p className="text-justify leading-7 text-muted-foreground">
            Everyone is welcome. We foster a friendly and supportive culture
            where members of all backgrounds and skill levels can feel at home.
          </p>

          <h3 className="text-center text-2xl font-semibold md:text-left">
            Growth
          </h3>

          <p className="text-justify leading-7 text-muted-foreground">
            We believe every fencer has room to improve. Through quality
            coaching, regular practice, and encouragement, we help our members
            reach their personal goals.
          </p>

          <h3 className="text-center text-2xl font-semibold md:text-left">
            Respect
          </h3>

          <p className="text-justify leading-7 text-muted-foreground">
            Sportsmanship is at the heart of fencing. We value respect for our
            teammates, opponents, coaches, officials, and the traditions of the
            sport.
          </p>

          <h3 className="text-center text-2xl font-semibold md:text-left">
            Community
          </h3>

          <p className="text-justify leading-7 text-muted-foreground">
            Our club is more than training sessions. We build friendships
            through social events, teamwork, and supporting one another both on
            and off the piste.
          </p>
        </div>
      </section>
    </div>
  );
}
