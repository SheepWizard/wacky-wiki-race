//dont send chat when updating room

import { useCallback, useEffect, useRef, useState } from "preact/hooks";
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
  const [chatOpen, setChatOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");

  const handleOpenClick = () => {
    const popover = popoverRef.current;
    const button = buttonRef.current;

    if (!popover || !button) {
      return;
    }

    if (chatOpen) {
      setChatOpen(false);
      popover.hidePopover();
      return;
    }

    setChatOpen(true);
    popover.showPopover();

    const buttonBox = button.getBoundingClientRect();
    const popoverBox = popover.getBoundingClientRect();
    popover.style.top = `${buttonBox.top - popoverBox.height - 10}px`;
    popover.style.left = `${buttonBox.right - popoverBox.width}px`;
  };

  const handleTextSend = useCallback(() => {
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
  }, [text, room]);

  useEffect(() => {
    const chatList = chatListRef.current;
    if (!chatList) {
      return;
    }
    // const chatListBox = chatList.getBoundingClientRect();

    // if (chatList.scrollTop + chatListBox.height !== chatList.scrollHeight) {
    //   return;
    // }

    chatList.scrollTo(0, chatList.scrollHeight);
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || !chatOpen) {
        return;
      }
      handleTextSend();
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [handleTextSend]);

  return (
    <>
      <div
        ref={popoverRef}
        popover="manual"
        class={css({
          maxWidth: "60%",
          width: "300px",
          bg: "ww-white",
          shadow: "ww-mid",
          borderRadius: "br-12",
          height: "500px",
          padding: 2,
          border: "solid 2px",
          borderColor: "ww-black",
        })}
      >
        <div class={vstack({ h: "full", gap: 2 })}>
          <div
            ref={chatListRef}
            class={vstack({
              gap: 2,
              w: "full",
              flexGrow: 1,
              overflowY: "auto",
              borderRadius: "br-12",
              scrollbarWidth: "none",
            })}
          >
            {chat.map((message, index) => (
              <ChatMessage key={index} chatMessage={message} />
            ))}
          </div>
          <div class={vstack({ w: "full", gap: 1 })}>
            <Input value={text} onChange={setText} max={500} />
            <Button onClick={handleTextSend} stretch size="small">
              Send
            </Button>
          </div>
        </div>
      </div>
      <ChatButton reff={buttonRef} onClick={handleOpenClick} />
    </>
  );
}
