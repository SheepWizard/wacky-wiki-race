import { RefObject } from "preact";
import { css } from "../../../styled-system/css";
import { center } from "../../../styled-system/patterns";
import ChatIcon from "../icons/ChatIcon";

interface ChatButtonProps {
  onClick: () => void;
  reff: RefObject<HTMLDivElement>;
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
        width: 16,
        height: 16,
        bg: "ww-primary-50",
        borderRadius: "999999px",
        pos: "fixed",
        bottom: 5,
        right: 5,
        cursor: "pointer",
        border: "solid 2px",
        borderColor: "ww-black",
        mdDown: {
          width: 10,
          height: 10,
        },
        "&[data-bubble=true]": {
          _after: {
            content: '""',
            position: "absolute",
            width: 4,
            height: 4,
            top: 0,
            left: -1,
            borderRadius: 99999999,
            bg: "red",
            mdDown: {
              top: -1,
            },
          },
        },
      })}
    >
      <ChatIcon
        class={css({
          width: 8,
          height: 8,
          mdDown: {
            width: 4,
            height: 4,
          },
        })}
      />
    </div>
  );
}
