import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";

interface SelectProps {
    list: any[];
    optionText: string;
    handleGradeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value: any;

}

const Select: React.FC<SelectProps> = ({
    value, list, optionText, handleGradeChange
}) => {

    const lang = useSelector((state: RootState) => state.setting.language);
    return (
        <select
            value={value}
            onChange={handleGradeChange}
            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
        >
            <option value="">{optionText}</option>
            {list.map(value => (
                <option key={value._id} value={(lang === 'fr' ? value.libelleFr : value.libelleEn)}>{(lang === 'fr' ? value.libelleFr : value.libelleEn)}</option>

            ))}
        </select>
    );
};

export default Select;
