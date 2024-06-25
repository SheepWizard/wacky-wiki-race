import { render } from "preact";
import { App } from "./app.tsx";
// import "./wiki.css";
import "./index.css";
import { css } from "../styled-system/css/css";

render(
  <div class={css({ bg: "ww-yellow", h: "lvh" })}>
    <App />
  </div>,
  document.getElementById("app")!
);
