import { MoreVertical } from 'lucide-react';
import  { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiArrowDropDownLine } from 'react-icons/ri';


interface Page {
    name: string;
    handleClick: () => void;
}

interface SelectButtonProps {
    listPage: Page[];
}

export function SelectButton({ listPage }: SelectButtonProps) {
    const { t } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef<any>(null);

    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (trigger.current && !trigger.current.contains(target))
                setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, []);

    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (keyCode === 27)
                setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    }, []);

    return (
        <div
            ref={trigger}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`inline-block items-center gap-4`}
        >
            <button
                className={`px-3 py-2.5 text-center flex items-center justify-center hover:bg-body 
                hover:dark:bg-gray gap-0 text-body hover:text-white hover:dark:text-body dark:text-gray  
                ${dropdownOpen ? 'focus:bg-boxdark' : ''}`}
            >
                <div className={`text-3xl ${dropdownOpen ? 'text-white rotate-3' : ''}`}>
                   <MoreVertical />
                </div>
            </button>

            {dropdownOpen &&
                <div className="absolute right-0 mr-4.5 lg:mr-[45px] mt-0 flex flex-col rounded-sm border border-stroke bg-white dark:bg-boxdark shadow-default dark:border-strokedark ">
                    {listPage.map((page, index) => (
                        <button
                            key={index}
                            onClick={page.handleClick}
                            className="flex items-center gap-3.5 py-3 pt-3 px-5 text-sm font-medium duration-300
                            
                            ease-in-out lg:text-base hover:bg-gray dark:hover:bg-black"
                        >
                            <span className='w-[140px] lg:w-40 text-start text-sm lg:text-md'>{t(page.name)}</span>
                        </button>
                    ))}
                </div>
            }
        </div>
    );
}
