import { css } from "../../styled-system/css";
import { center } from "../../styled-system/patterns";
import CrownIcon from "./icons/CrownIcon";

interface NameTagProps {
  name: string;
  self: boolean;
  ready: boolean;
  isOwner: boolean;
}

export default function NameTag({ name, self, ready, isOwner }: NameTagProps) {
  return (
    <div
      data-self={self}
      data-ready={ready}
      class={center({
        padding: 1,
        gap: 1,
        backgroundColor: "ww-red",
        rounded: "br-25",
        border: "solid 2px",
        borderColor: "ww-black",
        "&[data-self=true]": {
          textDecoration: "underline",
        },
        "&[data-ready=true]": {
          bg: "ww-bright-green",
        },
      })}
    >
      {isOwner && <CrownIcon class={css({ flexShrink: 0 })} />}
      <p>{name}</p>
    </div>
  );
}
