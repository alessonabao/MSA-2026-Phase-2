import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import RequireAuth from "./RequireAuth";
import { useAccount } from "@/lib/hooks/useAccount";
import type { User } from "@/lib/types";

vi.mock("@/lib/hooks/useAccount");

const mockUseAccount = vi.mocked(useAccount);

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={["/activities"]}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/activities" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("RequireAuth", () => {
  it("shows a loading state while user info is loading", () => {
    mockUseAccount.mockReturnValue({
      currentUser: undefined,
      loadingUserInfo: true,
    } as ReturnType<typeof useAccount>);

    renderProtectedRoute();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to /login when there is no current user", () => {
    mockUseAccount.mockReturnValue({
      currentUser: undefined,
      loadingUserInfo: false,
    } as ReturnType<typeof useAccount>);

    renderProtectedRoute();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders the protected route when a current user is present", () => {
    mockUseAccount.mockReturnValue({
      currentUser: { id: "1", role: "Member" } as User,
      loadingUserInfo: false,
    } as ReturnType<typeof useAccount>);

    renderProtectedRoute();

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
