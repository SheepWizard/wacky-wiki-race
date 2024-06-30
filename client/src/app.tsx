import { useEffect, useState } from "preact/hooks";
import { Room } from "./types";
import LandingPage from "./pages/LandingPage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import EndGamePage from "./pages/EndGamePage";
import { useIsSocketConnected } from "./util/connectionHook";
import { socket } from "./socket";
import { useSocketSession } from "./util/sessionHook";
import { useRoom } from "./providers/RoomProvider";

export function App() {
  const isConnected = useIsSocketConnected();
  useSocketSession();
  const { room } = useRoom();

  if (!isConnected) {
    console.log("No connected");
    // return <div> "Not connected"</div>;
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

  return <div />;
}
