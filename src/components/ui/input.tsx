import React, { ReactNode, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for visibility

interface InputProps {
  value: string | null;
  setValue: (value: string) => void;
  type?: string;
  showIcon?: boolean;
  icon?: ReactNode;
  placeholder?: string;
  hasBackground?: boolean; // Nouvelle prop pour gérer l'arrière-plan
}

const Input: React.FC<InputProps> = ({
  value,
  setValue,
  type = 'text',
  showIcon = false,
  icon,
  placeholder = '',
  hasBackground = false, // Définition de la prop par défaut
}) => {
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : type}
        placeholder={placeholder}
        className={`w-full rounded border border-stroke bg-gray  text-black  focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary
         py-2 pl-4 pr-10 outline-none focus:border-primary focus-visible:shadow-none 
        ${hasBackground ? 'bg-gray dark:bg-meta-4 text-black dark:text-white' : 'bg-transparent dark:bg-form-input dark:border-form-strokedark'}`}
        value={value && value}
        onChange={(e) => setValue(e.target.value)}
      />
      {type === "password" && (
        <span
          className="absolute right-4 top-2 cursor-pointer text-md lg:text-[18px]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}

      {(showIcon && type !== "password") && (
        <span
          className="absolute right-4 top-2 cursor-pointer text-md lg:text-[18px]"
        >
          {icon}
        </span>
      )}
    </div>
  );
};

export default Input;
