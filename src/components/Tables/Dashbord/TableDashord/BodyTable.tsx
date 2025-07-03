import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../../_redux/features/setting"
import { RootState } from "../../../../_redux/store";
import { calculerEcartDepenseTTC, calculerMontantTTC, formatDateWithLang, getTaxeNamesString } from "../../../../fonctions/fonction";
import { setBudgetFormationSelected } from "../../../../_redux/features/elaborations/budgetFormationSlice";
import { useTranslation } from "react-i18next";

const BodyTable = ({ data }: { data?: any[]}) => {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {t} = useTranslation()
    return <tbody>
        {data?.map((item, index) => (
            
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* titre */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{lang=='fr'?item.titreFr:item.titreEn}</h5>
                </td>

                {/**periode */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{`${formatDateWithLang(item.dateDebut, lang)} ${t('label.au')} ${formatDateWithLang(item.dateFin, lang)}`}</h5>
                </td>

                {/*nombre thème*/}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{item.nbTheme}</h5>
                </td>

                {/*nombre formateur*/}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.nbFormateurs}</h5>
                </td>

                {/* nombre participant */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{item.nbParticipants}</h5>
                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTable