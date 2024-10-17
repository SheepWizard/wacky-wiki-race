import { css } from "../../../styled-system/css";
import { vstack } from "../../../styled-system/patterns";
import { useSession } from "../../providers/SessionProvider";
import { Room, Unarray } from "../../types";

interface ChatMessageProps {
  chatMessage: Unarray<Room["chat"]>;
}

export default function ChatMessage({ chatMessage }: ChatMessageProps) {
  const { userId } = useSession();

  const isMe = chatMessage.userId === userId;

  return (
    <div
      class={vstack({
        gap: 0.5,
        padding: 1,
        bg: isMe ? "ww-pink" : "ww-blue",
        alignSelf: isMe ? "flex-end" : "flex-start",
        alignItems: isMe ? "flex-end" : "flex-start",
        maxWidth: "80%",
        textWrap: "wrap",
        wordBreak: "break-word",
        borderRadius: "br-12",
      })}
    >
      <div class={css({ fontSize: 12 })}>{chatMessage.userName}</div>
      <div>{chatMessage.message}</div>
    </div>
  );
}
