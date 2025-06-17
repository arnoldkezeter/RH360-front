import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { apiDeletePermission } from '../../../services/api_permission';
import { deletePermission } from '../../../_redux/features/permission_slice';


function ModalDelete({ permission }: {permission:PermissionType | null}) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const {t}=useTranslation();

    const handleDelete = async () => {
        if(permission && permission._id){
            await apiDeletePermission(permission._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    if(permission._id){
                        dispatch(deletePermission({ id: permission._id }));
                        // dispatch(retirerPermission({permissionId:permission._id}))
                    }
                    closeModal();

                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);

                }
            }).catch((e) => {
                console.log(e);
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            })
            
        }
        
    }

    return (
        <>
            <CustomDialogModal
                title={t('form_delete.supprimer')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDelete}
            >
                <h1>{t('form_delete.suppression')+t('form_delete.permission')} : {permission? lang === 'fr' ? permission.libelleFr: permission.libelleEn:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



