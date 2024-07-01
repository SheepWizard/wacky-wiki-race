import { ComponentChildren, createContext } from "preact";
import { Room } from "../types";
import { useContext, useEffect, useState } from "preact/hooks";
import { useSocket } from "./SessionProvider";

interface RoomContextProps {
  room?: Room;
  setRoom: (room?: Room) => void;
}

const RoomContext = createContext<RoomContextProps | null>(null);

interface RoomProviderProps {
  children: ComponentChildren;
}

export default function RoomProvider({ children }: RoomProviderProps) {
  const [room, setRoom] = useState<Room>();
  const socket = useSocket();

  const handleRoomUpdate = (room: Room) => {
    setRoom(room);
  };

  useEffect(() => {
    socket.on("room:update", handleRoomUpdate);
    return () => {
      socket.off("room:update", handleRoomUpdate);
    };
  }, []);

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
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
