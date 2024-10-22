import { Ref } from "preact";
import { center } from "../../../styled-system/patterns";

interface ChatButtonProps {
  onClick: () => void;
  reff: Ref<HTMLDivElement>;
  notificationBubble: boolean;
}

export default function ChatButton({
  onClick,
  reff,
  notificationBubble,
}: ChatButtonProps) {
  return (
    <div
      ref={reff}
      onClick={onClick}
      data-bubble={notificationBubble}
      class={center({
        width: 10,
        height: 10,
        bg: "ww-purple",
        borderRadius: "999999px",
        pos: "fixed",
        bottom: 5,
        right: 5,
        cursor: "pointer",
        shadow: "ww-mid",
        border: "solid 2px",
        borderColor: "ww-black",
        "&[data-bubble=true]": {
          _after: {
            content: '""',
            position: "absolute",
            width: 4,
            height: 4,
            top: -1,
            left: -1,
            borderRadius: 99999999,
            bg: "red",
          },
        },
      })}
    >
      🗨
    </div>
  );
}
