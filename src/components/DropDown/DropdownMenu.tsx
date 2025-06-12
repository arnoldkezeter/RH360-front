interface DropdownMenuProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, children, className }) => {
  return (
    <>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
        {label}
      </button>
      <div className={`mt-2 py-1 bg-white border rounded-md shadow-md ${className || ''}`}>
        {children}
      </div>
    </>
  );
};

export default DropdownMenu;
