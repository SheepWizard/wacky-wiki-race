import { ComponentChildren } from "preact";
import { cva } from "../../styled-system/css";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  stretch?: boolean;
  children: ComponentChildren;
}

const button = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bg: "ww-pink",
    rounded: "br-12",
    borderX: "solid 2px",
    borderTop: "solid 2px",
    borderBottom: "solid 8px",
    borderColor: "ww-black",
    padding: "10px",
    cursor: "pointer",
    height: 58,
  },
  variants: {
    visual: {
      stretch: {
        width: "100%",
      },
    },
    state: {
      disabled: {
        bg: "ww-grey",
        cursor: "default",
      },
    },
  },
});

export default function Button({
  onClick,
  stretch,
  disabled,
  children,
}: ButtonProps) {
  return (
    <button
      class={button({
        visual: stretch ? "stretch" : undefined,
        state: disabled ? "disabled" : undefined,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      <p>{children}</p>
    </button>
  );
}
