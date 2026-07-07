import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Resources from "../../features/resources/Resources";
import Events from "../../features/events/Events";
import Profile from "../../features/profile/Profile";
import { ThemeProvider } from "../../components/theme-provider";
import NavBar from "./NavBar";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <NavBar />

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
