import { TargetedEvent } from "preact/compat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { css, cva } from "../../styled-system/css";
import { flex, vstack } from "../../styled-system/patterns";
import { useWindowChange } from "../hooks/useWindowChange";
import InputLabel from "./InputLabel";

interface SearchInputProps {
  value: string;
  onChange: (value: string, index: number) => void;
  onSearchTextChange: (searchTerm: string) => void;
  searchItems: string[];
  loading?: boolean;
  labelValue?: string;
  disabled?: boolean;
  labelButton?: string;
  onLabelButtonClick?: () => void;
}

const input = cva({
  base: {
    backgroundColor: "ww-white",
    border: "solid 2px",
    borderColor: "ww-black",
    rounded: "br-12",
    paddingX: 3,
    paddingY: 2,
    boxShadow: `inset 0px 2px 0px 2px token(colors.ww-grey)`,
    width: "100%",
  },
});

export default function Select({
  value,
  onChange,
  searchItems,
  onSearchTextChange,
  loading,
  labelValue,
  disabled,
  labelButton,
  onLabelButtonClick,
}: SearchInputProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectIndex);

  const positionPopover = useCallback(() => {
    const popover = popoverRef.current;
    const input = inputRef.current;
    if (!popover || !input) {
      return;
    }
    // Switch to this when its out
    // https://developer.chrome.com/blog/anchor-positioning-api

    const windowHeight = window.innerHeight;
    const inputBox = input.getBoundingClientRect();
    popover.style.left = `${inputBox.left}px`;
    popover.style.top = `${inputBox.bottom}px`;
    popover.style.width = `${inputBox.width}px`;

    const offset = windowHeight - inputBox.bottom;
    popover.style.maxHeight = `${offset}px`;
  }, []);
  useWindowChange(positionPopover);

  const handleOnFocus = () => {
    setSearching(true);
    setSelectedIndex(0);

    const popover = popoverRef.current;
    const input = inputRef.current;
    if (!popover || !input) {
      return;
    }
    input.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    popover.showPopover();
    positionPopover();
  };

  const handleInputOnChange = (e: TargetedEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
    onSearchTextChange(e.currentTarget.value);
  };

  const handleOnBlur = () => {
    setSearching(false);
    popoverRef.current?.hidePopover();
  };

  const handleItemClick = (item: string, index: number) => {
    onChange(item, index);
    setSearchText("");
  };

  const handleLabelButtonClick = () => {
    if (disabled) {
      return;
    }
    onLabelButtonClick?.();
  };

  useEffect(() => {
    selectedIndexRef.current = selectIndex;
  }, [selectIndex]);

  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) {
      return;
    }
    popover.scrollTo();
  }, [selectIndex]);

  useEffect(() => {
    const input = inputRef.current;

    if (!searching || !input) {
      return;
    }
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          setSelectedIndex((val) => {
            if (val >= searchItems.length - 1) {
              return 0;
            }
            return val + 1;
          });
          break;
        case "ArrowUp":
          setSelectedIndex((val) => {
            if (val === 0) {
              val = searchItems.length;
            }
            return val - 1;
          });
          break;
        case "Enter":
          const selected = searchItems[selectedIndexRef.current];
          if (!selected) {
            return;
          }
          handleItemClick(selected, selectIndex);
          input.blur();
      }
    };

    document.addEventListener("keyup", handleKeyPress);

    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, [searching, searchItems]);

  const inputValue = searching ? searchText : value;
  const noItems = searchItems.length === 0;

  return (
    <div
      class={vstack({ gap: "2px", width: "100%", alignItems: "flex-start" })}
    >
      {labelValue && (
        <InputLabel
          labelValue={labelValue}
          labelButton={labelButton}
          onLabelButtonClick={handleLabelButtonClick}
        />
      )}
      <div class={flex({ flexDir: "column", width: "100%" })}>
        <input
          class={input()}
          ref={inputRef}
          value={inputValue}
          type="text"
          onInput={handleInputOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          disabled={disabled}
        />

        <div
          ref={popoverRef}
          popover="manual"
          class={css({
            backgroundColor: "ww-white",
            border: "solid 2px",
            borderColor: "ww-black",
            rounded: "br-12",
            padding: 3,
          })}
        >
          <ul>
            {loading ? (
              "Loading"
            ) : noItems ? (
              <p class={css({ color: "ww-grey" })}>Search</p>
            ) : (
              searchItems.map((item, index) => (
                <li
                  key={index}
                  onMouseDown={() => handleItemClick(item, index)}
                  data-selected={selectIndex === index}
                  class={css({
                    rounded: "br-12",
                    padding: 1,
                    "&[data-selected=true]": {
                      bg: "ww-grey",
                    },
                    _hover: {
                      bg: "ww-grey",
                    },
                  })}
                >
                  <p>{item.replaceAll("_", " ")}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
