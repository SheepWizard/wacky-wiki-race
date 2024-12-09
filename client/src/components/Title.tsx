import { center } from "../../styled-system/patterns";

export default function Title() {
  return (
    <div
      class={center({
        bg: "white",
        border: "solid 4px",
        borderColor: "ww-black",
        rounded: "br-12",
        p: 6,
        textAlign: "center",
        width: "100%",
      })}
    >
      <h1>WACKY WIKI RACES</h1>
    </div>
  );
}
