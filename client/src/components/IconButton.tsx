import { cva } from "../../styled-system/css";

const iconButton = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bg: "ww-blue",
    rounded: "9999999px",
    borderX: "solid 2px",
    borderTop: "solid 2px",
    borderBottom: "solid 8px",
    borderColor: "ww-black",
    padding: "10px",
    cursor: "pointer",
    width: 58,
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
    colour: {
      pink: {
        bg: "ww-primary-20",
      },
      pinky: {
        bg: "ww-primary-30",
      },
      purple: {
        bg: "ww-primary-40",
      },
    },
  },
});

interface IconbuttonProps {
  children: React.ReactNode;
  colour: "pink" | "pinky" | "purple";
  onClick: () => void;
}

export default function Iconbutton({
  children,
  onClick,
  colour,
}: IconbuttonProps) {
  return (
    <button class={iconButton({ colour })} onClick={onClick}>
      {children}
    </button>
  );
}
