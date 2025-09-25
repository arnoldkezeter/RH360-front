
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../_redux/store';
import { setShowModalDelete } from '../../../../_redux/features/setting';
import { deleteTacheStagiaire } from '../../../../services/stagiaires/tacheStagiaireAPI';
import createToast from '../../../../hooks/toastify';
import { deleteTacheStagiaireSlice } from '../../../../_redux/features/stagiaire/tacheStagiaireSlice';
import CustomDialogModal from '../../CustomDialogModal.tsx';
import { useState } from 'react';




function FormDelete({ tacheStagiaire, onDelete}: { tacheStagiaire : TacheStagiaire | null, onDelete: (depenseId: string) => void}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (tacheStagiaire?._id != undefined) {
            setIsLoading(true)
            await deleteTacheStagiaire(tacheStagiaire._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (tacheStagiaire._id) {
                        onDelete(tacheStagiaire._id);
                        dispatch(deleteTacheStagiaireSlice({ id: tacheStagiaire._id }));
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
                <h1>{t('form_delete.suppression')+t('form_delete.tache_stagiaire')} : {lang==='fr'?tacheStagiaire?.nomFr:tacheStagiaire?.nomEn} </h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



