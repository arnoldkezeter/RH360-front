import React, { createContext, useContext, useState, useCallback } from 'react';

interface HeaderConfig {
  title: string;
  showAddButton?: boolean;
  exportOptions?: string[];
  importOptions?: string[];
  onAdd?: () => void;
  onExport?: (option: string) => void;
  onImport?: (option: string) => void;
}

interface HeaderContextProps {
  config: HeaderConfig;
  setHeaderConfig: (config: Partial<HeaderConfig>) => void;
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<HeaderConfig>({
    title: '',
    showAddButton: false,
    exportOptions: [],
    importOptions: [],
  });

  // ✅ useCallback pour que setHeaderConfig ne change jamais de référence
  const setHeaderConfig = useCallback((newConfig: Partial<HeaderConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []); // dépendances vides : la fonction ne change jamais

  return (
    <HeaderContext.Provider value={{ config, setHeaderConfig }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};