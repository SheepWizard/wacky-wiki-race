import { center } from "../../styled-system/patterns";

interface NameTagProps {
  name: string;
  self: boolean;
  ready: boolean;
}

export default function NameTag({ name, self, ready }: NameTagProps) {
  return (
    <div
      data-self={self}
      data-ready={ready}
      class={center({
        padding: 1,
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
      <p>{name}</p>
    </div>
  );
}
