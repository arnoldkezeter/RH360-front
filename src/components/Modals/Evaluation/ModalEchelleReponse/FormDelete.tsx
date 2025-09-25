import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { deleteEchelleReponse } from '../../../../services/evaluations/echelleReponseAPI';
import { deleteEchelleReponseSlice } from '../../../../_redux/features/evaluations/echelleReponseSlice';
import { useState } from 'react';


function FormDelete({ echelleReponse }: { echelleReponse: EchelleReponse | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };

    const lang = useSelector((state: RootState) => state.setting.language);


    const handleDelete = async () => {

        if (echelleReponse?._id != undefined) {
            setIsLoading(true)
            await deleteEchelleReponse(echelleReponse._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (echelleReponse._id) {
                        dispatch(deleteEchelleReponseSlice({ id: echelleReponse._id }));
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
                <h1>{t('form_delete.suppression') + t('form_delete.echelle_reponse')} : {echelleReponse ? (lang == "fr" ? echelleReponse.nomFr : echelleReponse.nomEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



