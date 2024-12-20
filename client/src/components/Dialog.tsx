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

    const handleClick = (event: MouseEvent) => {
      if (event.target === current) {
        current.close();
      }
    };

    current.addEventListener("click", handleClick);
    current.addEventListener("close", handleClose);

    return () => {
      current.removeEventListener("close", handleClose);
      current.removeEventListener("click", handleClick);
    };
  }, [open]);

  return (
    <dialog
      class={css({
        width: "min(650px, 100% - 16px)",
        margin: "auto",
        marginInline: "auto",
        rounded: "br-12",
        bg: "ww-primary-20",
        border: "solid 2px",
        borderColor: "ww-black",
        padding: 6,
        opacity: 0,
        transition:
          "opacity 0.2s, overlay 0.2s allow-discrete, display 0.2s allow-discrete",
        _open: {
          opacity: 1,
          _backdrop: {
            opacity: 0.5,
          },
        },
        _backdrop: {
          bg: "ww-primary-10",
          opacity: 0,
          transition:
            "opacity 0.2s, overlay 0.2s allow-discrete, display 0.2s allow-discrete",
        },
        _starting: {
          _open: {
            opacity: 0,
            _backdrop: {
              opacity: 0,
            },
          },
        },
      })}
      ref={ref}
    >
      {children}
    </dialog>
  );
}
