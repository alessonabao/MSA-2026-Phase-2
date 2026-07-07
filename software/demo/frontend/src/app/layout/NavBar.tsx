import { NavLink } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <header className="bg-background text-foreground border-b border-border grid grid-cols-3 items-center px-16 py-8">
      {/* Left — branding */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold tracking-wide">En Garde</h1>
      </div>

      {/* Centre — nav links */}
      <nav className="flex items-center justify-center gap-8">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "text-foreground font-semibold border-b-2 border-primary pb-0.5 text-md"
              : "text-muted-foreground hover:text-foreground transition-colors text-md"
          }
        >
          Events
        </NavLink>

        <NavLink
          to="/resources"
          className={({ isActive }) =>
            isActive
              ? "text-foreground font-semibold border-b-2 border-primary pb-0.5 text-md"
              : "text-muted-foreground hover:text-foreground transition-colors text-md"
          }
        >
          Resources
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "text-foreground font-semibold border-b-2 border-primary pb-0.5 text-md"
              : "text-muted-foreground hover:text-foreground transition-colors text-md"
          }
        >
          Profile
        </NavLink>
      </nav>

      {/* Right — actions */}
      <div className="flex items-center justify-end gap-3">
        <ModeToggle />
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex-[0.3]"
        >
          Login
        </Button>
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex-[0.3]"
        >
          Sign Up
        </Button>
      </div>
    </header>
  );
}
