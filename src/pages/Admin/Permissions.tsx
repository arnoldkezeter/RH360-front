import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
// import { setPermissionLoading, setPermissions, setErrorPagePermission } from "../../_redux/features/permission_slice";
// import { getPermissionsWithPagination } from "../../api/api_permission";
import createToast from "../../hooks/toastify";
import FormCreateUpdate from "../../components/Modals/ModalPermission/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalPermission/FormDelete";
import Table from "../../components/Tables/TablePermission/Table";




const Permissions = () => {
    // const [selectedPermission, setSelectedPermission] = useState<PermissionType | null>(null);

    // const { data: { permissions } } = useSelector((state: RootState) => state.permissionSlice);
    // const lang = useSelector((state: RootState) => state.setting.language); // fr ou en

    // const handleEditObejctif = (permission: PermissionType) => {
    //     setSelectedPermission(permission);
    // }
    // const {t}=useTranslation();
    // const handleAddPermission = () => {
    //     setSelectedPermission(null);
    // }
    
    // const dispatch = useDispatch();
    // useEffect(() => {

    //     const fetchPermissions = async () => {
    //         dispatch(setPermissionLoading(true)); // Définissez le loading à true avant le chargement
    //         try {
    //             const emptyPermissions: PermissionReturnGetType = {
    //                 permissions: [],
    //                 currentPage: 0,
    //                 totalItems: 0,
    //                 totalPages: 0,
    //                 pageSize: 0
    //             }
    //             const fetchedPermissions = await getPermissionsWithPagination({ page: 1, langue:lang });
                    
    //             if (fetchedPermissions) { // Vérifiez si fetchedPermissions n'est pas faux, vide ou indéfini
    //                 dispatch(setPermissions(fetchedPermissions));
    //             } else {
    //                 dispatch(setPermissions(emptyPermissions));
    //             }
               
                
    //             // Réinitialisez les erreurs s'il y en a
    //         } catch (error) {
    //             dispatch(setErrorPagePermission(t('message.erreur')));
    //             createToast(t('message.erreur'), "", 2)
    //         } finally {
    //             dispatch(setPermissionLoading(false)); // Définissez le loading à false après le chargement
    //         }
    //     }
    //     fetchPermissions();
    // }, [dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    
    return (
        <>
            
            {/* <Breadcrumb pageName={t('sub_menu.permission')}/>
            <Table data={permissions}  onCreate={handleAddPermission} onEdit={handleEditObejctif} />

            <FormCreateUpdate permission={selectedPermission} />
            <FormDelete permission={selectedPermission} /> */}

        </>
    );
};


export default Permissions;
