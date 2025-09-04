// components/ui/tabs.tsx
import React, { useState, ReactNode } from 'react';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextProps | undefined>(undefined);

export function Tabs({ defaultValue, value, onValueChange, children }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue || '');
  
  // Utiliser l'état contrôlé si fourni, sinon l'état interne
  const activeTab = value !== undefined ? value : internalActiveTab;
  
  const setActiveTab = (newValue: string) => {
    if (value !== undefined && onValueChange) {
      // Mode contrôlé : utiliser la fonction de callback
      onValueChange(newValue);
    } else {
      // Mode non contrôlé : utiliser l'état interne
      setInternalActiveTab(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: ReactNode }) {
  return <div className="flex space-x-4 border-b mb-4">{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { activeTab, setActiveTab } = context;

  const isActive = activeTab === value;

  return (
    <button
      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
        isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
}

export function TabsContent({ value, children }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { activeTab } = context;
  return activeTab === value ? <div>{children}</div> : null;
}