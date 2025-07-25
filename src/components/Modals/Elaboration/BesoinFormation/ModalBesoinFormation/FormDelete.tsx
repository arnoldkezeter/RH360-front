import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { deleteCompetence } from '../../../../../services/elaborations/competenceAPI';
import { deleteCompetenceSlice } from '../../../../../_redux/features/elaborations/competenceSlice';
import { deleteAutoEvaluation } from '../../../../../services/elaborations/autoEvaluationBesoinAPI';
import { deleteAutoEvaluationBesoinSlice } from '../../../../../_redux/features/elaborations/autoEvaluationBesoinSlice';



function ModalDelete({ autoEvaluation }: { autoEvaluation: AutoEvaluationBesoin | null }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const lang = useSelector((state: RootState) => state.setting.language);

    const closeModal = () => { dispatch(setShowModalDelete()); };

    const handleDelete = async () => {
        if (autoEvaluation?._id != undefined) {
            await deleteAutoEvaluation(autoEvaluation._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (autoEvaluation._id) {
                        dispatch(deleteAutoEvaluationBesoinSlice({ id: autoEvaluation._id }));
                    }

                    closeModal();
                } else {
                    createToast(e.message, '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message, '', 2);

            })
        }
    }

    return (
        <>
            <CustomDialogModal
                title={t('form_delete.reinitialiser')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDelete}
            >
                <h1>{t('form_delete.auto_evaluation')} : {autoEvaluation ? (lang === 'fr' ? autoEvaluation?.besoin?.titreFr || "" : autoEvaluation?.besoin?.titreEn || "") : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



