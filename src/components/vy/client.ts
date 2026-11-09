"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** true in the browser when `test()` passes; `fallback` while the page is built (no window). */
export function useBrowser(test: () => boolean, fallback = true) {
  return useSyncExternalStore(noop, test, () => fallback);
}

/** A number that changes once a day: the same for everyone on that date. 0 while building. */
export function useDayIndex(length: number) {
  return useSyncExternalStore(
    noop,
    () => {
      const d = new Date();
      return length ? (d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % length : 0;
    },
    () => 0,
  );
}
