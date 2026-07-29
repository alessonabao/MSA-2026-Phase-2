import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "@/features/home/HomePage";
import { ActivityForm } from "@/features/activities/form/ActivityForm";
import ErrorPage from "@/features/ErrorPage";
import Activities from "@/features/activities/Activities";
import Profile from "@/features/profile/Profile";
import Resources from "@/features/resources/Resources";
import ActivityDetailsPage from "@/features/activities/details/ActivityDetailsPage";
import LoginForm from "@/features/account/LoginForm";
import RequireAuth from "./RequireAuth";
import RegisterForm from "@/features/account/RegisterForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: "activities",
            children: [
              { index: true, element: <Activities /> },
              {
                path: "createActivity",
                element: <ActivityForm key="create" />,
              },
              { path: ":id", element: <ActivityDetailsPage /> },
            ],
          },
          { path: "manage/:id", element: <ActivityForm /> },
          { path: "profile", element: <Profile /> },
        ],
      },
      { index: true, element: <HomePage /> },
      { path: "resources", element: <Resources /> },
      { path: "login", element: <LoginForm /> },
      { path: "register", element: <RegisterForm /> },
    ],
  },
]);
