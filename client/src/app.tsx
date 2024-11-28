import { lazy, Suspense } from "preact/compat";
import Chat from "./components/chat/Chat";
import Help from "./components/help/Help";
import NotConnectedBanner from "./components/NotConnectedBanner";
import EndGamePage from "./pages/EndGamePage";
import { useRoom } from "./providers/RoomProvider";
import { Room } from "./types";

const LobbyPage = lazy(() => import("./pages/lobbyPage/LobbyPage"));
const GamePage = lazy(() => import("./pages/gamePage/GamePage"));
const LandingPage = lazy(() => import("./pages/landingPage/LandingPage"));

export function App() {
  const { room } = useRoom();

  const showHelp = !room || room.state === "lobby";
  return (
    <>
      <NotConnectedBanner />
      {getPage(room?.state)}
      {room && !room.rules.disableChat && <Chat />}
      {showHelp && <Help />}
    </>
  );
}

function getPage(roomState?: Room["state"]) {
  if (!roomState) {
    return <LandingPage />;
  }
  switch (roomState) {
    case "lobby":
      return (
        <Suspense fallback={<div>loading...</div>}>
          <LobbyPage />
        </Suspense>
      );
    case "inGame":
      return (
        <Suspense fallback={<div>loading...</div>}>
          <GamePage />
        </Suspense>
      );
    case "endGame":
      return (
        <Suspense fallback={<div>loading...</div>}>
          <EndGamePage />
        </Suspense>
      );
  }
}
