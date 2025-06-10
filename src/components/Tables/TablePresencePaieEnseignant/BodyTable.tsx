import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../_redux/store";
import { calculGrossBonus, calculIRNC, calculNetBonus } from "../../../fonctions/fonction";


const BodyTable = ({ data }: { data: PresencePaieType[]}) => {

    const dispatch = useDispatch();
    const tauxHoraire:number=useSelector((state: RootState) => state.dataSetting.dataSetting.tauxHoraire) ?? 0; 


    return <tbody >
        {data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* matricule */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.enseignant?.matricule || ""}</h5>
                </td>

                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.enseignant?.nom || ""}</h5>
                </td>

                {/* prenom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{item.enseignant?.prenom || ""}</h5>
                </td>

                {/* gratification/heure */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black ">
                    {tauxHoraire}
                </td>

                {/* heure dispensé */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{item?.totalHoraire || 0}</h5>
                </td>

                {/* montant brut */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{calculGrossBonus(item?.totalHoraire || 0, tauxHoraire)}</h5>
                </td>

                {/*irnc */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{calculIRNC(calculGrossBonus(item?.totalHoraire || 0, tauxHoraire))}</h5>
                </td>

                {/*montant net */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{calculNetBonus(calculGrossBonus(item?.totalHoraire || 0, tauxHoraire), calculIRNC(calculGrossBonus(item?.totalHoraire || 0, tauxHoraire)))}</h5>
                </td>

               
            </tr>
        ))}
    </tbody>
}

export default BodyTable