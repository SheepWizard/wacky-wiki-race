import { JSX } from "preact/jsx-runtime";
import { css } from "../../styled-system/css";
import { vstack } from "../../styled-system/patterns";
import { useRef } from "preact/hooks";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  labelValue?: string;
  placeholder?: string;
  max?: number;
}

export default function Input({
  value,
  onChange,
  placeholder,
  labelValue,
  max,
}: InputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const handleOnChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const newValue = e.currentTarget.value;
    if (max !== undefined && newValue.length >= max && ref.current?.value) {
      ref.current.value = value;
      return;
    }
    onChange(newValue);
  };

  return (
    <div
      class={vstack({ gap: "2px", width: "100%", alignItems: "flex-start" })}
    >
      {labelValue && <p class={css({ ml: 1 })}>{labelValue}</p>}
      <input
        ref={ref}
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
        placeholder={placeholder}
        onInput={handleOnChange}
      />
    </div>
  );
}
