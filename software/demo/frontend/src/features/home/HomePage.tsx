import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
      {/* Heading */}
      <div id="introduction-section">
        <Card className="relative overflow-hidden w-full h-100 border-none rounded-xl">
          {/* The background image */}
          <img
            src="images/weaponImages/Foil.jpg"
            alt="Scenic landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Text Content Container */}
          <CardContent className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
            <h3 className="page-title"> Welcome to the Fencing Club</h3>
            <p className="text-lg text-gray-200 mt-1">
              Our club caters to fencers of all skill levels, from complete
              beginners to experienced fencers. Whatever your level of
              experience and fitness, and whether you're a student or not, we
              welcome you to join us!
            </p>
          </CardContent>
        </Card>
      </div>
      {/* About us */}
      <div>
        <h1 className="text-4xl font-semibold tracking-wide pb-8 pt-8">
          About Us
        </h1>
        <div id="home-about-us" className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <img
              src="/images/weaponImages/Épée.jpg"
              alt="Foil"
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
          <div className="text-justify">
            We are a passionate student club willing to accept anyone keen to
            fence, both old and new! Our club offers a professional beginner's
            course led by an expert coach, one-on-one coaching, free club
            equipment, regular training sessions and social events. For
            beginners, have a wealth of experience you can learn from and we
            pride ourselves in making proper fencers out of you in just one
            semester. For our experienced fencers, we offer a great environment
            for both casual and competitive fencing right here in Hiwa. Are you
            ready to fence? En garde!
          </div>
        </div>
        {/* club values */}
        <div>
          <div className="ml-15 mr-15 mt-6">
            <h2 className="section-title text-center text-2xl">Our Values</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center text-2xl font-semibold tracking-wide">
                Inclusive
              </div>
              <div className="text-justify col-span-2">
                Everyone is welcome. We foster a friendly and supportive culture
                where members of all backgrounds and skill levels can feel at
                home.
              </div>
              <div className="text-center text-2xl font-semibold tracking-wide">
                Growth
              </div>
              <div className="text-justify col-span-2">
                We believe every fencer has room to improve. Through quality
                coaching, regular practice, and encouragement, we help our
                members reach their personal goals.
              </div>
              <div className="text-center text-2xl font-semibold tracking-wide">
                Respect
              </div>
              <div className="text-justify col-span-2">
                Sportsmanship is at the heart of fencing. We value respect for
                our teammates, opponents, coaches, officials, and the traditions
                of the sport.
              </div>
              <div className="text-center text-2xl font-semibold tracking-wide">
                Community
              </div>
              <div className="text-justify col-span-2">
                Our club is more than training sessions. We build friendships
                through social events, teamwork, and supporting one another both
                on and off the piste.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
