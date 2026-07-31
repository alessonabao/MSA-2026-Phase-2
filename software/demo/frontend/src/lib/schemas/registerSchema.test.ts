import { describe, expect, it } from "vitest";
import { registerSchema } from "./registerSchema";

const validData = {
  profileName: "Portia Knight",
  email: "portia@example.com",
  password: "password123",
  confirmPassword: "password123",
};

describe("registerSchema", () => {
  it("accepts fully valid data", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects an empty profile name", () => {
    const result = registerSchema.safeParse({ ...validData, profileName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ ...validData, email: "nope" });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 6 characters", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "abc12",
      confirmPassword: "abc12",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing confirmPassword", () => {
    const result = registerSchema.safeParse({ ...validData, confirmPassword: "" });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched password and confirmPassword, flagging confirmPassword", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "somethingElse123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) =>
        i.path.includes("confirmPassword"),
      );
      expect(issue).toBeDefined();
      expect(issue?.message).toBe("Passwords do not match");
    }
  });
});
