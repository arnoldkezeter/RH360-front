import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Loader2, Check, Plus } from 'lucide-react';

interface SearchSelectComponentProps<T> {
  data?: T[];
  onSearch?: (searchTerm: string) => Promise<T[]>;
  searchDelay?: number;
  minSearchLength?: number;
  
  selectedItems?: T[];
  onSelectionChange: (items: T[]) => void;
  placeholder?: string;
  displayField: keyof T;
  searchFields?: (keyof T)[];
  className?: string;
  textDebutCaractere?: string;
  textFinCaractere?: string;

  noResultsMessage?: string;
  loadingMessage?: string;

  renderItem?: (item: T) => React.ReactNode;
}

export const SearchSelectComponent = <T extends Record<string, any>>({
  data = [],
  onSearch,
  searchDelay = 300,
  minSearchLength = 2,
  selectedItems = [],
  onSelectionChange,
  placeholder = "Rechercher un élément...",
  displayField,
  searchFields = [displayField],
  className = "",
  textDebutCaractere = "Tapez au moins",
  textFinCaractere = "caractères pour rechercher",
  noResultsMessage = "Aucun élément trouvé",
  loadingMessage = "Recherche en cours...",
  renderItem
}: SearchSelectComponentProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [tempSelectedItems, setTempSelectedItems] = useState<T[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filteredStaticData = useMemo(() => {
    if (onSearch || !searchTerm.trim()) return [];
    
    return data.filter((item: T) => {
      const isAlreadySelected = selectedItems.some(
        (selected: T) => JSON.stringify(selected) === JSON.stringify(item)
      );
      if (isAlreadySelected) return false;

      return searchFields.some((field: keyof T) => {
        const value = item[field];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [searchTerm, selectedItems, data, searchFields, onSearch]);

  const displayItems = onSearch ? searchResults : filteredStaticData;

  const performSearch = async (term: string) => {
    if (!onSearch || term.length < minSearchLength) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await onSearch(term);
      const filteredResults = results.filter((item: T) =>
        !selectedItems.some(
          (selected: T) => JSON.stringify(selected) === JSON.stringify(item)
        )
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchTerm.trim()) {
      const timeout = setTimeout(() => {
        performSearch(searchTerm);
      }, searchDelay);
      setSearchTimeout(timeout);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm, selectedItems]);

  // Gestion du clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Ajustement de la position de la liste déroulante
  useEffect(() => {
    if (showResults && resultsRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = resultsRef.current.scrollHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Si l'espace en bas est insuffisant, afficher au-dessus
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        resultsRef.current.style.bottom = '100%';
        resultsRef.current.style.top = 'auto';
        resultsRef.current.style.marginBottom = '8px';
        resultsRef.current.style.marginTop = '0';
      } else {
        resultsRef.current.style.top = '100%';
        resultsRef.current.style.bottom = 'auto';
        resultsRef.current.style.marginTop = '8px';
        resultsRef.current.style.marginBottom = '0';
      }
    }
  }, [showResults, displayItems.length]);

  const toggleTempItem = (item: T): void => {
    const isSelected = tempSelectedItems.some(
      (selected: T) => JSON.stringify(selected) === JSON.stringify(item)
    );

    if (isSelected) {
      setTempSelectedItems(tempSelectedItems.filter(
        (selected: T) => JSON.stringify(selected) !== JSON.stringify(item)
      ));
    } else {
      setTempSelectedItems([...tempSelectedItems, item]);
    }
  };

  const isTempSelected = (item: T): boolean => {
    return tempSelectedItems.some(
      (selected: T) => JSON.stringify(selected) === JSON.stringify(item)
    );
  };

  const confirmSelection = (): void => {
    if (tempSelectedItems.length === 0) return;
    
    const newSelection = [...selectedItems, ...tempSelectedItems];
    onSelectionChange(newSelection);
    setTempSelectedItems([]);
    setSearchTerm('');
    setShowResults(false);
    setSearchResults([]);
  };

  const cancelSelection = (): void => {
    setTempSelectedItems([]);
    setSearchTerm('');
    setShowResults(false);
    setSearchResults([]);
  };

  const removeItem = (itemToRemove: T): void => {
    const newSelection = selectedItems.filter(
      (item: T) => JSON.stringify(item) !== JSON.stringify(itemToRemove)
    );
    onSelectionChange(newSelection);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.trim().length > 0);
  };

  const handleInputFocus = (): void => {
    if (searchTerm.trim().length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div ref={containerRef} className={`w-full relative ${className}`}>
      {/* Section des éléments sélectionnés - Responsive */}
      {selectedItems.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-stroke rounded-lg max-h-32 sm:max-h-24 overflow-y-auto">
            {selectedItems.map((item: T, index: number) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
              >
                <span className="mr-1 sm:mr-2 truncate max-w-[120px] sm:max-w-[200px]">
                  {renderItem ? renderItem(item) : String(item[displayField])}
                </span>
                <button
                  onClick={() => removeItem(item)}
                  className="text-blue-600 hover:text-red-600 hover:bg-white rounded-full p-0.5 transition-colors flex-shrink-0"
                  title="Supprimer cet élément"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="w-full bg-gray pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 border border-stroke rounded-lg text-black focus:border-primary focus-visible:outline-none transition-colors text-sm sm:text-base"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          )}
        </div>

        {showResults && (
          <div 
            ref={resultsRef}
            className="absolute left-0 right-0 bg-white border border-stroke rounded-lg shadow-lg z-50 flex flex-col"
            style={{
              maxHeight: 'min(400px, calc(100vh - 100px))',
              overflow: 'hidden'
            }}
          >
            {/* Header avec compteur - Responsive */}
            {tempSelectedItems.length > 0 && (
              <div className="bg-blue-50 px-3 sm:px-4 py-2 border-b border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 flex-shrink-0">
                <span className="text-xs sm:text-sm font-medium text-blue-700">
                  {tempSelectedItems.length} élément{tempSelectedItems.length > 1 ? 's' : ''} sélectionné{tempSelectedItems.length > 1 ? 's' : ''}
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={cancelSelection}
                    className="flex-1 sm:flex-none text-xs text-gray-600 hover:text-gray-800 px-2 py-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmSelection}
                    className="flex-1 sm:flex-none text-xs bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Ajouter
                  </button>
                </div>
              </div>
            )}

            {/* Liste des résultats avec checkboxes - Responsive avec scroll infini */}
            <div 
              className="overflow-y-auto"
              style={{
                maxHeight: tempSelectedItems.length > 0 
                  ? 'calc(min(400px, calc(100vh - 100px)) - 52px)' 
                  : 'min(400px, calc(100vh - 100px))'
              }}
            >
              {isLoading ? (
                <div className="p-4 text-gray-500 text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                  <span className="text-sm sm:text-base">{loadingMessage}</span>
                </div>
              ) : displayItems.length > 0 ? (
                displayItems.map((item: T, index: number) => {
                  const isChecked = isTempSelected(item);
                  return (
                    <div
                      key={index}
                      onClick={() => toggleTempItem(item)}
                      className={`px-3 sm:px-4 py-2 sm:py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors flex items-center gap-2 sm:gap-3 ${
                        isChecked ? 'bg-blue-50' : ''
                      }`}
                    >
                      {/* Checkbox custom - Responsive */}
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isChecked 
                          ? 'bg-primary border-primary' 
                          : 'border-gray-300 hover:border-primary'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" strokeWidth={3} />}
                      </div>

                      {/* Contenu de l'item - Responsive */}
                      <div className="flex-1 min-w-0">
                        {renderItem ? renderItem(item) : (
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                            <span className={`font-medium text-sm sm:text-base truncate ${isChecked ? 'text-primary' : 'text-gray-800'}`}>
                              {String(item[displayField])}
                            </span>
                            {'category' in item && (
                              <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-0.5 sm:py-1 rounded whitespace-nowrap">
                                {String(item.category)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : searchTerm.trim().length >= minSearchLength ? (
                <div className="p-4 text-gray-500 text-center text-sm sm:text-base">
                  {noResultsMessage}
                </div>
              ) : onSearch && searchTerm.trim().length > 0 && searchTerm.trim().length < minSearchLength ? (
                <div className="p-4 text-gray-500 text-center text-sm sm:text-base">
                  {`${textDebutCaractere} ${minSearchLength} ${textFinCaractere}`}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};