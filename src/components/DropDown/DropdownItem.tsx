// DropdownItem.tsx
import React from 'react';

interface DropdownItemProps {
  children: React.ReactNode;
  onClick: () => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className="
          block w-full text-left 
          px-3 py-2 sm:px-4 sm:py-2
          text-sm sm:text-base
          text-gray-700
          hover:bg-gray-100 hover:text-gray-900
          focus:outline-none focus:bg-gray-100 focus:text-gray-900
          transition-colors duration-150
          first:rounded-t-lg last:rounded-b-lg
        "
      >
        {children}
      </button>
    </li>
  );
};

export default DropdownItem;