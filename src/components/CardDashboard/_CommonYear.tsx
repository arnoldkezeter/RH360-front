import { FaArrowUpLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { formatYear } from "../../fonctions/fonction";

interface CurrentYearDateProps {
    additionalStyle?: String
}

export function CurrentYearDate({ additionalStyle }: CurrentYearDateProps) {
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    return (

        <div className={`${additionalStyle} absolute bottom-0 right-0 mb-4 mr-2 z-10 text-meta-5 `}>
            {/* annee  */}
            <span className="flex items-center gap-1 text-[12px] font-medium">
                {formatYear(currentYear)}
                <div className="fill-meta-5 h-[10px] w-[10px]">
                    <FaArrowUpLong />
                </div>
            </span>
        </div>)
}

