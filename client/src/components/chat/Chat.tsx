//dont send chat when updating room

import { useRef, useState } from "preact/hooks";
import { vstack } from "../../../styled-system/patterns";
import { useRoom } from "../../providers/RoomProvider";
import Input from "../Input";
import { useSession, useSocket } from "../../providers/SessionProvider";
import Button from "../Button";
import { css } from "../../../styled-system/css";
import ChatMessage from "./ChatMessage";

export default function Chat() {
  const { chat, room } = useRoom();
  const socket = useSocket();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");

  console.log(chat);

  const handleTextSend = () => {
    if (!room) {
      return;
    }

    if (text === "") {
      return;
    }
    socket.emit("room:chat", room.id, text);
    setText("");
  };

  return (
    <div ref={popoverRef}>
      <div class={vstack({ gap: 2, w: "full" })}>
        {chat.map((message, index) => (
          <ChatMessage key={index} chatMessage={message} />
        ))}
      </div>
      <Input value={text} onChange={setText} />
      <Button onClick={handleTextSend} stretch size="small">
        Send
      </Button>
    </div>
  );
}
