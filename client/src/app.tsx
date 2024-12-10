import { lazy, Suspense } from "preact/compat";
import { css } from "../styled-system/css";
import Chat from "./components/chat/Chat";
import Help from "./components/help/Help";
import NotConnectedBanner from "./components/NotConnectedBanner";
import LandingPage from "./pages/landingPage/LandingPage";
import { useRoom } from "./providers/RoomProvider";
import { Room } from "./types";

const GamePage = lazy(() => import("./pages/gamePage/GamePage"));
const EndGamePage = lazy(() => import("./pages/EndGamePage"));
const LobbyPage = lazy(() => import("./pages/lobbyPage/LobbyPage"));

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
        <Suspense
          fallback={
            <div class={css({ bg: "ww-primary-10", h: "full" })}>
              loading...
            </div>
          }
        >
          <LobbyPage />
        </Suspense>
      );
    case "inGame":
      return (
        <Suspense
          fallback={
            <div class={css({ bg: "ww-primary-10", h: "full" })}>
              loading...
            </div>
          }
        >
          <GamePage />
        </Suspense>
      );
    case "endGame":
      return (
        <Suspense
          fallback={
            <div class={css({ bg: "ww-primary-10", h: "full" })}>
              loading...
            </div>
          }
        >
          <EndGamePage />
        </Suspense>
      );
  }
}
