//dont send chat when updating room

import { useRef, useState } from "preact/hooks";
import { vstack } from "../../../styled-system/patterns";
import { useRoom } from "../../providers/RoomProvider";
import Input from "../Input";
import { useSocket } from "../../providers/SessionProvider";
import Button from "../Button";
import ChatMessage from "./ChatMessage";
import ChatButton from "./ChatButton";
import { css } from "../../../styled-system/css";

export default function Chat() {
  const { chat, room } = useRoom();
  const socket = useSocket();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");

  const handleOpenClick = () => {
    const popover = popoverRef.current;

    if (!popover) {
      return;
    }

    popover.showPopover();
  };

  const handleTextSend = () => {
    if (!room) {
      return;
    }

    if (text === "") {
      return;
    }

    if (text.length > 500) {
      return;
    }

    socket.emit("room:chat", room.id, text);
    setText("");
  };

  return (
    <>
      <div ref={popoverRef} popover="manual" class={css({ maxWidth: "60%" })}>
        <div class={vstack({ gap: 2, w: "full" })}>
          {chat.map((message, index) => (
            <ChatMessage key={index} chatMessage={message} />
          ))}
        </div>
        <Input value={text} onChange={setText} max={500} />
        <Button onClick={handleTextSend} stretch size="small">
          Send
        </Button>
      </div>
      <ChatButton onClick={handleOpenClick} />
    </>
  );
}
