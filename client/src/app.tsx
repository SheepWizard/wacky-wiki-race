import LandingPage from "./pages/landingPage/LandingPage";
import EndGamePage from "./pages/EndGamePage";
import { useIsSocketConnected } from "./util/connectionHook";
import { useRoom } from "./providers/RoomProvider";
import LobbyPage from "./pages/lobbyPage/LobbyPage";
import GamePage from "./pages/gamePage/GamePage";

export function App() {
  const isConnected = useIsSocketConnected();
  const { room } = useRoom();

  if (!isConnected) {
    console.log("No connected");
    // return <div> "Not connected"</div>;
  }

  if (!room) {
    return <LandingPage />;
  }

  if (room.state === "lobby") {
    return <LobbyPage />;
  }

  if (room.state === "inGame") {
    return <GamePage />;
  }

  if (room.state === "endGame") {
    return <EndGamePage room={room} />;
  }

  return <div />;
}
