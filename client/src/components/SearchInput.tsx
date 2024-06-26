import { TargetedEvent } from "preact/compat";
import { useRef, useState } from "preact/hooks";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearchTextChange: (searchTerm: string) => void;
  searchItems: string[];
  loading?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  searchItems,
  onSearchTextChange,
  loading,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  //maybe add debounce
  const handleOnFocus = () => {
    setSearching(true);
  };

  const handleInputOnChange = (e: TargetedEvent<HTMLInputElement>) => {
    console.log("change");
    setSearchText(e.currentTarget.value);
    onSearchTextChange(e.currentTarget.value);
  };

  const handleItemClick = (item: string) => {
    onChange(item);
    setSearchText("");
    setSearching(false);
  };

  const inputValue = searching ? searchText : value;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <input
          ref={inputRef}
          value={inputValue}
          type="text"
          onInput={handleInputOnChange}
          onFocus={handleOnFocus}
        />
      </div>
      {searching && (
        <ul>
          {loading
            ? "Loading"
            : searchItems.map((item, index) => (
                <li key={index} onClick={() => handleItemClick(item)}>
                  {item.replaceAll("_", " ")}
                </li>
              ))}
        </ul>
      )}
    </div>
  );
}
