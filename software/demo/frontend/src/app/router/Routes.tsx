import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "@/features/home/HomePage";
import { ActivityForm } from "@/features/activities/form/ActivityForm";
import ErrorPage from "@/features/ErrorPage";
import Activities from "@/features/activities/Activities";
import Profile from "@/features/profile/Profile";
import Resources from "@/features/resources/Resources";
import ActivityDetailsPage from "@/features/activities/details/ActivityDetailsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "activities",
        children: [
          { index: true, element: <Activities /> },
          { path: "createActivity", element: <ActivityForm key="create" /> },
          { path: ":id", element: <ActivityDetailsPage /> },
        ],
      },
      { path: "manage/:id", element: <ActivityForm /> },
      { path: "resources", element: <Resources /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);
