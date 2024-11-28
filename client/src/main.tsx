import { render } from "preact";
import { css } from "../styled-system/css/css";
import { App } from "./app.tsx";
import "./css/game.css";
import "./css/index.css";
import RoomProvider from "./providers/RoomProvider.tsx";
import SessionProvider from "./providers/SessionProvider.tsx";

render(
  <div class={css({ h: "lvh" })}>
    <SessionProvider>
      <RoomProvider>
        <App />
      </RoomProvider>
    </SessionProvider>
  </div>,
  document.getElementById("app")!
);
