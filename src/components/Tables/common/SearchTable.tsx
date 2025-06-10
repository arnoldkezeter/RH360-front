import { BsSearch } from "react-icons/bs";
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
        <div className="w-full ">
            <div className="flex items-center border border-stroke rounded bg-gray-2 h-[38px] lg:h-[45px]">
                <input
                    className="w-full text-[12px] lg:text-[14px] px-3 lg:px-6 h-[42.5px] rounded bg-transparent text-black focus:outline-none dark:text-white"
                    type="text"
                    placeholder={hintText}
                    value={(value === '')?value:inputValue}
                    onChange={handleChange}
                />

            </div>
        </div>
    );
};

export default InputSearch;
