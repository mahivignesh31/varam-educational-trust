"use client";

import { useSyncExternalStore } from "react";
import { useDemoStore } from "@/lib/store";

export function useStoreHydrated() {
  return useSyncExternalStore(
    (onChange) => useDemoStore.persist.onFinishHydration(onChange),
    () => useDemoStore.persist.hasHydrated(),
    () => false,
  );
}
