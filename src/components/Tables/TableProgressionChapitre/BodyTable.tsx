import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { setShowModal } from "../../../_redux/features/setting";

const BodyTable = ({ data, onEdit}: { data: ChapitreType[], onEdit: (chapitre:ChapitreType) => void}) => {
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageProgressionPermission = userPermissions.includes('gerer_progression_cours_chapitre');

    const handleCheckboxChange = async (chapitreIndex: number) => {
        if(hasManageProgressionPermission){
            onEdit(data[chapitreIndex]);
            dispatch(setShowModal())
        }
    };
    

    return (
        <tbody>
            {data && data.map((chapitre: ChapitreType, indexChapitre: number) => (
                <tr key={indexChapitre} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                    {/* Chapitre de la matière */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                        <h5>{lang === 'fr' ? chapitre.libelleFr : chapitre.libelleEn }</h5>
                    </td>
                    {/* Case à cocher pour l'état de l'chapitre */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                        <input className={`${(!hasManageProgressionPermission) ? '' : 'cursor-pointer'}`} type="checkbox" checked={chapitre.etat === 1} onChange={() => handleCheckboxChange(indexChapitre)} />
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default BodyTable;


