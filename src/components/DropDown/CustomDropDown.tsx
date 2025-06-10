import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FaAngleDown } from "react-icons/fa6";

interface CustomDropDownProps<T> {
    items: T[];
    title: string;
    defaultValue: T;
    initialSelection?: T;
    onSelect: (selectedItem: T) => void;
    alignTop?: boolean;
    paddingY?: string;
    displayProperty?: (item: T) => string;
}



export function CustomDropDown<T>({
    items,
    title,
    defaultValue,
    initialSelection,
    onSelect,
    alignTop = true,
    paddingY = 'py-0.5 lg:py-2',
    displayProperty = (item: T) => String(item)
}: CustomDropDownProps<T>) {
    const [selected, setSelected] = useState<T>(initialSelection || defaultValue);
    const [updatedItems, setUpdatedItems] = useState<T[]>(items);

    useEffect(() => {
        // Si initialSelection est présent dans les items et n'est pas déjà au début
        if (initialSelection && items.includes(initialSelection) && items.indexOf(initialSelection) !== 0) {
            const updatedItemsArray = [...items];
            const index = updatedItemsArray.indexOf(initialSelection);

            if (index !== -1) {
                updatedItemsArray.splice(index, 1);// Retirez l'élément de sa position actuelle
                updatedItemsArray.splice(index, 0, initialSelection); // Insérez-le à la nouvelle position
            }
            setSelected(initialSelection);
            setUpdatedItems(updatedItemsArray);
        }
    }, []);


    const handleSelected = (item: T) => {
        setSelected(item);
        onSelect(item);
    };

    return (
        <div className={` lg:relative flex items-center gap-x-2  `}>
            {title &&
                <label className="mb-0 block text-[12px] lg:text-sm font-medium text-body dark:text-white" htmlFor="">
                    {title}
                </label>
            }
            <div className=" mt-0 ">
                <Listbox value={selected} onChange={setSelected}>
                    <Listbox.Button className={`
                        w-full cursor-pointer text-left focus:outline-none focus-visible:border-indigo-500 
                        focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 
                        mt-3 rounded border border-stroke text-black focus:border-primary focus-visible:outline-none 
                        dark:border-form-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary flex justify-between items-center 
                        pl-2 lg:pl-6 gap-x-1 lg:gap-x-3 bg-white ${paddingY} px-2 lg:px-4.5 
                    `}>
                        <span className="block truncate text-[11px] lg:text-sm">{alignTop && displayProperty(selected)}</span>
                        <span className={`pointer-events-none inset-y-0 flex items-center text-graydark text-[12px] lg:text-sm ${!alignTop && 'pl-8 pr-1'} `}>
                            <FaAngleDown />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className={`
                            ${!alignTop ? 'lg:-top-[110px]' : ''} 
                            absolute max-h-60 w-[120px] lg:w-[200px] overflow-auto rounded-md bg-white dark:bg-black dark:shadow-black py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm
                        `}>
                            {updatedItems.map((item, index) => (
                                <Listbox.Option
                                    onClick={() => handleSelected(item)}
                                    key={index}
                                    className={({ active }) => `
                                        relative cursor-pointer dark:hover:bg-graydark hover:bg-gray select-none py-1 lg:py-2 pl-8 lg:pl-10 pr-3 lg:pr-4 ${active ? 'bg-amber-100 text-amber-900 ' : 'text-gray-900'}
                                    `}
                                    value={item}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className={`block truncate text-[11px] lg:text-sm ${selected && alignTop ? 'font-bold' : 'font-normal'}`}>
                                                {displayProperty(item)}
                                            </span>
                                            {(selected && alignTop) && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                    ✓
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </Listbox>
            </div>
        </div>
    );
}
