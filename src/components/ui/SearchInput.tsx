import React, { ChangeEvent, FocusEvent } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeHolder?: string;
  style?: string;
  query: string;
  setQuery: (query: string) => void;
  onBlur: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, placeHolder, style, query, setQuery, onBlur }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    onBlur();
  };

  return (
    <input
      type="text"
      className={style}
      placeholder={placeHolder}
      value={query}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default SearchInput;
