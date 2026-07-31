import { afterEach, describe, expect, it } from "vitest";
import { useGamificationStore } from "./useGamificationStore";
import type { Badge } from "@/lib/types";

function makeBadge(id: string): Badge {
  return {
    id,
    code: id,
    title: `Badge ${id}`,
    description: "A badge.",
    awardedAt: "2026-07-01T00:00:00.000Z",
  };
}

afterEach(() => {
  useGamificationStore.setState({ seenBadgeIds: [] });
  localStorage.clear();
});

describe("useGamificationStore", () => {
  it("treats every badge as unseen when nothing has been marked seen", () => {
    const badges = [makeBadge("a"), makeBadge("b")];

    const unseen = useGamificationStore.getState().getUnseenBadges(badges);

    expect(unseen.map((b) => b.id)).toEqual(["a", "b"]);
  });

  it("excludes badges that have been marked seen", () => {
    useGamificationStore.getState().markBadgesSeen(["a"]);

    const unseen = useGamificationStore
      .getState()
      .getUnseenBadges([makeBadge("a"), makeBadge("b")]);

    expect(unseen.map((b) => b.id)).toEqual(["b"]);
  });

  it("dedupes badge ids across repeated markBadgesSeen calls", () => {
    useGamificationStore.getState().markBadgesSeen(["a", "b"]);
    useGamificationStore.getState().markBadgesSeen(["b", "c"]);

    expect(useGamificationStore.getState().seenBadgeIds.sort()).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("persists seen badge ids to localStorage", () => {
    useGamificationStore.getState().markBadgesSeen(["a"]);

    const stored = JSON.parse(
      localStorage.getItem("engarde-seen-badges") ?? "{}",
    );

    expect(stored.state.seenBadgeIds).toEqual(["a"]);
  });
});
