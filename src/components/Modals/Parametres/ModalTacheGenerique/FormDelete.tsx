import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { deleteTacheGenerique } from '../../../../services/settings/tacheGeneriqueAPI';
import { deleteTacheGeneriqueSlice } from '../../../../_redux/features/parametres/tacheGeneriqueSlice';
import { useState } from 'react';


function FormDelete({ tacheGenerique }: { tacheGenerique: TacheGenerique | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };

    const lang = useSelector((state: RootState) => state.setting.language);


    const handleDelete = async () => {

        if (tacheGenerique?._id != undefined) {
            setIsLoading(true)
            await deleteTacheGenerique(tacheGenerique._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (tacheGenerique._id) {
                        dispatch(deleteTacheGeneriqueSlice({ id: tacheGenerique._id }));
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
                <h1>{t('form_delete.suppression') + t('form_delete.tache_formation')} : {tacheGenerique ? (lang == "fr" ? tacheGenerique.nomFr : tacheGenerique.nomEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



