import React, { createContext, useContext, useState } from 'react';

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

  const setHeaderConfig = (newConfig: Partial<HeaderConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

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