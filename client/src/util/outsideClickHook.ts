import { RefObject } from "preact";
import { useEffect } from "preact/hooks";

export function useOutsideClick(
  ref: RefObject<HTMLElement>,
  onClick: () => void
) {
  useEffect(() => {
    const current = ref.current;

    if (!current) {
      return;
    }
    const handleClick = (e: MouseEvent) => {
      const target = e.target;
      if (!target) {
        return;
      }
      const isClickInside = current.contains(target as Node);
      if (!isClickInside) {
        onClick();
      }
    };

    document.addEventListener("click", handleClick);
  });
}
