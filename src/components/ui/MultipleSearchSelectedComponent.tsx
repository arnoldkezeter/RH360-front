import React, { useState, useEffect, useMemo } from 'react';
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
  
  // ✅ NOUVEAU: État pour les éléments temporairement sélectionnés
  const [tempSelectedItems, setTempSelectedItems] = useState<T[]>([]);

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

  const displayItems = onSearch ? searchResults : filteredStaticData;

  // ✅ NOUVEAU: Toggle d'un élément dans la sélection temporaire
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

  // ✅ NOUVEAU: Vérifier si un élément est dans la sélection temporaire
  const isTempSelected = (item: T): boolean => {
    return tempSelectedItems.some(
      (selected: T) => JSON.stringify(selected) === JSON.stringify(item)
    );
  };

  // ✅ NOUVEAU: Valider la sélection multiple
  const confirmSelection = (): void => {
    if (tempSelectedItems.length === 0) return;
    
    const newSelection = [...selectedItems, ...tempSelectedItems];
    onSelectionChange(newSelection);
    setTempSelectedItems([]);
    setSearchTerm('');
    setShowResults(false);
    setSearchResults([]);
  };

  // ✅ NOUVEAU: Annuler la sélection temporaire
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
    <div className={`w-full ${className}`}>
      {selectedItems.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-stroke rounded-lg max-h-24 overflow-y-auto">
            {selectedItems.map((item: T, index: number) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
              >
                <span className="mr-2">
                  {renderItem ? renderItem(item) : String(item[displayField])}
                </span>
                <button
                  onClick={() => removeItem(item)}
                  className="text-blue-600 hover:text-red-600 hover:bg-white rounded-full p-0.5 transition-colors"
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="w-full bg-gray pl-10 pr-4 py-3 border border-stroke rounded-lg text-black focus:border-primary focus-visible:outline-none transition-colors"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
          )}
        </div>

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stroke rounded-lg shadow-lg z-10 max-h-80 overflow-hidden flex flex-col">
            {/* ✅ Header avec compteur */}
            {tempSelectedItems.length > 0 && (
              <div className="bg-blue-50 px-4 py-2 border-b border-blue-200 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">
                  {tempSelectedItems.length} élément{tempSelectedItems.length > 1 ? 's' : ''} sélectionné{tempSelectedItems.length > 1 ? 's' : ''}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={cancelSelection}
                    className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmSelection}
                    className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Ajouter
                  </button>
                </div>
              </div>
            )}

            {/* ✅ Liste des résultats avec checkboxes */}
            <div className="overflow-y-auto max-h-60">
              {isLoading ? (
                <div className="p-4 text-gray-500 text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                  {loadingMessage}
                </div>
              ) : displayItems.length > 0 ? (
                displayItems.map((item: T, index: number) => {
                  const isChecked = isTempSelected(item);
                  return (
                    <div
                      key={index}
                      onClick={() => toggleTempItem(item)}
                      className={`px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors flex items-center gap-3 ${
                        isChecked ? 'bg-blue-50' : ''
                      }`}
                    >
                      {/* ✅ Checkbox custom */}
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isChecked 
                          ? 'bg-primary border-primary' 
                          : 'border-gray-300 hover:border-primary'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>

                      {/* ✅ Contenu de l'item */}
                      <div className="flex-1">
                        {renderItem ? renderItem(item) : (
                          <div className="flex justify-between items-center">
                            <span className={`font-medium ${isChecked ? 'text-primary' : 'text-gray-800'}`}>
                              {String(item[displayField])}
                            </span>
                            {'category' in item && (
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
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
                <div className="p-4 text-gray-500 text-center">{noResultsMessage}</div>
              ) : onSearch && searchTerm.trim().length > 0 && searchTerm.trim().length < minSearchLength ? (
                <div className="p-4 text-gray-500 text-center">
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