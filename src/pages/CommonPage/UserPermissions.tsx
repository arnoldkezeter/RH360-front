// import { useEffect, useState } from "react";
// import Breadcrumb from "../../components/Breadcrumb";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../_redux/store";
// import { setPermissionLoading, setPermissions, setErrorPagePermission } from "../../_redux/features/permission_slice";
// import { apiGetUserPermissions, getPermissionsWithPagination } from "../../api/api_permission";
// import createToast from "../../hooks/toastify";
// import Table from "../../components/Tables/TableUserPermission/Table";
// import { useNavigate } from "react-router-dom";
// import { setUserPermission } from "../../_redux/features/setting";
// import { createFinalPermissionList } from "../../fonctions/fonction";




const UserPermissions = () => {
    // const [selectedPermission, setSelectedPermission] = useState<PermissionType | null>(null);

    // const { data: { permissions } } = useSelector((state: RootState) => state.permissionSlice);
    // const selectedUserPermission = useSelector((state: RootState) => state.setting.selectedUserPermission);
    // const selectedUserRole : string = useSelector((state: RootState) => state.setting.selectedUserRole);
    // const lang : string = useSelector((state: RootState) => state.setting.language); // fr ou en
    // const currentUser = useSelector((state: RootState) => state.user);

    // const handleEditUserPermission = (permission: PermissionType) => {
    //     setSelectedPermission(permission);
    // }
    // const {t}=useTranslation();
    // const handleAddPermission = () => {
    //     setSelectedPermission(null);
    // }
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    
    
    // useEffect(() => {

    //     const fetchUserPermissions = async () => {
    //         dispatch(setPermissionLoading(true)); // Définissez le loading à true avant le chargement
    //         try {
    //             const emptyPermissions: PermissionReturnGetType = {
    //                 permissions: [],
    //                 currentPage: 0,
    //                 totalItems: 0,
    //                 totalPages: 0,
    //                 pageSize: 0
    //             }
    //             const fetchedUserPermissions = await getPermissionsWithPagination({ page: 1, langue:lang });
                    
    //             if (fetchedUserPermissions) { // Vérifiez si fetchedUserPermissions n'est pas faux, vide ou indéfini
    //                 dispatch(setPermissions(fetchedUserPermissions));
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
    //     fetchUserPermissions();
    // }, [dispatch, t]); // Déclencher l'effet lorsque currentPage change

    // useEffect(() => {
    //     let userId = currentUser._id;
    //     let role = currentUser.role;
    //     if(selectedUserPermission && selectedUserRole){
    //         navigate('/user/permissions/');
    //         userId = selectedUserPermission?._id;
    //         role = selectedUserRole;
    //     }
    //     const fetchPermissions = async () => {
    //         await apiGetUserPermissions({ userId: userId }).then((e: ReponseApiPros) => {
    //             if(e.success){

    //                 createFinalPermissionList(e.data, role, lang).then(finalPermissions => {
    //                     dispatch(setUserPermission(finalPermissions));
    //                 });
                    
    //             }else{
    //                 createToast(e.message[lang as keyof typeof e.message], '', 2);
    //             }
    //             }).catch((e) => {
    //                 if(selectedUserPermission && selectedUserRole){
    //                     createToast(t('message.erreur'), "", 2);
    //                 }
    //             })
    //     }
    //     fetchPermissions();
        
    // }, [dispatch, selectedUserPermission, selectedUserRole, t])
    
    
    return (
        <>
            
            {/* <Breadcrumb pageName={t('sub_menu.permission')}/>
            <Table data={permissions} /> */}

        </>
    );
};


export default UserPermissions;
