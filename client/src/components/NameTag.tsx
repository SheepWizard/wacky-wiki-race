import { center } from "../../styled-system/patterns";

interface NameTagProps {
  name: string;
  self: boolean;
}

export default function NameTag({ name, self }: NameTagProps) {
  return (
    <div
      data-self={self}
      class={center({
        padding: 1,
        backgroundColor: "ww-red",
        rounded: "br-25",
        border: "solid 2px",
        borderColor: "ww-black",
        "&[data-self=true]": {
          textDecoration: "underline",
        },
      })}
    >
      <p>{name}</p>
    </div>
  );
}
