
interface CustomDropDownProps<T> {
    title: string;
    items: T[];
    defaultValue?: T | null;
    selectedItem?: T;
    onSelect: (selected: T | undefined) => void;
    displayProperty?: (item: T) => string;
}

function CustomDropDown2<T>({ title, items, defaultValue, selectedItem, onSelect, displayProperty = (item: T) => String(item) }: CustomDropDownProps<T>): JSX.Element {
    // const [selectedItem, setSelectedItem] = useState<T | null>(defaultValue || null);



    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;

        // Recherche de l'élément sélectionné dans la liste items
        const selected = items.find(item => displayProperty(item) === selectedValue);
        // console.log(items.find(item => displayProperty(item) === selectedValue));

        // setSelectedItem(selected);
        onSelect(selected);
    };

    return (
        <div className="custom-dropdown">
            <label className="text-sm lg:text-md" htmlFor={title}>{title}</label>
            <select

                id={title}
                value={selectedItem ? displayProperty(selectedItem) : ""}
                onChange={handleSelectChange}
                className="w-full  text-sm lg:text-md
                mt-1 rounded border border-stroke bg-gray py-1 lg:py-3 pl-4 pr-4.5 text-black
                 focus:border-primary focus-visible:outline-none dark:border-strokedark 
                 dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                {defaultValue === undefined && <option value=""></option>}
                {items.map((item, index) => (
                    <option className="" key={index} value={displayProperty(item)}>{displayProperty(item)}</option>
                ))}
            </select>
        </div>
    );
}

export default CustomDropDown2;