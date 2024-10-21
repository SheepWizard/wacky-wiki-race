import { ComponentChildren, createContext } from "preact";
import { Room, RoomPartial } from "../types";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { useSocket } from "./SessionProvider";

interface RoomContextProps {
  room?: Room;
  setRoom: (room?: Room) => void;
  chat: Room["chat"];
}

const RoomContext = createContext<RoomContextProps | null>(null);

interface RoomProviderProps {
  children: ComponentChildren;
}

export default function RoomProvider({ children }: RoomProviderProps) {
  const [room, setRoom] = useState<Room>();
  const [chat, setChat] = useState<Room["chat"]>([]);
  const socket = useSocket();

  const handleRoomUpdate = useCallback((room: Room) => {
    setRoom(room);
    setChat(room.chat);
  }, []);

  const handleChatUpdate = useCallback((chat: Room["chat"]) => {
    setChat(chat);
  }, []);

  const handleRoomPartialUpdate = useCallback(
    (partialRoom: RoomPartial) => {
      if (!room) {
        return;
      }
      setRoom({ ...room, ...partialRoom });
    },
    [room]
  );

  useEffect(() => {
    socket.on("room:chat:update", handleChatUpdate);
    socket.on("room:update", handleRoomUpdate);
    socket.on("room:partial:update", handleRoomPartialUpdate);
    return () => {
      socket.off("room:chat:update", handleChatUpdate);
      socket.off("room:update", handleRoomUpdate);
      socket.off("room:partial:update", handleRoomPartialUpdate);
    };
  }, [handleRoomUpdate, handleChatUpdate, handleRoomPartialUpdate]);

  return (
    <RoomContext.Provider value={{ room, setRoom, chat }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const ctx = useContext(RoomContext);

  if (!ctx) {
    throw new Error("useRoom must be used inside RoomProvider");
  }

  return ctx;
}
