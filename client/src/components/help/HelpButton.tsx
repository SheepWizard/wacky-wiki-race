import { Ref } from "preact";
import { center } from "../../../styled-system/patterns";

interface HelpButtonProps {
  onClick: () => void;
  reff: Ref<HTMLDivElement>;
}

export default function HelpButton({ onClick, reff }: HelpButtonProps) {
  return (
    <div
      ref={reff}
      onClick={onClick}
      popovertarget="help-popover"
      class={center({
        width: 10,
        height: 10,
        bg: "ww-green",
        borderRadius: "99999px",
        pos: "fixed",
        bottom: 5,
        left: 5,
        cursor: "pointer",
        shadow: "ww-mid",
        border: "solid 2px",
        borderColor: "ww-black",
      })}
    >
      ❓
    </div>
  );
}
