import { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { css } from "../../styled-system/css";

interface DialogProps {
  children: ComponentChildren;
  open: boolean;
  onClose: () => void;
}

export default function Dialog({ children, open, onClose }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const current = ref.current;

    if (!current) {
      return;
    }

    if (open) {
      current.showModal();
    } else {
      current.close();
    }

    const handleClose = () => {
      onClose();
    };

    current.addEventListener("close", handleClose);

    return () => {
      current.removeEventListener("close", handleClose);
    };
  }, [open]);

  return (
    <dialog
      class={css({
        width: "min(650px, 100% - 16px)",
        margin: "auto",
        marginInline: "auto",
        rounded: "br-12",
        bg: "ww-white",
        padding: 6,
        shadow: "ww-mid",
      })}
      ref={ref}
    >
      {children}
    </dialog>
  );
}
