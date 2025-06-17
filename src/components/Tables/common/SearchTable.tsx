import { useState } from "react";

interface SearchProps {
    hintText: string;
    value?:string;
    onSubmit: (text: string) => void;

}

const InputSearch = ({ hintText, value, onSubmit }: SearchProps) => {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const text = event.target.value;
        setInputValue(text);
        onSubmit(text);
        // Appeler onSubmit à chaque changement de valeur dans l'input
        
    };

    return (
        <div className="w-full">
            <div className="flex items-center border border-stroke rounded bg-gray-2 h-[38px] lg:h-[45px] px-3 lg:px-6">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
                </svg>
                <input
                className="w-full text-[12px] lg:text-[14px] h-[42.5px] bg-transparent text-black focus:outline-none dark:text-white"
                type="text"
                placeholder={hintText}
                value={value === '' ? value : inputValue}
                onChange={handleChange}
                />
            </div>
            </div>

    );
};

export default InputSearch;
