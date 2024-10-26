import { center } from "../../styled-system/patterns";

export default function NotConnectedBanner() {
  return (
    <div
      class={center({
        h: 10,
        bg: "ww-red",
        w: "full",
        position: "fixed",
        top: 0,
        zIndex: 10,
      })}
    >
      Not connected
    </div>
  );
}
