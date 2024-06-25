import { center } from "../../styled-system/patterns";

export default function Title() {
  return (
    <div
      class={center({
        bg: "ww-blue",
        border: "solid 4px",
        borderColor: "ww-black",
        rounded: "br-12",
        shadow: "ww-mid",
        p: 6,
        textAlign: "center",
      })}
    >
      <h1>WACKY WACKY RACES</h1>
    </div>
  );
}
