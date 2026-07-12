import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function NavBar() {
  const { theme } = useTheme();

  return (
    <header className="bg-background text-foreground border-b border-border">
      {/* Main navbar container */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left — branding */}
        <div className="flex items-center gap-3">
          <img
            src={theme === "dark" ? "/dark-icon-md.png" : "/light-icon-md.png"}
            alt="En Garde Logo"
            className="h-9 w-9"
          />
          <h1 className="text-lg font-semibold tracking-wide">En Garde</h1>
        </div>

        {/* Centre — navigation links Hidden on smaller screens. Displayed from the md breakpoint onwards. */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/"
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
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-primary pb-0.5 text-md font-semibold text-foreground"
                : "text-md text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Resources
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-primary pb-0.5 text-md font-semibold text-foreground"
                : "text-md text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Profile
          </NavLink>
        </nav>

        {/* Right — actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {/* Desktop button */}
          <Button size="lg" className="hidden md:flex">
            Create an Event
          </Button>

          {/* Mobile navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              {/* Mobile navigation menu */}
              <div className="mt-8 flex flex-col gap-6">
                <NavLink
                  to="/"
                  end
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
                  className={({ isActive }) =>
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  Resources
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  Profile
                </NavLink>

                <Button className="mt-4 w-full">Create an Event</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
