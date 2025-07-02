import { useState, useRef, useEffect, ReactNode } from 'react';

interface SelectProps {
  children: ReactNode;
  onValueChange?: (value: string) => void;
}

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export const Select = ({ children, onValueChange }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    onValueChange?.(value);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="w-full px-4 py-2 border border-gray-300 rounded-md text-left bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected || 'Sélectionner'}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow">
          {Array.isArray(children)
            ? children.map((child: any) =>
                child.type.displayName === 'SelectItem'
                  ? {
                      ...child,
                      props: {
                        ...child.props,
                        onClick: () => handleSelect(child.props.value),
                      },
                    }
                  : null
              )
            : null}
        </div>
      )}
    </div>
  );
};

export const SelectTrigger = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const SelectValue = ({ children }: { children: ReactNode }) => {
  return <span>{children}</span>;
};

export const SelectContent = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export const SelectItem = ({ value, children, onClick }: any) => (
  <div
    onClick={onClick}
    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
  >
    {children}
  </div>
);
SelectItem.displayName = 'SelectItem';
