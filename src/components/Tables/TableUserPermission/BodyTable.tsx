import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";
import { addUserPemission, removeUserPemission } from "../../../_redux/features/setting";
import createToast from "../../../hooks/toastify";
import { apiGrantedPermission } from "../../../api/api_permission";

const BodyTable = ({ data}: { data: PermissionType[]}) => {
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions); // fr ou en
    const selectedUserPermission = useSelector((state: RootState) => state.setting.selectedUserPermission);
    

    const handleCheckboxChange = async (permissionIndex: number, checked:boolean) => {
        if (selectedUserPermission) {
            if (data) {
                const updatedPermissions = data.map((permission, idx) => {
                    if (idx === permissionIndex && permission._id) {                        

                        // Appel de l'API de mise à jour du chapitre
                        apiGrantedPermission({
                            userId:selectedUserPermission._id, 
                            permissionName:permission.nom,
                            isGranted:checked
                        }).then((response) => {
                            // Gestion de la réponse de l'API
                            if (response.success) {
                                
                                if(checked){
                                    dispatch(addUserPemission(permission.nom));
                                }else{
                                    dispatch(removeUserPemission(permission.nom));
                                }
                                
                                createToast(response.message[lang as keyof typeof response.message], '', 0);
                            } else {
                                createToast(response.message[lang as keyof typeof response.message], '', 2);
                            }
                        }).catch((error) => {
                            console.error('Error updating chapter:', error);
                            createToast(error.message, '', 2);
                        });

                        return permission.nom;
                    }
                    return permission.nom;
                });

            }
        }
    };

    return (
        <tbody>
            {data && data.map((permission: PermissionType, indexPermission: number) => (
                <tr key={indexPermission} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                    {/* Permission de la matière */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                        <h5>{lang === 'fr' ? permission.libelleFr : permission.libelleEn }</h5>
                    </td>
                    {/* Case à cocher pour l'état de l'permission */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                        <input className={`${(selectedUserPermission) ? 'cursor-pointer' : ''}`} type="checkbox" checked={userPermissions.some(perm=> perm.toString() === permission.nom.toString())} onChange={() => {const checked = userPermissions.some(perm=> perm.toString() === permission.nom.toString());handleCheckboxChange(indexPermission, !checked)}} />
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default BodyTable;