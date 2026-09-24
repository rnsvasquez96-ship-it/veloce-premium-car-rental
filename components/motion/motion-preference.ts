"use client";

import {
  useSyncExternalStore,
} from "react";

const MOTION_QUERY =
  "(prefers-reduced-motion: no-preference)";

let mediaQuery:
  MediaQueryList | null =
  null;

function getMediaQuery() {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  if (!mediaQuery) {
    mediaQuery =
      window.matchMedia(
        MOTION_QUERY,
      );
  }

  return mediaQuery;
}

function subscribe(
  callback: () => void,
) {
  const media =
    getMediaQuery();

  if (!media) {
    return () => {};
  }

  media.addEventListener(
    "change",
    callback,
  );

  return () => {
    media.removeEventListener(
      "change",
      callback,
    );
  };
}

function getSnapshot() {
  return (
    getMediaQuery()
      ?.matches ??
    false
  );
}

function getServerSnapshot() {
  /*
   * Server renders without optional motion.
   * The browser enables it after hydration
   * only when the user allows motion.
   */
  return false;
}

export function useMotionAllowed() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}