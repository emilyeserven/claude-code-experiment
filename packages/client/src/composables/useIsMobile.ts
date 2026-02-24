import type { Ref } from "vue";

import { onMounted, onUnmounted, ref } from "vue";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): Ref<boolean> {
  const isMobile = ref(false);
  let mql: MediaQueryList | null = null;
  let onChange: ((e: MediaQueryListEvent) => void) | null = null;

  onMounted(() => {
    if (typeof window.matchMedia !== "function") return;
    mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    onChange = (e: MediaQueryListEvent) => {
      isMobile.value = e.matches;
    };
    isMobile.value = mql.matches;
    mql.addEventListener("change", onChange);
  });

  onUnmounted(() => {
    if (mql && onChange) {
      mql.removeEventListener("change", onChange);
    }
  });

  return isMobile;
}
