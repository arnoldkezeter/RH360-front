import React, { useState } from 'react';
import Dropdown from './DropDown/Dropdown';
import DropdownItem from './DropDown/DropdownItem';
import { useHeader } from './Context/HeaderConfig';
import Button from './Tables/common/Button';
import { useTranslation } from 'react-i18next';
import CustomDropDown2 from './DropDown/CustomDropDown2';

const HeaderPage: React.FC = () => {
  const { t } = useTranslation();    
  const { config } = useHeader();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleAdd = () => {
    if (config.onAdd) {
      config.onAdd();
    } else {
      alert('Fonction d\'ajout non définie');
    }
  };

  const handleExport = (option: string | undefined) => {
    if(!option)return;
    if (config.onExport) {
      config.onExport(option);
    } else {
      alert(`Export ${option} - fonction non définie`);
    }
  };

  const handleImport = (option: string | undefined) => {
    if(!option) return
    if (config.onImport) {
      config.onImport(option);
    } else {
      alert(`Import ${option} - fonction non définie`);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Fonction pour vérifier s'il y a des actions à afficher
  const hasActions = config.showAddButton || 
                    (config.exportOptions && config.exportOptions.length > 0) || 
                    (config.importOptions && config.importOptions.length > 0);

  return (
    config.title && (
      <div className="bg-white">
        {/* Container principal avec padding responsive */}
        <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
          
          {/* Header pour desktop */}
          <div className="hidden md:flex justify-between items-center">
            

            {/* Actions Desktop */}
            {hasActions && (
              <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                {config.showAddButton && (
                  <Button
                    onClick={handleAdd}
                    title={config.title}
                    className="text-sm lg:text-base whitespace-nowrap"
                  />
                )}

                {config.exportOptions && config.exportOptions.length > 0 && (
                  // <Dropdown defaultText={t('actions.exporter') || 'Exporter'}>
                  //   {config.exportOptions.map((option) => (
                  //     <DropdownItem key={option} onClick={() => handleExport(option)}>
                  //       {option}
                  //     </DropdownItem>
                  //   ))}
                  // </Dropdown>
                   <CustomDropDown2<string>
                        title={""}
                        selectedItem={undefined}
                        items={config.exportOptions}
                        defaultValue={undefined}
                        displayProperty={(option: string) => option}
                        onSelect={handleExport}
                        placeholder={t('actions.exporter')}
                        searchItem={false}
                    />
                )}

                {config.importOptions && config.importOptions.length > 0 && (
                  // <Dropdown defaultText={t('actions.importer') || 'Importer'}>
                  //   {config.importOptions.map((option) => (
                  //     <DropdownItem key={option} onClick={() => handleImport(option)}>
                  //       {option}
                  //     </DropdownItem>
                  //   ))}
                  // </Dropdown>
                  <CustomDropDown2<string>
                        title={""}
                        selectedItem={undefined}
                        items={config.importOptions}
                        defaultValue={undefined}
                        displayProperty={(option: string) => option}
                        onSelect={handleImport}
                        placeholder={t('actions.importer')}
                        searchItem={false}
                    />
                )}
              </div>
            )}
          </div>

          {/* Header pour mobile et tablette */}
          <div className="md:hidden">
            {/* Ligne du haut : Titre + bouton menu */}
            <div className="flex justify-between items-center">
              
              {hasActions && (
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-label="Toggle actions menu"
                >
                  <svg 
                    className={`h-5 w-5 transform transition-transform duration-200 ${showMobileMenu ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Menu mobile déroulant */}
            {hasActions && (
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showMobileMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="pt-3 pb-1 space-y-2">
                  {config.showAddButton && (
                    <div className="w-full">
                      <Button
                        onClick={() => {
                          handleAdd();
                          setShowMobileMenu(false);
                        }}
                        title={config.title}
                        className="w-full text-sm justify-center"
                      />
                    </div>
                  )}

                  {config.exportOptions && config.exportOptions.length > 0 && (
                    <div className="w-full">
                      <Dropdown 
                        defaultText={t('actions.exporter') || 'Exporter'}
                        className="w-full"
                      >
                        {config.exportOptions.map((option) => (
                          <DropdownItem 
                            key={option} 
                            onClick={() => {
                              handleExport(option);
                              setShowMobileMenu(false);
                            }}
                          >
                            {option}
                          </DropdownItem>
                        ))}
                      </Dropdown>
                    </div>
                  )}

                  {config.importOptions && config.importOptions.length > 0 && (
                    <div className="w-full">
                      <Dropdown 
                        defaultText={t('actions.importer') || 'Importer'}
                        className="w-full"
                      >
                        {config.importOptions.map((option) => (
                          <DropdownItem 
                            key={option} 
                            onClick={() => {
                              handleImport(option);
                              setShowMobileMenu(false);
                            }}
                          >
                            {option}
                          </DropdownItem>
                        ))}
                      </Dropdown>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default HeaderPage;