import { render } from "preact";
import { App } from "./app.tsx";
import "./css/wiki.css";
import "./css/game.css";
import "./css/index.css";
import { css } from "../styled-system/css/css";
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
