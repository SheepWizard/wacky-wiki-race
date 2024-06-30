import { render } from "preact";
import { App } from "./app.tsx";
import "./wiki.css";
import "./index.css";
import { css } from "../styled-system/css/css";
import RoomProvider from "./providers/RoomProvider.tsx";

render(
  <div class={css({ h: "lvh" })}>
    <RoomProvider>
      <App />
    </RoomProvider>
  </div>,
  document.getElementById("app")!
);
