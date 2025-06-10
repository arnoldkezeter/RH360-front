import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalDelete, setShowModalDetails } from "../../../_redux/features/setting"
import { SelectButton } from "../common/composants/SelectButton"
import { useTranslation } from "react-i18next"
import { RootState } from "../../../_redux/store"
import { apiDownloadSupportDeCours } from "../../../api/api_support_cours"
import { formatDate } from "../../../fonctions/fonction"

const BodyTable = ({ data, onEdit}: { data:SupportDeCoursType[], onEdit: (etudiant: SupportDeCoursType) => void}) => {

    const dispatch = useDispatch();
    const {t}=useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageSupportPermission = userPermissions.includes('gerer_supports_cours_formateurs') || userPermissions.includes('gerer_supports_cours_etudiants');
    const handleDownload = (supportDeCours: SupportDeCoursType) => {
        console.log("download")
        if(supportDeCours._id){
            apiDownloadSupportDeCours(supportDeCours._id, supportDeCours.fichier)
        }
    };
    
    return <tbody>
        {data && data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* titre */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark ">
                    <h5>{lang==='fr'?item.titre_fr:item.titre_en}</h5>
                </td>

                {/* type */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.type==0?t('label.enseignant'):t('label.etudiant')}</h5>
                </td>

                 {/* publié par */}
                 <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark ">
                    <h5>{item.utilisateur.nom+" "+item.utilisateur?.prenom||""}</h5>
                </td>

                {/* date ajout */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{formatDate(item.dateAjout)}</h5>
                </td>
                

                {/* Action  bouton pour edit*/}
                {hasManageSupportPermission ?<td className="border-b border-[#eee] py-1 px-0 dark:border-strokedark flex justify-center items-center">
                    <SelectButton
                        listPage={[
                            {
                                "name": t('label.telecharger'),
                                "handleClick": () => {handleDownload(item)}
                            },
                            {
                                "name": t('label.details'),
                                "handleClick": () => {onEdit(item);dispatch(setShowModalDetails()) }
                            },
                        ]}
                    />
                    <ButtonCrudTable
                        onClickEdit={() => {
                            onEdit(item);
                            dispatch(setShowModal());
                            
                            // console.log("id : "+etudiant.id)
                        }}
                        onClickDelete={() => {
                            onEdit(item);
                            dispatch(setShowModalDelete())
                        }}
                        
                        
                    />
                </td>:
                <td className="border-b border-[#eee] py-1 px-0 dark:border-strokedark flex justify-center items-center">
                    
                    <ButtonCrudTable
                        onClickDownload={() => {
                            handleDownload(item)
                        }}
                        onClickDetails={() => {
                            onEdit(item);
                            dispatch(setShowModalDetails())
                        }}
                    />
                </td>}
            </tr>
        ))}
    </tbody>
}

export default BodyTable