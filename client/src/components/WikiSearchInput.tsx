import { useState } from "preact/hooks";
import Select from "./Select";
import { wikiApiSearchForPage } from "../wiki";

interface WikiSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  labelValue?: string;
  disabled?: boolean;
}

export function WikiSearchInput({
  value,
  onChange,
  labelValue,
  disabled,
}: WikiSearchInputProps) {
  const [searchList, setSearchList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchTextChange = async (searchTerm: string) => {
    try {
      setLoading(true);
      const results = await wikiApiSearchForPage(searchTerm);
      setSearchList(results);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      value={value}
      onChange={(value) => {
        onChange(value);
        setSearchList([]);
      }}
      labelValue={labelValue}
      searchItems={searchList}
      onSearchTextChange={handleSearchTextChange}
      loading={loading}
      disabled={disabled}
    />
  );
}
