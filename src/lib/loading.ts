"use client";

export function triggerGlobalLoading(isLoading: boolean) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("global-loading", { detail: { isLoading } })
    );
  }
}
