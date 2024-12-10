import { css } from "../../styled-system/css";

export default function Kawaii() {
  return (
    <div
      class={css({
        w: "full",
        h: "full",
        bg: "radial-gradient(circle, rgba(162,210,255,1) 0%, rgba(205,180,219,1) 100%)",
        pos: "absolute",
      })}
    >
      <img
        class={css({
          pos: "absolute",
          transform: "rotate(-30deg)",
          top: 0,
          opacity: 0.8,
        })}
        src="/cloud.png"
      />
    </div>
  );
}
