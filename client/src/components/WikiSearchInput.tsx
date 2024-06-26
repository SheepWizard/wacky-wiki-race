import { useState } from "preact/hooks";
import Select from "./Select";
import { searchWikiPage } from "../wiki";

interface WikiSearchInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export function WikiSearchInput({ id, value, onChange }: WikiSearchInputProps) {
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
    <Select
      id={id}
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
