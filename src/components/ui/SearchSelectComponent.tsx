import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchSelectComponentProps<T> {
  // Pour les données statiques (optionnel)
  data?: T[];
  // Pour les données dynamiques via API
  onSearch?: (searchTerm: string) => Promise<T[]>;
  // Délai avant déclenchement de la recherche (en ms)
  searchDelay?: number;
  // Nombre minimum de caractères avant recherche
  minSearchLength?: number;
  
  selectedItems?: T[];
  onSelectionChange: (items: T[]) => void;
  placeholder?: string;
  displayField: keyof T;
  searchFields?: (keyof T)[];
  className?: string;
  textDebutCaractere?:string;
  textFinCaractere?:string;

  // Messages personnalisables
  noResultsMessage?: string;
  loadingMessage?: string;
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
  loadingMessage = "Recherche en cours..."
}: SearchSelectComponentProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Filtrer les données statiques si pas d'API
  const filteredStaticData = useMemo(() => {
    if (onSearch || !searchTerm.trim()) return [];
    
    return data.filter((item: T) => {
      // Vérifier si l'élément n'est pas déjà sélectionné
      const isAlreadySelected = selectedItems.some((selected: T) => 
        JSON.stringify(selected) === JSON.stringify(item)
      );
      
      if (isAlreadySelected) return false;
      
      // Rechercher dans les champs spécifiés
      return searchFields.some((field: keyof T) => {
        const value = item[field];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [searchTerm, selectedItems, data, searchFields, onSearch]);

  // Effectuer la recherche API
  const performSearch = async (term: string) => {
    if (!onSearch || term.length < minSearchLength) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await onSearch(term);
      // Filtrer les éléments déjà sélectionnés
      const filteredResults = results.filter((item: T) => 
        !selectedItems.some((selected: T) => 
          JSON.stringify(selected) === JSON.stringify(item)
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

  // Gérer le délai de recherche (debounce)
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

  // Déterminer les éléments à afficher
  const displayItems = onSearch ? searchResults : filteredStaticData;

  // Ajouter un élément à la liste sélectionnée
  const addItem = (item: T): void => {
    const newSelection = [...selectedItems, item];
    onSelectionChange(newSelection);
    setSearchTerm('');
    setShowResults(false);
    setSearchResults([]);
  };

  // Supprimer un élément de la liste sélectionnée
  const removeItem = (itemToRemove: T): void => {
    const newSelection = selectedItems.filter((item: T) => 
      JSON.stringify(item) !== JSON.stringify(itemToRemove)
    );
    onSelectionChange(newSelection);
  };

  // Gérer le changement de la recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.trim().length > 0);
  };

  // Gérer le focus sur l'input
  const handleInputFocus = (): void => {
    if (searchTerm.trim().length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Éléments sélectionnés sous forme de cercles */}
      {selectedItems.length > 0 && (
        <div className="mb-4">
          {/* <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg max-h-24 overflow-y-auto"> */}
            {selectedItems.map((item: T, index: number) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
              >
                <span className="mr-2">{String(item[displayField])}</span>
                <button
                  onClick={() => removeItem(item)}
                  className="text-blue-600 hover:text-red-600 hover:bg-white rounded-full p-0.5 transition-colors"
                  title="Supprimer cet élément"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          {/* </div> */}
        </div>
      )}
      
      {/* Barre de recherche */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="w-full bg-gray pl-10 pr-4 py-3 border border-stroke rounded-lg  text-black focus:border-primary focus-visible:outline-none  transition-colors"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
          )}
        </div>
        
        {/* Résultats de recherche */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stroke hover:bg-primary hover:text-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-gray-500 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                {loadingMessage}
              </div>
            ) : displayItems.length > 0 ? (
              displayItems.map((item: T, index: number) => (
                <div
                  key={index}
                  onClick={() => addItem(item)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{String(item[displayField])}</span>
                    {'category' in item && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {String(item.category)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : searchTerm.trim().length >= minSearchLength ? (
              <div className="p-4 text-gray-500 text-center">
                {noResultsMessage}
              </div>
            ) : onSearch && searchTerm.trim().length > 0 && searchTerm.trim().length < minSearchLength ? (
              <div className="p-4 text-gray-500 text-center">
                {`${textDebutCaractere} ${minSearchLength} ${textFinCaractere} `}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

