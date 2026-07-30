import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Badge } from "@/lib/types";

/**
 * Tracks which of the current user's earned badges have already been shown
 * to them, so:
 *  - NavBar can render an "unseen badge" indicator on the Profile link from
 *    anywhere in the app, without knowing anything about the Profile page.
 *  - The Profile page can highlight newly-earned badges as "New" and clear
 *    the indicator once the user actually views the Badges tab.
 *
 * Why this is a Zustand store and NOT part of the server data:
 * - The badge LIST itself is server state - it comes from `useProfile()`
 *   (TanStack Query) and this store never copies or duplicates it. All this
 *   store holds is a derived, purely local concept: "which badge ids has
 *   this browser already shown a celebration/highlight for". There is no
 *   backend endpoint for "mark badge as seen", so there is no query or
 *   mutation to model this as in TanStack Query.
 * - It needs to be read/written from two unrelated parts of the tree
 *   (NavBar and the Profile page) at the same time, which local useState
 *   can't do, and it needs to survive a full page reload (otherwise every
 *   refresh would show every badge as "new" again) - Zustand's `persist`
 *   middleware gives us that via localStorage with a couple of lines,
 *   which plain Context would need extra manual plumbing for.
 *
 * Known limitation: `seenBadgeIds` is persisted per-browser, not per-user.
 * Fine for a single-user demo/assessment; a multi-account production build
 * would need to namespace the storage key by user id.
 */
type GamificationState = {
  seenBadgeIds: string[];
  markBadgesSeen: (badgeIds: string[]) => void;
  getUnseenBadges: (badges: Badge[]) => Badge[];
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      seenBadgeIds: [],

      markBadgesSeen: (badgeIds) => {
        const merged = new Set([...get().seenBadgeIds, ...badgeIds]);
        set({ seenBadgeIds: Array.from(merged) });
      },

      getUnseenBadges: (badges) => {
        const seen = new Set(get().seenBadgeIds);
        return badges.filter((badge) => !seen.has(badge.id));
      },
    }),
    { name: "engarde-seen-badges" },
  ),
);
