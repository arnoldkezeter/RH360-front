import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { deleteCommune } from '../../../../services/settings/communeAPI';
import { deleteCommuneSlice } from '../../../../_redux/features/parametres/communeSlice';
import { useState } from 'react';



function ModalDelete({ commune }: { commune : Commune|null}) {
    const dispatch = useDispatch();
    const {t}=useTranslation();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleDelete = async () => {
        if (commune?._id != undefined) {
            setIsLoading(true)
            await deleteCommune(commune._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (commune._id) {
                        dispatch(deleteCommuneSlice({ id: commune._id }));
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
                <h1>{t('form_delete.suppression')+t('form_delete.commune')} : {commune ? (lang === 'fr' ? commune.nomFr : commune.nomEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



