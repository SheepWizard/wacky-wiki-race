import { css } from "../../../styled-system/css";
import { vstack } from "../../../styled-system/patterns";
import { RoomSystemChatMessage } from "../../types";

interface SystemChatMessageProps {
  chatMessage: RoomSystemChatMessage;
}

export default function SystemChatMessage({
  chatMessage,
}: SystemChatMessageProps) {
  return (
    <div
      class={css({
        padding: 1,
        bg: "ww-grey",
        alignSelf: "center",
        maxWidth: "80%",
        textWrap: "wrap",
        wordBreak: "break-word",
        borderRadius: "br-6",
        textAlign: "center",
        fontSize: 12,
      })}
    >
      <div>{chatMessage.message}</div>
    </div>
  );
}
