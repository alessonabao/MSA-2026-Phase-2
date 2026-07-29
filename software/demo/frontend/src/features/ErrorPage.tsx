import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router";
import { Button } from "@/components/ui/button";
import { House, TriangleAlert } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const getErrorDetails = () => {
    if (isRouteErrorResponse(error)) {
      return {
        status: error.status,
        title:
          error.status === 404
            ? "Page Not Found"
            : error.status === 403
              ? "Access Denied"
              : error.status === 500
                ? "Server Error"
                : "Something Went Wrong",
        message:
          error.status === 404
            ? "The page you're looking for doesn't exist or has been moved."
            : error.status === 403
              ? "You don't have permission to view this page."
              : error.status === 500
                ? "An unexpected error occurred on our end. Please try again later."
                : error.statusText,
      };
    }

    if (error instanceof Error) {
      return {
        status: null,
        title: "Something Went Wrong",
        message: error.message,
      };
    }

    return {
      status: null,
      title: "Unexpected Error",
      message: "An unknown error occurred.",
    };
  };

  const { status, title, message } = getErrorDetails();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <TriangleAlert className="h-8 w-8 text-destructive" />
          </div>
        </div>

        {/* Status code */}
        {status && (
          <p className="text-sm font-mono text-center font-semibold tracking-widest text-muted-foreground uppercase mb-2">
            Error {status}
          </p>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight mb-3">{title}</h1>

        {/* Message */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/")}>
            <House className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
