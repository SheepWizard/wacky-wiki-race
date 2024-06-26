import { JSX, TargetedEvent } from "preact/compat";
import { useRef, useState } from "preact/hooks";
import { css, cva } from "../../styled-system/css";
import { flex } from "../../styled-system/patterns";
import { useOutsideClick } from "../util/outsideClickHook";

interface SearchInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onSearchTextChange: (searchTerm: string) => void;
  searchItems: string[];
  loading?: boolean;
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
  id,
  value,
  onChange,
  searchItems,
  onSearchTextChange,
  loading,
}: SearchInputProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  useOutsideClick(inputRef, () => {
    popoverRef.current?.hidePopover();
  });
  //maybe add debounce
  const handleOnFocus = () => {
    setSearching(true);

    const popover = popoverRef.current;
    const input = inputRef.current;
    if (!popover || !input) {
      return;
    }
    popover.showPopover();
    // Switch to this when its out
    // https://developer.chrome.com/blog/anchor-positioning-api

    const inputBox = input.getBoundingClientRect();
    popover.style.left = `${inputBox.left}px`;
    popover.style.top = `${inputBox.bottom}px`;
    popover.style.width = `${inputBox.width}px`;
  };

  const handleInputOnChange = (e: TargetedEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
    onSearchTextChange(e.currentTarget.value);
  };

  const handleItemClick = (item: string) => {
    onChange(item);
    setSearchText("");
    setSearching(false);
    popoverRef.current?.hidePopover();
  };

  const inputValue = searching ? searchText : value;
  const noItems = searchItems.length === 0;

  return (
    <div class={flex({ flexDir: "column", width: "100%" })}>
      <input
        class={input()}
        ref={inputRef}
        value={inputValue}
        type="text"
        onInput={handleInputOnChange}
        onFocus={handleOnFocus}
        onBlur={() => setSearching(false)}
      />

      <div
        id={`select-popover.${id}`}
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
                onClick={() => handleItemClick(item)}
                class={css({
                  rounded: "br-12",
                  padding: 1,
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
  );
}
