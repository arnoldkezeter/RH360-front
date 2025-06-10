import { useDispatch, useSelector } from "react-redux"
import { formatDateWithLang } from "../../../fonctions/fonction";
import { RootState } from "../../../_redux/store";


const BodyTable = ({ data }: { data: AbsenceType[]|undefined }) => {

    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    function calculerDifferenceHeures(heureDebut:string, heureFin:string) {
        // Extraire les heures et les minutes de début et de fin
        const debutHeureMinute = heureDebut.split(':');
        const finHeureMinute = heureFin.split(':');
    
        // Convertir les heures et les minutes en nombres
        const debutHeure = parseInt(debutHeureMinute[0]);
        const debutMinute = parseInt(debutHeureMinute[1]);
    
        const finHeure = parseInt(finHeureMinute[0]);
        const finMinute = parseInt(finHeureMinute[1]);
    
        // Calculer la différence en heures
        const differenceHeures = finHeure - debutHeure + (finMinute - debutMinute) / 60;
        let formatHour;
        if (Number.isInteger(differenceHeures)) {
            formatHour = differenceHeures.toString();
        } else {
            formatHour = differenceHeures.toFixed(2);
        }
        return formatHour.toString();
    }
    return <tbody>
        {data && data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* date */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark ">
                    <h5>{formatDateWithLang(item.dateAbsence.toString(), lang)}</h5>
                </td>

                {/* période */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.heureDebut} - {item.heureFin}</h5>
                </td>


                {/* total */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark ">
                    <h5>{calculerDifferenceHeures(item.heureDebut, item.heureFin)}</h5>
                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTable