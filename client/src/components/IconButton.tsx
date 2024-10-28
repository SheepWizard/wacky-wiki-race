import { cva } from "../../styled-system/css";

interface IconbuttonProps {
  children: React.ReactNode;
  onClick: () => void;
}

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
});

export default function Iconbutton({ children, onClick }: IconbuttonProps) {
  return (
    <button class={iconButton()} onClick={onClick}>
      {children}
    </button>
  );
}
