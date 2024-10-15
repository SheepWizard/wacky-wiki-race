import { ComponentChildren } from "preact";
import { cva } from "../../styled-system/css";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  stretch?: boolean;
  style?: "default" | "secondary";
  size?: "small";
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
    _active: {
      "&:not(&[disabled])": {
        borderBottom: "solid 2px",
      },
    },
    _focusVisible: {
      outline: "solid blue",
    },
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
    size: {
      small: {
        height: 34,
        padding: "5px",
      },
    },
    style: {
      secondary: {
        bg: "ww-purple",
      },
    },
  },
});

export default function Button({
  onClick,
  stretch,
  disabled,
  size,
  children,
}: ButtonProps) {
  return (
    <button
      class={button({
        visual: stretch ? "stretch" : undefined,
        state: disabled ? "disabled" : undefined,
        size: size === "small" ? "small" : undefined,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      <p>{children}</p>
    </button>
  );
}
