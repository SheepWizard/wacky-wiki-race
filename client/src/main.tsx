import { render } from "preact";
import { App } from "./app.tsx";
import "./wiki.css";
import "./index.css";

render(<App />, document.getElementById("app")!);
