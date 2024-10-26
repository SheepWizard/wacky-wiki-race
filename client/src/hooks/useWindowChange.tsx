import { useLayoutEffect } from "preact/hooks";

export function useWindowChange(callback: () => void) {
  useLayoutEffect(() => {
    window.addEventListener("resize", callback);
    window.addEventListener("scroll", callback, true);

    return () => {
      window.removeEventListener("resize", callback);
      window.removeEventListener("scroll", callback, true);
    };
  }, [callback]);
}
