import { css } from "../../styled-system/css";
import { hstack } from "../../styled-system/patterns";

interface InputLabelProps {
  labelValue: string;
  labelButton?: string;
  onLabelButtonClick?: () => void;
}

export default function InputLabel({
  labelValue,
  labelButton,
  onLabelButtonClick,
}: InputLabelProps) {
  return (
    <div class={hstack({ alignItems: "center", gap: 2 })}>
      <p class={css({ ml: 1 })}>{labelValue}</p>
      {labelButton && (
        <p class={css({ cursor: "pointer" })} onClick={onLabelButtonClick}>
          {labelButton}
        </p>
      )}
    </div>
  );
}
