import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface CustomDropDownProps<T> {
    title: string;
    items: T[];
    defaultValue?: T | null;
    length?:string;
    selectedItem?: T;
    textColor?: string;
    placeholder?:string;
    searchItem?:boolean;
    onSelect: (selected: T | undefined) => void;
    displayProperty?: (item: T) => string;
}

function CustomDropDown2<T>({
    title,
    items,
    defaultValue,
    textColor,
    length = "200",
    selectedItem,
    searchItem = true,
    placeholder,
    onSelect,
    displayProperty = (item: T) => String(item),
}: CustomDropDownProps<T>): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    // Sync searchText quand selectedItem change (externe)
    useEffect(() => {
        if (selectedItem) {
            setSearchText(displayProperty(selectedItem));
        } else {
            setSearchText("");
        }
    }, [selectedItem, displayProperty]);

    const filteredItems = items.filter((item) =>
        displayProperty(item).toLowerCase().includes(searchText.toLowerCase())
    );

    const openDropdown = () => {
        setSearchText("");
        setIsOpen(true);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (item: T) => {
        onSelect(item);
        setIsOpen(false);
        setSearchText(displayProperty(item));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        // Désélectionner si l'utilisateur modifie la saisie
        if (selectedItem) {
            onSelect(undefined);
        }
        setIsOpen(true);
    };

    return (
        <div ref={dropdownRef} className={`relative w-full `}>
            <label className="block text-sm lg:text-md mb-1 text-gray-700 dark:text-gray-300">
                {title}
            </label>
            <div
                className={`${
                isOpen ? "cursor-text" : "cursor-pointer"
                } bg-white border border-stroke dark:border-gray-700 
                    dark:bg-gray-800 rounded-md px-4 py-3 text-sm lg:text-md 
                    flex justify-between items-center dark:text-white 
                    `}
                onClick={openDropdown}
            >

                <input
                    type="text"
                    placeholder={placeholder?placeholder:t('select_par_defaut.selectionnez') + " " + t('select_par_defaut.option')}
                    value={searchText}
                    onChange={searchItem?handleInputChange:()=>{}}
                    className="bg-transparent outline-none w-full text-gray-900 dark:text-white cursor-text"
                    onFocus={() => setIsOpen(true)}
                />
                <svg
                    className={`w-4 h-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
            {isOpen && (
                <ul
                    className="absolute z-50 top-full left-0 w-full max-h-48 overflow-auto border border-stroke
                    dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md mt-1 shadow-lg "
                >
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                           <li
                                key={index}
                                onClick={() => handleSelect(item)}
                                className="px-4 py-2 text-sm lg:text-md cursor-pointer whitespace-normal break-words
                                            hover:bg-primary dark:hover:bg-blue-800 hover:text-white dark:hover:text-blue-300
                                            transition duration-200 ease-in-out"
                                >
                                {displayProperty(item)}
                            </li>

                        ))
                    ) : (
                        <li className="px-4 py-1 text-sm text-gray-500 dark:text-gray-400">
                            {t('recherche.pas_de_resultats')}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}

export default CustomDropDown2;
