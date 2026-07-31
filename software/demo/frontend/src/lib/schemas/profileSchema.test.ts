import { describe, expect, it } from "vitest";
import { profileSchema } from "./profileSchema";

describe("profileSchema", () => {
  it("accepts a name with all optional fields omitted", () => {
    const result = profileSchema.safeParse({ profileName: "Portia Knight" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty profile name", () => {
    const result = profileSchema.safeParse({ profileName: "" });
    expect(result.success).toBe(false);
  });

  it("accepts a fully populated profile", () => {
    const result = profileSchema.safeParse({
      profileName: "Portia Knight",
      profileBio: "Loves fencing.",
      weapon: "Épée",
      skillLevel: "Advanced",
      contactInfo: "portia@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a weapon outside the allowed enum", () => {
    const result = profileSchema.safeParse({
      profileName: "Portia Knight",
      weapon: "Lightsaber",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a skill level outside the allowed enum", () => {
    const result = profileSchema.safeParse({
      profileName: "Portia Knight",
      skillLevel: "Expert",
    });
    expect(result.success).toBe(false);
  });
});
