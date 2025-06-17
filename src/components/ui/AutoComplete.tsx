import React, { useState, useEffect } from "react";

interface FilterListProps<T> {
  items: T[];
  placeholder?: string;
  displayProperty: (item: T) => string;
  onSelect?: (item: T | string) => void;
  defaultValue?: T | string;
}

function FilterList<T>({
  items,
  placeholder = "Rechercher...",
  displayProperty,
  onSelect,
  defaultValue,
}: FilterListProps<T>) {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Gérer la valeur par défaut au montage ou quand elle change
  useEffect(() => {
    if (defaultValue) {
      if (typeof defaultValue === "string") {
        setQuery(defaultValue);
      } else {
        setQuery(displayProperty(defaultValue));
      }
    }
  }, [defaultValue, displayProperty]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
  };

  const handleSelect = (item: T) => {
    const value = displayProperty(item);
    setQuery(value);
    setIsTyping(false);
    onSelect?.(item);
  };

  const handleBlur = () => {
    if (query.trim()) {
      const matchedItem = items.find(
        (item) => displayProperty(item).toLowerCase() === query.trim().toLowerCase()
      );
      if (!matchedItem) {
        onSelect?.(query.trim());
      }
    }
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const matchedItem = items.find(
        (item) => displayProperty(item).toLowerCase() === query.trim().toLowerCase()
      );
      if (matchedItem) {
        handleSelect(matchedItem);
      } else {
        onSelect?.(query.trim());
        setIsTyping(false);
      }
    }
  };

  const filteredItems = query.trim()
    ? items.filter((item) =>
        displayProperty(item).toLowerCase().includes(query.trim().toLowerCase())
      )
    : [];

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
      />

      {isTyping && filteredItems.length > 0 && (
        <ul className="absolute z-10 bg-white border border-stroke rounded mt-1 w-full shadow">
          {filteredItems.map((item, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(item)}
              className="px-3 py-2 hover:bg-primary hover:text-white text-sm cursor-pointer"
            >
              {displayProperty(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterList;
