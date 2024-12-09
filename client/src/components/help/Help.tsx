import { useCallback, useRef, useState } from "preact/hooks";
import { css } from "../../../styled-system/css";
import { useOutsideRefClicked } from "../../hooks/useOutsideRefClicked";
import { useWindowChange } from "../../hooks/useWindowChange";
import HelpButton from "./HelpButton";

export default function Help() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  useOutsideRefClicked(popoverRef, (event: MouseEvent | TouchEvent) => {
    const popover = popoverRef.current;
    const button = buttonRef.current;
    if (!popover) {
      return;
    }
    if (event.target === button) {
      return;
    }
    setHelpOpen(false);
    popover.hidePopover();
  });

  const positionPopover = useCallback(() => {
    const popover = popoverRef.current;
    const button = buttonRef.current;

    if (!popover || !button) {
      return;
    }

    const buttonBox = button.getBoundingClientRect();
    const popoverBox = popover.getBoundingClientRect();
    popover.style.top = `${buttonBox.top - popoverBox.height - 10}px`;
    popover.style.left = "10px";
  }, []);
  useWindowChange(positionPopover);

  const handleOpenClick = () => {
    const popover = popoverRef.current;
    const button = buttonRef.current;

    if (!popover || !button) {
      return;
    }

    if (helpOpen) {
      setHelpOpen(false);
      popover.hidePopover();
      return;
    }

    setHelpOpen(true);
    popover.showPopover();

    positionPopover();
  };

  return (
    <>
      <div
        ref={popoverRef}
        popover="manual"
        class={css({
          maxWidth: "60%",
          width: "300px",
          bg: "ww-white",
          borderRadius: "br-12",
          height: "min(80%, 500px)",
          padding: 2,
          border: "solid 2px",
          borderColor: "ww-black",
          overflowY: "auto",
          scrollbarWidth: "thin",
        })}
      >
        <h2>How to play</h2>
        <p>
          Wacky Wiki Races is a fun challenge where players navigate from one
          Wikipedia article to another using only the links within the articles.
          Starting with a chosen article, the goal is to reach a target article
          in the shortest time. Players must follow only internal links (no
          external sites, search bars, or typing) and can compete alone or with
          others.
        </p>
      </div>
      <HelpButton reff={buttonRef} onClick={handleOpenClick} />
    </>
  );
}
