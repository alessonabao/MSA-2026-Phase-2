import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import Resources from "../../features/resources/Resources";
import Events from "../../features/events/Events";
import Profile from "../../features/profile/Profile";
import { ThemeProvider } from "../../components/theme-provider";
import { ModeToggle } from "../../components/mode-toggle";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <header className="bg-background text-foreground border-b border-border flex items-center gap-8 px-6 py-4">
          <h1>En Garde</h1>
          <nav>
            <NavLink to="/" end>
              Events
            </NavLink>
            <NavLink to="/resources">Resources</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <ModeToggle />
          </nav>
          <Button>Login</Button>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Events />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}
