import { NavLink, useNavigate } from "react-router";
import { Menu } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAccount } from "@/lib/hooks/useAccount";
import { useProfile } from "@/lib/hooks/useProfile";
import { useUIStore } from "@/lib/stores/useUIStore";
import { useGamificationStore } from "@/lib/stores/useGamificationStore";

export default function NavBar() {
  const { theme } = useTheme();
  const { currentUser, logoutUser } = useAccount();
  const navigate = useNavigate();

  // `useProfile` is already subscribed elsewhere (the Profile page) via
  // TanStack Query - calling it again here doesn't trigger a second network
  // request, it just reads the same cached data. That's how server state
  // (the badge list) stays accessible from anywhere without prop drilling;
  // it's only the "has the user seen this badge yet" bit below that needs
  // Zustand, because there's no server concept of "seen".
  const { profile } = useProfile();
  const getUnseenBadges = useGamificationStore(
    (state) => state.getUnseenBadges,
  );
  const unseenBadgeCount = currentUser
    ? getUnseenBadges(profile?.badges ?? []).length
    : 0;

  // Mobile nav Sheet is controlled via the shared UI store (instead of
  // Radix's uncontrolled internal state) so nav links below can close it
  // when tapped, not just the SheetTrigger that opened it.
  const isMobileNavOpen = useUIStore((state) => state.isMobileNavOpen);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);
  const closeMobileNav = useUIStore((state) => state.closeMobileNav);

  const handleLogout = () => {
    logoutUser.mutate(undefined, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <header className="bg-background text-foreground border-b border-border">
      {/* Main navbar container */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left — branding */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src={
              theme === "dark"
                ? "/images/dark-icon-md.png"
                : "/images/light-icon-md.png"
            }
            alt="En Garde Logo"
            className="h-9 w-9"
          />
          <h1 className="text-lg font-semibold tracking-wide">En Garde</h1>
        </NavLink>

        {/* Centre — navigation links Hidden on smaller screens. Displayed from the md breakpoint onwards. */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/activities"
            id="nav-events"
            end
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-primary pb-0.5 text-md font-semibold text-foreground"
                : "text-md text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/resources"
            id="nav-resources"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-primary pb-0.5 text-md font-semibold text-foreground"
                : "text-md text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Resources
          </NavLink>

          {currentUser ? (
            <NavLink
              to={`/profile/${currentUser.id}`}
              id="nav-profile"
              className={({ isActive }) =>
                (isActive
                  ? "border-b-2 border-primary pb-0.5 text-md font-semibold text-foreground"
                  : "text-md text-muted-foreground transition-colors hover:text-foreground") +
                " relative"
              }
            >
              Profile
              {unseenBadgeCount > 0 && (
                <span className="absolute -right-2 -top-1 size-2 rounded-full bg-primary" />
              )}
            </NavLink>
          ) : (
            ""
          )}
        </nav>

        {/* Right — actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {/* Desktop button */}
          {currentUser ? (
            <Button
              id="nav-logout-btn"
              size="lg"
              className="hidden md:flex"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <NavLink to="/login">
              <Button id="nav-login-btn" size="lg" className="hidden md:flex">
                Login
              </Button>
            </NavLink>
          )}

          {/* Mobile navigation */}
          <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                id="mobile-nav-menu"
                variant="outline"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              {/* Mobile navigation menu */}
              <div className="mt-8 ml-8 mr-8 flex flex-col gap-6">
                <NavLink
                  to="/activities"
                  id="mobile-nav-events"
                  end
                  onClick={closeMobileNav}
                  className={({ isActive }) =>
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  Events
                </NavLink>

                <NavLink
                  to="/resources"
                  id="mobile-nav-resources"
                  onClick={closeMobileNav}
                  className={({ isActive }) =>
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  Resources
                </NavLink>

                {currentUser ? (
                  <NavLink
                    to={`/profile/${currentUser?.id}`}
                    id="mobile-nav-profile"
                    onClick={closeMobileNav}
                    className={({ isActive }) =>
                      (isActive
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground") +
                      " relative"
                    }
                  >
                    Profile
                    {unseenBadgeCount > 0 && (
                      <span className="absolute -right-3 top-0 size-2 rounded-full bg-primary" />
                    )}
                  </NavLink>
                ) : (
                  ""
                )}

                {currentUser ? (
                  <Button
                    id="mobile-nav-logout-btn"
                    className="mt-4 w-full"
                    onClick={() => {
                      closeMobileNav();
                      handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <NavLink to="/login" onClick={closeMobileNav}>
                    <Button id="mobile-nav-login-btn" className="mt-4 w-full">
                      Login
                    </Button>
                  </NavLink>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
