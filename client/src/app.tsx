import { useEffect, useState } from "preact/hooks";
import { Room } from "./types";
import LandingPage from "./pages/LandingPage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import EndGamePage from "./pages/EndGamePage";
import { useIsSocketConnected } from "./util/connectionHook";
import { socket } from "./socket";

export function App() {
  const isConnected = useIsSocketConnected();
  const [room, setRoom] = useState<Room>();

  const handleRoomUpdate = (room: Room) => {
    setRoom(room);
  };

  useEffect(() => {
    socket.on("room:update", handleRoomUpdate);
    return () => {
      socket.off("room:update", handleRoomUpdate);
    };
  });

  if (!isConnected) {
    return "Not connected";
  }

  if (!room) {
    return <LandingPage />;
  }

  if (room.state === "lobby") {
    return <LobbyPage room={room} />;
  }

  if (room.state === "inGame") {
    return <GamePage room={room} />;
  }

  if (room.state === "endGame") {
    return <EndGamePage room={room} />;
  }
}
