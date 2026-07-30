import { create } from "zustand";

/**
 * Purely client-side, ephemeral UI state that isn't owned by any single
 * feature - the kind of thing that would otherwise live in a top-level
 * layout component and get threaded down through props as the component
 * tree grows around it.
 *
 * Why Zustand and not Context:
 * - React Context re-renders every consumer whenever ANY value passed to the
 *   provider changes, and requires wrapping part of the tree in a Provider
 *   even for a single boolean flag. A Zustand store needs no Provider, and
 *   components only re-render when the specific slice they select changes.
 * - This state is UI-only - nothing here is fetched from, or written back
 *   to, the server, so TanStack Query is not a fit.
 *
 * Currently used for: the mobile navigation Sheet's open/closed state, so it
 * can be closed imperatively (e.g. after the user taps a nav link) from
 * anywhere, not just from the component that renders the <Sheet>.
 */
type UIState = {
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  closeMobileNav: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
}));
