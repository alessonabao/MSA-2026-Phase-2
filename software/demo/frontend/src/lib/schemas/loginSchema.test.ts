import { describe, expect, it } from "vitest";
import { loginSchema } from "./loginSchema";

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 6 characters", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "abc12",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a password of exactly 6 characters", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "abc123",
    });
    expect(result.success).toBe(true);
  });
});
