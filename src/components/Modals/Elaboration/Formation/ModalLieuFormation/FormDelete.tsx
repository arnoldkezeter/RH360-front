import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../../_redux/features/setting.tsx';
import { RootState } from '../../../../../_redux/store.tsx';
import CustomDialogModal from '../../../CustomDialogModal.tsx';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify.tsx';
import { deleteLieuFormation } from '../../../../../services/elaborations/lieuFormationAPI.tsx';
import { deleteLieuFormationSlice } from '../../../../../_redux/features/elaborations/lieuFormationSlice.tsx';
import { useState } from 'react';



function FormDelete({ lieuFormation, themeId }: { lieuFormation : LieuFormation | null, themeId:string}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (lieuFormation?._id != undefined) {
            setIsLoading(true)
            await deleteLieuFormation(themeId, lieuFormation._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (lieuFormation._id) {
                        dispatch(deleteLieuFormationSlice({ id: lieuFormation._id }));
                    }

                    closeModal();
                } else {
                    createToast(e.message, '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message, '', 2);
            }).finally(()=>{
                setIsLoading(false)
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
                isLoading={isLoading}
            >
                <h1>{t('form_delete.suppression')+t('form_delete.lieu_formation')} : {lieuFormation?lieuFormation.lieu:""} </h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



