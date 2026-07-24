import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Resources from "../../features/resources/Resources";
import Activities from "@/features/activities/Activities";
import Profile from "../../features/profile/Profile";
import { ThemeProvider } from "../../components/theme-provider";
import NavBar from "./NavBar";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <NavBar />

        <main>
          <Routes>
            <Route path="/" element={<Activities />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}
