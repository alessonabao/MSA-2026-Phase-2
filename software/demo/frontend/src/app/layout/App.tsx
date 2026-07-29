import { Outlet } from "react-router";
import "./App.css";
import { ThemeProvider } from "../../components/theme-provider";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Toaster />
      <Footer />
      {/* <BrowserRouter>
        <NavBar />

        <main>
          <Routes>
            <Route path="/" element={<Activities />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <Toaster />
      </BrowserRouter> */}
    </ThemeProvider>
  );
}
