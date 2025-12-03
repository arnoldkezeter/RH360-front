import React, { useState, useEffect, useCallback } from "react";

interface FilterListProps<T> {
  items?: T[];
  placeholder?: string;
  displayProperty: (item: T) => string;
  onSelect?: (item: T | string) => void;
  defaultValue?: T | string;
  // Nouvelles props pour la recherche backend
  onSearch?: (searchTerm: string) => Promise<T[]>;
  searchDelay?: number;
  minSearchLength?: number;
  enableBackendSearch?: boolean;
  loadingMessage?: string;
  noResultsMessage?: string;
  disable?:boolean;
}

function FilterList<T>({
  items=[],
  placeholder = "Rechercher...",
  displayProperty,
  onSelect,
  defaultValue,
  onSearch,
  searchDelay = 300,
  minSearchLength = 2,
  enableBackendSearch = false,
  loadingMessage = "Recherche en cours...",
  noResultsMessage = "Aucun résultat trouvé",
  disable=false,
}: FilterListProps<T>) {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [backendResults, setBackendResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeoutId, setSearchTimeoutId] = useState<NodeJS.Timeout | null>(null);

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

  // Fonction de recherche backend avec debounce
  const performBackendSearch = useCallback(async (searchTerm: string) => {
    if (!onSearch || !enableBackendSearch) return;
    
    if (searchTerm.length < minSearchLength) {
      setBackendResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await onSearch(searchTerm);
      setBackendResults(results || []);
    } catch (error) {
      console.error('Erreur lors de la recherche backend:', error);
      setBackendResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [onSearch, enableBackendSearch, minSearchLength]);

  // Debounce pour la recherche backend
  useEffect(() => {
    if (searchTimeoutId) {
      clearTimeout(searchTimeoutId);
    }

    if (enableBackendSearch && query.trim()) {
      const timeoutId = setTimeout(() => {
        performBackendSearch(query.trim());
      }, searchDelay);
      
      setSearchTimeoutId(timeoutId);
    } else {
      setBackendResults([]);
    }

    return () => {
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId);
      }
    };
  }, [query, performBackendSearch, searchDelay, enableBackendSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
  };

  const handleSelect = (item: T) => {
    const value = displayProperty(item);
    setQuery(value);
    setIsTyping(false);
    setBackendResults([]);
    onSelect?.(item);
  };

  const handleBlur = () => {
    if (query.trim()) {
      // Chercher d'abord dans les items locaux
      const matchedItem = items.find(
        (item) => displayProperty(item).toLowerCase() === query.trim().toLowerCase()
      );
      
      // Puis dans les résultats backend
      const matchedBackendItem = backendResults.find(
        (item) => displayProperty(item).toLowerCase() === query.trim().toLowerCase()
      );
      
      if (!matchedItem && !matchedBackendItem) {
        onSelect?.(query.trim());
      }
    }
    setIsTyping(false);
    setBackendResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Chercher d'abord dans les items locaux
      const matchedItem = items.find(
        (item) => displayProperty(item).toLowerCase() === query.trim().toLowerCase()
      );
      
      // Puis dans les résultats backend
      const matchedBackendItem = backendResults.find(
        (item) => displayProperty(item).toLowerCase() === query.trim().toLowerCase()
      );
      
      if (matchedItem) {
        handleSelect(matchedItem);
      } else if (matchedBackendItem) {
        handleSelect(matchedBackendItem);
      } else {
        onSelect?.(query.trim());
        setIsTyping(false);
        setBackendResults([]);
      }
    }
  };

  // Filtrer les items locaux
  const filteredLocalItems = query.trim()
    ? items.filter((item) =>
        displayProperty(item).toLowerCase().includes(query.trim().toLowerCase())
      )
    : [];

  // Combiner les résultats locaux et backend (éviter les doublons)
  const allResults = [...filteredLocalItems];
  
  if (enableBackendSearch && backendResults.length > 0) {
    backendResults.forEach(backendItem => {
      const isDuplicate = filteredLocalItems.some(localItem => 
        displayProperty(localItem).toLowerCase() === displayProperty(backendItem).toLowerCase()
      );
      if (!isDuplicate) {
        allResults.push(backendItem);
      }
    });
  }

  const shouldShowDropdown = isTyping && (
    allResults.length > 0 || 
    isLoading || 
    (enableBackendSearch && query.length >= minSearchLength && !isLoading && allResults.length === 0)
  );

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disable}
        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
      />

      {shouldShowDropdown && (
        <ul className="absolute z-10 bg-white border border-stroke rounded mt-1 w-full shadow max-h-60 overflow-y-auto">
          {isLoading && (
            <li className="px-3 py-2 text-sm text-gray-500 italic">
              {loadingMessage}
            </li>
          )}
          
          {!isLoading && allResults.length > 0 && allResults.map((item, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(item)}
              className="px-3 py-2 hover:bg-primary hover:text-white text-sm cursor-pointer"
            >
              {displayProperty(item)}
            </li>
          ))}
          
          {!isLoading && 
           enableBackendSearch && 
           query.length >= minSearchLength && 
           allResults.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-500 italic">
              {noResultsMessage}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default FilterList;