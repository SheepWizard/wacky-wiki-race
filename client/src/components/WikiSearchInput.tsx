import { useState } from "preact/hooks";
import SearchInput from "./SearchInput";
import { searchWikiPage } from "../wiki";

interface WikiSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function WikiSearchInput({ value, onChange }: WikiSearchInputProps) {
  const [searchList, setSearchList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchTextChange = async (searchTerm: string) => {
    try {
      setLoading(true);
      const results = await searchWikiPage(searchTerm);
      setSearchList(results);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchInput
      value={value}
      onChange={(value) => {
        onChange(value);
        setSearchList([]);
      }}
      searchItems={searchList}
      onSearchTextChange={handleSearchTextChange}
      loading={loading}
    />
  );
}
