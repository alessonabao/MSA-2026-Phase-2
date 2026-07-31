import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import RequireRole from "./RequireRole";
import { useAccount } from "@/lib/hooks/useAccount";
import type { User } from "@/lib/types";

vi.mock("@/lib/hooks/useAccount");

const mockUseAccount = vi.mocked(useAccount);

function renderAdminRoute() {
  return render(
    <MemoryRouter initialEntries={["/manage"]}>
      <Routes>
        <Route element={<RequireRole allow={["ClubAdmin"]} />}>
          <Route path="/manage" element={<div>Admin Only Content</div>} />
        </Route>
        <Route path="/activities" element={<div>Activities Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("RequireRole", () => {
  it("shows a loading state while user info is loading", () => {
    mockUseAccount.mockReturnValue({
      currentUser: undefined,
      loadingUserInfo: true,
    } as ReturnType<typeof useAccount>);

    renderAdminRoute();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to /activities when there is no current user", () => {
    mockUseAccount.mockReturnValue({
      currentUser: undefined,
      loadingUserInfo: false,
    } as ReturnType<typeof useAccount>);

    renderAdminRoute();

    expect(screen.getByText("Activities Page")).toBeInTheDocument();
  });

  it("redirects to /activities when the current user's role is not allowed", () => {
    mockUseAccount.mockReturnValue({
      currentUser: { id: "1", role: "Member" } as User,
      loadingUserInfo: false,
    } as ReturnType<typeof useAccount>);

    renderAdminRoute();

    expect(screen.getByText("Activities Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Only Content")).not.toBeInTheDocument();
  });

  it("renders the protected route when the current user's role is allowed", () => {
    mockUseAccount.mockReturnValue({
      currentUser: { id: "1", role: "ClubAdmin" } as User,
      loadingUserInfo: false,
    } as ReturnType<typeof useAccount>);

    renderAdminRoute();

    expect(screen.getByText("Admin Only Content")).toBeInTheDocument();
  });
});
