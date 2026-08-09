import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { ActivityForm } from "./ActivityForm";
import { useActivities } from "@/lib/hooks/useActivities";
import { geocodeAddress } from "@/lib/api/geocoding";
import { toast } from "sonner";
import type { Activity } from "@/lib/types";

vi.mock("@/lib/hooks/useActivities");
vi.mock("@/lib/api/geocoding");
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

let mockParams: { id?: string } = {};
const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

const mockUseActivities = vi.mocked(useActivities);
const mockGeocodeAddress = vi.mocked(geocodeAddress);

const existingActivity: Activity = {
  id: "activity-1",
  title: "Beginner Foil Night",
  date: "2026-08-15T00:00:00.000Z",
  startTime: "18:00",
  endTime: "20:00",
  description: "A friendly session for newcomers.",
  weapon: "Foil",
  skillLevel: "Beginner",
  type: "Training",
  isCancelled: false,
  city: "Auckland",
  venue: "City Fencing Club",
  latitude: -36.8,
  longitude: 174.7,
  price: 0,
};

function makeActivitiesHooks(overrides: Record<string, unknown> = {}) {
  return {
    activity: undefined,
    isLoadingActivity: false,
    createActivity: { isPending: false, mutate: vi.fn() },
    updateActivity: { isPending: false, mutateAsync: vi.fn().mockResolvedValue(undefined) },
    ...overrides,
  } as unknown as ReturnType<typeof useActivities>;
}

function renderForm() {
  return render(
    <MemoryRouter>
      <ActivityForm />
    </MemoryRouter>,
  );
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Club Activity Title"), "Advanced Sabre Meetup");
  await user.type(
    screen.getByLabelText("Description"),
    "Join us for a competitive sabre session.",
  );
  fireEvent.change(screen.getByLabelText("Start Time"), { target: { value: "18:00" } });
  fireEvent.change(screen.getByLabelText("End Time"), { target: { value: "20:00" } });
  await user.type(screen.getByLabelText("City"), "Wellington");
  await user.type(screen.getByLabelText("Venue"), "Wellington Fencing Centre");
}

describe("ActivityForm", () => {
  beforeEach(() => {
    mockParams = {};
    mockGeocodeAddress.mockResolvedValue({ latitude: -41.3, longitude: 174.8 });
  });

  it("shows the create-mode heading when there is no existing activity", () => {
    mockUseActivities.mockReturnValue(makeActivitiesHooks());
    renderForm();

    expect(screen.getByText("Create an Event")).toBeInTheDocument();
    expect(screen.getByLabelText("Club Activity Title")).toHaveValue("");
  });

  it("pre-fills fields and shows the edit-mode heading for an existing activity", () => {
    mockParams = { id: "activity-1" };
    mockUseActivities.mockReturnValue(
      makeActivitiesHooks({ activity: existingActivity }),
    );
    renderForm();

    expect(screen.getByText("Edit an Event")).toBeInTheDocument();
    expect(screen.getByLabelText("Club Activity Title")).toHaveValue(
      existingActivity.title,
    );
    expect(screen.getByLabelText("Venue")).toHaveValue(existingActivity.venue);
  });

  it("shows a loading state instead of the form while the activity is loading", () => {
    mockParams = { id: "activity-1" };
    mockUseActivities.mockReturnValue(
      makeActivitiesHooks({ isLoadingActivity: true }),
    );
    renderForm();

    expect(screen.getByText("Loading activity...")).toBeInTheDocument();
    expect(screen.queryByLabelText("Club Activity Title")).not.toBeInTheDocument();
  });

  it("blocks submission and shows a validation error when the title is too short", async () => {
    const user = userEvent.setup();
    const createActivity = { isPending: false, mutate: vi.fn() };
    mockUseActivities.mockReturnValue(makeActivitiesHooks({ createActivity }));
    renderForm();

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("Title must be at least 3 characters."),
    ).toBeInTheDocument();
    expect(createActivity.mutate).not.toHaveBeenCalled();
  });

  it("geocodes the venue and navigates to the new event on successful create", async () => {
    const user = userEvent.setup();
    const createActivity = {
      isPending: false,
      mutate: vi.fn((_data, opts?: { onSuccess?: (id: string) => void }) =>
        opts?.onSuccess?.("new-activity-id"),
      ),
    };
    mockUseActivities.mockReturnValue(makeActivitiesHooks({ createActivity }));
    renderForm();

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(createActivity.mutate).toHaveBeenCalled());
    const [submitted] = createActivity.mutate.mock.calls[0];
    expect(submitted).toMatchObject({
      title: "Advanced Sabre Meetup",
      city: "Wellington",
      venue: "Wellington Fencing Centre",
      latitude: -41.3,
      longitude: 174.8,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/activities/new-activity-id");
  });

  it("shows a toast but still submits when the venue can't be geocoded", async () => {
    mockGeocodeAddress.mockResolvedValue(null);
    const user = userEvent.setup();
    const createActivity = { isPending: false, mutate: vi.fn() };
    mockUseActivities.mockReturnValue(makeActivitiesHooks({ createActivity }));
    renderForm();

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Couldn't find that venue on the map. You can edit the event later to fix its location.",
      ),
    );
    expect(createActivity.mutate).toHaveBeenCalled();
    const [submitted] = createActivity.mutate.mock.calls[0];
    expect(submitted.latitude).toBeNull();
    expect(submitted.longitude).toBeNull();
  });

  it("submits an update with the existing activity id and navigates to its details page", async () => {
    mockParams = { id: "activity-1" };
    const user = userEvent.setup();
    const updateActivity = {
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    };
    mockUseActivities.mockReturnValue(
      makeActivitiesHooks({ activity: existingActivity, updateActivity }),
    );
    renderForm();

    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() =>
      expect(updateActivity.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({ id: "activity-1" }),
      ),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/activities/activity-1");
  });
});
