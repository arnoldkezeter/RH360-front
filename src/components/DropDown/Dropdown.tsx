import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  defaultText: string;
  textColor?: string;
  children: React.ReactNode;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  defaultText, 
  textColor = 'text-gray-700', 
  children,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className={`relative ${className}`}>
      {/* Bouton principal responsive */}
      <button
        onClick={toggleDropdown}
        className={`
          flex items-center justify-between 
          px-3 py-2 sm:px-4 sm:py-2 
          bg-white border border-stroke rounded-lg shadow-sm 
          ${textColor}
          hover:bg-gray-50 hover:border-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          text-sm sm:text-base
          min-w-0 w-full sm:w-auto
          transition-colors duration-200
        `}
      >
        <span className="truncate">{defaultText}</span>
        <ChevronDown 
          className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          size={16} 
        />
      </button>

      {/* Menu déroulant responsive */}
      {isOpen && (
        <>
          {/* Overlay pour fermer le dropdown en cliquant à l'extérieur */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <ul className="
            absolute z-20 mt-2 
            w-full sm:w-48 min-w-max
            bg-white border border-gray-200 rounded-lg shadow-lg
            max-h-60 overflow-y-auto
          ">
            {children}
          </ul>
        </>
      )}
    </div>
  );
};

export default Dropdown;