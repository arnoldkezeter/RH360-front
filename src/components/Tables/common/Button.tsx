// Button.tsx
import { IoMdAdd } from "react-icons/io";

interface ButtonProps {
    onClick: () => void;
    title: string;
    className?: string;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  title, 
  className = '',
  variant = 'primary',
  size = 'md'
}) => {
  // Classes de base communes
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium text-center
    rounded transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Classes selon la variante
  const variantClasses = {
    primary: `
      bg-primary text-white 
      hover:bg-opacity-90 
      focus:ring-blue-500
    `,
    secondary: `
      bg-white text-gray-700 border border-gray-300
      hover:bg-gray-50 hover:border-gray-400
      focus:ring-blue-500
    `
  };

  // Classes selon la taille
  const sizeClasses = {
    sm: `
      w-8 h-8 lg:w-auto lg:h-auto
      text-xs lg:text-sm
      lg:px-3 lg:py-2
    `,
    md: `
      w-[30px] h-[35px] lg:w-auto lg:h-[41.5px]
      text-[11.5px] lg:text-sm
      lg:px-4 lg:py-3
    `,
    lg: `
      w-10 h-10 lg:w-auto lg:h-12
      text-sm lg:text-base
      lg:px-6 lg:py-4
    `
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Icône visible uniquement sur mobile/tablet */}
      <div className="lg:hidden text-[18px] md:text-[20px]">
        <IoMdAdd />
      </div>
      
      {/* Texte visible uniquement sur desktop */}
      <span className="hidden lg:block whitespace-nowrap">
        {title}
      </span>
    </button>
  );
};

export default Button;