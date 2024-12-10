import { ComponentChildren } from "preact";
import { center } from "../../styled-system/patterns";

interface ToggleButtonProps {
  toggled: boolean;
  onToggled: (value: boolean) => void;
  children: ComponentChildren;
}

export function ToggleButton({
  toggled,
  onToggled,
  children,
}: ToggleButtonProps) {
  return (
    <div
      onClick={() => onToggled(!toggled)}
      class={center({
        rounded: "br-25",
        padding: 1,
        cursor: "pointer",
        bg: toggled ? "ww-primary-30" : "ww-white",
        border: toggled ? "solid 2px" : "solid 1px",
        borderColor: "ww-black",
      })}
    >
      {children}
    </div>
  );
}
