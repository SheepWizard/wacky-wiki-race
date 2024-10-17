import { Ref } from "preact";
import { center } from "../../../styled-system/patterns";

interface ChatButtonProps {
  onClick: () => void;
  reff: Ref<HTMLDivElement>;
}

export default function ChatButton({ onClick, reff }: ChatButtonProps) {
  return (
    <div
      ref={reff}
      onClick={onClick}
      class={center({
        width: 10,
        height: 10,
        bg: "ww-purple",
        borderRadius: "999999px",
        pos: "absolute",
        bottom: 5,
        right: 5,
        cursor: "pointer",
        shadow: "ww-mid",
      })}
    >
      M
    </div>
  );
}
