import { css } from "../../styled-system/css";
import { vstack } from "../../styled-system/patterns";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  labelValue?: string;
}

export default function Input({ value, onChange, labelValue }: InputProps) {
  return (
    <div
      class={vstack({ gap: "2px", width: "100%", alignItems: "flex-start" })}
    >
      {labelValue && <p class={css({ ml: 1 })}>{labelValue}</p>}
      <input
        class={css({
          border: "solid 4px",
          borderColor: "ww-black",
          rounded: "br-12",
          bg: "ww-white",
          paddingY: 2,
          paddingX: 3,
          width: "100%",
        })}
        value={value}
        onInput={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  );
}
