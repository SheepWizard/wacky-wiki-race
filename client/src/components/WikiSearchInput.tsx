import { useState } from "preact/hooks";
import Select from "./Select";
import { wikiApiSearchForPage } from "../wiki";
import { WikiPage } from "../types";

interface WikiSearchInputProps {
  value: string;
  onChange: (value: WikiPage) => void;
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
  const [pageIds, setPageIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchTextChange = async (searchTerm: string) => {
    try {
      setLoading(true);
      const results = await wikiApiSearchForPage(searchTerm);
      setSearchList(results.map((x) => x.title));
      setPageIds(results.map((x) => x.pageId));
    } catch {
      // Add error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      value={value}
      onChange={(value, index) => {
        const pageId = pageIds[index] ?? 0;
        onChange({
          title: value,
          pageId,
        });
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
