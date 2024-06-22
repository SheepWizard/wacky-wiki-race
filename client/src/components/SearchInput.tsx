import { TargetedEvent } from "preact/compat";
import { useRef, useState } from "preact/hooks";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  searchItems: string[];
}

export default function SearchInput({
  value,
  onChange,
  searchItems,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);

  const handleOnFocus = () => {
    setSearching(true);
  };

  const handleOnBlur = () => {
    setSearching(false);
    setSearchText("");
  };

  const handleOnChange = (e: TargetedEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  };

  const handleItemClick = (item: string) => {
    console.log("thing", item);
    onChange(item);
    inputRef.current?.blur();
  };

  const inputValue = searching ? searchText : value;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <input
          ref={inputRef}
          value={inputValue}
          type="text"
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </div>
      {searching && (
        <ul>
          {searchItems.map((item, index) => (
            <li key={index} onClick={() => handleItemClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
