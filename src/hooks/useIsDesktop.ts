import { useEffect, useState } from "react";

export const useIsDesktop = (breakpoint = 1280) => {
  const [isDesktop, setIsDesktop] = useState(() =>
    window.matchMedia(`(min-width: ${breakpoint}px)`).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [breakpoint]);

  return isDesktop;
};
