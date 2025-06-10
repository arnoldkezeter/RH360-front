import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setSelectedUserPermission, setSelectedUserRole, setShowModal, setShowModalDelete, setShowRoleModal } from "../../../_redux/features/setting"
import { SelectButton } from "../common/composants/SelectButton"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { config } from "../../../config"
import { RootState } from "../../../_redux/store"

const BodyTableEtudiant = ({ data, onEdit, onAddRole }: { data: EtudiantType[], onEdit: (etudiant: EtudiantType) => void, onAddRole: (etudiant: EtudiantType) => void }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t}=useTranslation();
    const dispatchRole = (etudiant: EtudiantType) => {
        if(etudiant.roles && etudiant.roles.some(et=> et.toString() === config.roles.delegue)){
            dispatch(setSelectedUserRole(config.roles.delegue));
            return;
        }
        dispatch(setSelectedUserRole(config.roles.etudiant))
    }
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageStudentPermission = userPermissions.includes('gerer_etudiants');
    return <tbody>
        {data && data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* matricule */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.matricule?item.matricule:""}</h5>
                </td>

                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.nom}</h5>
                </td>

                {/* prenom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{item.prenom?item.prenom:""}</h5>
                </td>

                {/* classes
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.classe}</h5>
                </td> */}

                {/* email */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5>{item.email}</h5>
                </td>

                {/* contact */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">                    
                    <h5>{item.contact?item.contact:""}</h5>
                </td>
                

                {/* Action  bouton pour edit*/}
                {hasManageStudentPermission && <td className="border-b border-[#eee] py-1 px-0 dark:border-strokedark flex justify-center items-center">
                    <SelectButton
                        listPage={[
                            {
                                "name": t('label.roles'),
                                "handleClick": () => { onAddRole(item) ; dispatch(setShowRoleModal());}
                            },
                            {
                                "name": t('label.permissions'),
                                "handleClick": () => {dispatchRole(item);dispatch(setSelectedUserPermission(item)); navigate('/user/permissions')}
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
                </td>}
            </tr>
        ))}
    </tbody>
}

export default BodyTableEtudiant