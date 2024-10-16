import { center } from "../../../styled-system/patterns";

interface ChatButtonProps {
  onClick: () => void;
}

export default function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <div
      onClick={onClick}
      class={center({
        width: 10,
        height: 10,
        bg: "ww-purple",
        borderRadius: "999999px",
        pos: "absolute",
        bottom: 5,
        right: 5,
        cursor: "pointer",
      })}
    >
      M
    </div>
  );
}
