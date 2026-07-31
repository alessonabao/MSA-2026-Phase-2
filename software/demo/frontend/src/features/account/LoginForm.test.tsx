import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import LoginForm from "./LoginForm";
import { useAccount } from "@/lib/hooks/useAccount";
import { toast } from "sonner";

vi.mock("@/lib/hooks/useAccount");

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockUseAccount = vi.mocked(useAccount);

function renderLoginForm() {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  );
}

function makeLoginUser(mutateAsync = vi.fn().mockResolvedValue(undefined)) {
  return { loginUser: { mutateAsync } } as unknown as ReturnType<
    typeof useAccount
  >;
}

describe("LoginForm", () => {
  it("disables the submit button until the form is valid", async () => {
    const user = userEvent.setup();
    mockUseAccount.mockReturnValue(makeLoginUser());
    renderLoginForm();

    expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();

    await user.type(screen.getByPlaceholderText("Email"), "user@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Login" })).toBeEnabled(),
    );
  });

  it("shows a validation error for an invalid email once the field is touched", async () => {
    const user = userEvent.setup();
    mockUseAccount.mockReturnValue(makeLoginUser());
    renderLoginForm();

    await user.type(screen.getByPlaceholderText("Email"), "not-an-email");
    await user.tab();

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();
  });

  it("logs in successfully and shows a success toast", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi
      .fn()
      .mockImplementation(async (_data, options) => {
        options?.onSuccess?.();
      });
    mockUseAccount.mockReturnValue(makeLoginUser(mutateAsync));
    renderLoginForm();

    await user.type(screen.getByPlaceholderText("Email"), "user@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Logged in successfully"),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/activities");
  });

  it("shows an 'invalid credentials' toast on a 401 response", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockRejectedValue({
      isAxiosError: true,
      response: { status: 401 },
    });
    mockUseAccount.mockReturnValue(makeLoginUser(mutateAsync));
    renderLoginForm();

    await user.type(screen.getByPlaceholderText("Email"), "user@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Invalid email or password."),
    );
  });

  it("shows a 'server unreachable' toast when there is no response", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockRejectedValue({
      isAxiosError: true,
      response: undefined,
    });
    mockUseAccount.mockReturnValue(makeLoginUser(mutateAsync));
    renderLoginForm();

    await user.type(screen.getByPlaceholderText("Email"), "user@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Unable to reach the server. Please check your connection.",
      ),
    );
  });
});
