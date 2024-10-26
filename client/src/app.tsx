import Chat from "./components/chat/Chat";
import Help from "./components/help/Help";
import NotConnectedBanner from "./components/NotConnectedBanner";
import EndGamePage from "./pages/EndGamePage";
import GamePage from "./pages/gamePage/GamePage";
import LandingPage from "./pages/landingPage/LandingPage";
import LobbyPage from "./pages/lobbyPage/LobbyPage";
import { useRoom } from "./providers/RoomProvider";
import { useSession } from "./providers/SessionProvider";
import { Room } from "./types";

export function App() {
  const { isConnected } = useSession();
  const { room } = useRoom();

  return (
    <>
      {!isConnected && <NotConnectedBanner />}
      {getPage(room?.state)}
      {room && <Chat />}
      <Help />
    </>
  );
}

function getPage(roomState?: Room["state"]) {
  if (!roomState) {
    return <LandingPage />;
  }
  switch (roomState) {
    case "lobby":
      return <LobbyPage />;
    case "inGame":
      return <GamePage />;
    case "endGame":
      return <EndGamePage />;
  }
}
