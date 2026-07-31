import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import RegisterForm from "./RegisterForm";
import { useAccount } from "@/lib/hooks/useAccount";
import { toast } from "sonner";

vi.mock("@/lib/hooks/useAccount");

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockUseAccount = vi.mocked(useAccount);

function renderRegisterForm() {
  return render(
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>,
  );
}

function makeRegisterUser(mutateAsync = vi.fn().mockResolvedValue(undefined)) {
  return { registerUser: { mutateAsync } } as unknown as ReturnType<
    typeof useAccount
  >;
}

async function fillValidFormExceptConfirm(
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.type(screen.getByPlaceholderText(/portia knight/i), "Jane Doe");
  await user.type(
    screen.getByPlaceholderText(/upi@aucklanduni/i),
    "jane@example.com",
  );
  await user.type(screen.getByLabelText("Password"), "password123");
}

describe("RegisterForm", () => {
  it("disables the submit button until the form is valid", async () => {
    const user = userEvent.setup();
    mockUseAccount.mockReturnValue(makeRegisterUser());
    renderRegisterForm();

    const submitButton = screen.getByRole("button", { name: "Create Account" });
    expect(submitButton).toBeDisabled();

    await fillValidFormExceptConfirm(user);
    await user.type(screen.getByLabelText("Confirm Password"), "password123");

    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it("shows a validation error when passwords do not match", async () => {
    const user = userEvent.setup();
    mockUseAccount.mockReturnValue(makeRegisterUser());
    renderRegisterForm();

    await fillValidFormExceptConfirm(user);
    await user.type(screen.getByLabelText("Confirm Password"), "somethingElse");
    await user.tab();

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Account" }),
    ).toBeDisabled();
  });

  it("registers successfully by calling registerUser", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    mockUseAccount.mockReturnValue(makeRegisterUser(mutateAsync));
    renderRegisterForm();

    await fillValidFormExceptConfirm(user);
    await user.type(screen.getByLabelText("Confirm Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        profileName: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
        confirmPassword: "password123",
      }),
    );
  });

  it("shows an 'already registered' toast on a 400 response", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockRejectedValue({
      isAxiosError: true,
      response: { status: 400 },
    });
    mockUseAccount.mockReturnValue(makeRegisterUser(mutateAsync));
    renderRegisterForm();

    await fillValidFormExceptConfirm(user);
    await user.type(screen.getByLabelText("Confirm Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "That email is already registered.",
      ),
    );
  });

  it("shows a 'server unreachable' toast when there is no response", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockRejectedValue({
      isAxiosError: true,
      response: undefined,
    });
    mockUseAccount.mockReturnValue(makeRegisterUser(mutateAsync));
    renderRegisterForm();

    await fillValidFormExceptConfirm(user);
    await user.type(screen.getByLabelText("Confirm Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Unable to reach the server. Please check your connection.",
      ),
    );
  });
});
