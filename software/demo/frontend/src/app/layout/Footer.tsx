import { Camera } from "lucide-react";
import { Link } from "react-router";
import { useAccount } from "@/lib/hooks/useAccount";

export default function Footer() {
  const { currentUser } = useAccount();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary">
              En Garde Auckland
            </h3>

            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              Fencing Club's community hub for fencing events and beginner
              resources to help members learn, compete, and connect with fellow
              fencers.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Navigation
            </p>

            <nav className="flex flex-col gap-3 text-sm">
              <Link
                to="/activities"
                className="transition-colors hover:text-primary"
              >
                Events
              </Link>

              <Link
                to="/resources"
                className="transition-colors hover:text-primary"
              >
                Resources
              </Link>

              {currentUser && (
                <Link
                  to={`/profile/${currentUser.id}`}
                  className="transition-colors hover:text-primary"
                >
                  Profile
                </Link>
              )}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Follow Us
            </p>

            <a
              href="https://www.instagram.com/aucklandunifencing/"
              target="_blank"
              rel="noreferrer"
              className="flex w-fit items-center gap-2 text-sm transition-colors hover:text-primary"
            >
              <Camera className="h-5 w-5" />
              Instagram
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-6 border-t pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 En Garde Auckland Fencing Club</p>

          <div className="flex items-center gap-8">
            <span className="uppercase tracking-wider">Sponsored by</span>

            <a
              href="https://gameon.co.nz/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-foreground"
            >
              <span>GameOn</span>
            </a>

            <a
              href="https://www.gongcha.co.nz/web/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-foreground"
            >
              <span>Gong cha</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
