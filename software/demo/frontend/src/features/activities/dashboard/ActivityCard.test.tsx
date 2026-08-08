import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ActivityCard from "./ActivityCard";
import { useAccount } from "@/lib/hooks/useAccount";
import {
  useActivities,
  useActivityAttendees,
  useMyAttendedActivities,
} from "@/lib/hooks/useActivities";
import type { Activity, AttendedActivity, User } from "@/lib/types";

vi.mock("@/lib/hooks/useAccount");
vi.mock("@/lib/hooks/useActivities");

const mockUseAccount = vi.mocked(useAccount);
const mockUseActivities = vi.mocked(useActivities);
const mockUseActivityAttendees = vi.mocked(useActivityAttendees);
const mockUseMyAttendedActivities = vi.mocked(useMyAttendedActivities);

const activity: Activity = {
  id: "activity-1",
  title: "Beginner Foil Night",
  date: "2026-08-15",
  startTime: "18:00",
  endTime: "20:00",
  description: "A friendly session for newcomers.",
  weapon: "Foil",
  skillLevel: "Beginner",
  type: "Training",
  isCancelled: false,
  city: "Auckland",
  venue: "City Fencing Club",
  latitude: 0,
  longitude: 0,
  price: 0,
};

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    email: "user@example.com",
    profileName: "Test User",
    profileImageUrl: null,
    role: "Member",
    ...overrides,
  };
}

function makeAttendance(overrides: Partial<AttendedActivity> = {}): AttendedActivity {
  return {
    activity,
    isCancelled: false,
    cancelledByOrganiser: false,
    joinedAt: "2026-07-01T00:00:00.000Z",
    cancelledAt: null,
    ...overrides,
  };
}

function setup({
  currentUser = makeUser(),
  myAttendedActivities = [] as AttendedActivity[],
  activityOverrides = {} as Partial<Activity>,
} = {}) {
  mockUseAccount.mockReturnValue({
    currentUser,
  } as unknown as ReturnType<typeof useAccount>);
  mockUseActivities.mockReturnValue({
    deleteActivity: { isPending: false, mutate: vi.fn() },
  } as unknown as ReturnType<typeof useActivities>);
  mockUseActivityAttendees.mockReturnValue({
    attendees: [],
    isLoadingAttendees: false,
  } as unknown as ReturnType<typeof useActivityAttendees>);
  mockUseMyAttendedActivities.mockReturnValue({
    myAttendedActivities,
  } as unknown as ReturnType<typeof useMyAttendedActivities>);

  return render(
    <MemoryRouter>
      <ActivityCard activity={{ ...activity, ...activityOverrides }} />
    </MemoryRouter>,
  );
}

describe("ActivityCard status badge", () => {
  it("shows no status badge for a member with no attendance", () => {
    setup({ currentUser: makeUser({ role: "Member" }) });

    expect(screen.queryByText("Attending")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancelled")).not.toBeInTheDocument();
    expect(screen.queryByText("Event Cancelled")).not.toBeInTheDocument();
    expect(screen.queryByText("You are hosting")).not.toBeInTheDocument();
  });

  it("shows 'Attending' when the member is going and not cancelled", () => {
    setup({
      currentUser: makeUser({ role: "Member" }),
      myAttendedActivities: [makeAttendance({ isCancelled: false })],
    });

    expect(screen.getByText("Attending")).toBeInTheDocument();
  });

  it("shows 'Cancelled' when the member's own attendance is cancelled", () => {
    setup({
      currentUser: makeUser({ role: "Member" }),
      myAttendedActivities: [makeAttendance({ isCancelled: true })],
    });

    expect(screen.getByText("Cancelled")).toBeInTheDocument();
    expect(screen.queryByText("Attending")).not.toBeInTheDocument();
  });

  it("shows no status badge once a resumed event's organiser-cancelled attendance is stale", () => {
    setup({
      currentUser: makeUser({ role: "Member" }),
      myAttendedActivities: [
        makeAttendance({ isCancelled: true, cancelledByOrganiser: true }),
      ],
      activityOverrides: { isCancelled: false },
    });

    expect(screen.queryByText("Cancelled")).not.toBeInTheDocument();
    expect(screen.queryByText("Event Cancelled")).not.toBeInTheDocument();
    expect(screen.queryByText("Attending")).not.toBeInTheDocument();
  });

  it("shows 'You are hosting' for a ClubAdmin with no attendance row", () => {
    setup({ currentUser: makeUser({ role: "ClubAdmin" }) });

    expect(screen.getByText("You are hosting")).toBeInTheDocument();
  });

  it("shows 'Event Cancelled' when the event itself is cancelled, outranking host/attendance status", () => {
    setup({
      currentUser: makeUser({ role: "ClubAdmin" }),
      myAttendedActivities: [makeAttendance({ isCancelled: true })],
      activityOverrides: { isCancelled: true },
    });

    expect(screen.getByText("Event Cancelled")).toBeInTheDocument();
    expect(screen.queryByText("You are hosting")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancelled")).not.toBeInTheDocument();
  });
});
