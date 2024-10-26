import { Ref, useEffect } from "preact/hooks";

export function useOutsideRefClicked(
  ref: Ref<HTMLElement>,
  onClick: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        ref?.current &&
        event.target instanceof Node &&
        !ref?.current.contains(event.target)
      ) {
        console.log("click");
        onClick(event);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, onClick]);
}
