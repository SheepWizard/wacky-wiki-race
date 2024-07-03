import { ComponentChildren } from "preact";
import { center } from "../../styled-system/patterns";

interface GreenBoxProps {
  children: ComponentChildren;
}

export default function GreenBox({ children }: GreenBoxProps) {
  return (
    <div
      class={center({
        width: "min(700px, 100% - 16px)",
        marginInline: "auto",
        height: "100%",
        overflowY: "auto",
        alignItems: "safe center",
      })}
    >
      <div
        class={center({
          bg: "ww-green",
          rounded: "br-12",
          border: "solid 2px",
          borderColor: "ww-black",
          flexGrow: 1,
          shadow: "ww-thicc",
          paddingY: 8,
          overflowX: "hidden",
        })}
      >
        <div
          class={center({
            width: "min(600px, 100% - 16px)",
            marginInline: "auto",
            flexDir: "column",
            gap: 6,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
