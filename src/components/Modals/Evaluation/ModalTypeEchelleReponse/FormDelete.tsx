import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { deleteTypeEchelleReponse } from '../../../../services/evaluations/typeEchelleReponseAPI';
import { deleteTypeEchelleReponseSlice } from '../../../../_redux/features/evaluations/typeEchelleResponseSlice';


function FormDelete({ typeEchelleReponse }: { typeEchelleReponse: TypeEchelleReponse | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };

    const lang = useSelector((state: RootState) => state.setting.language);


    const handleDelete = async () => {

        if (typeEchelleReponse?._id != undefined) {
            await deleteTypeEchelleReponse(typeEchelleReponse._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (typeEchelleReponse._id) {
                        dispatch(deleteTypeEchelleReponseSlice({ id: typeEchelleReponse._id }));
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
                title={t('form_delete.supprimer')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDelete}
            >
                <h1>{t('form_delete.suppression') + t('form_delete.type_echelle_reponse')} : {typeEchelleReponse ? (lang == "fr" ? typeEchelleReponse.nomFr : typeEchelleReponse.nomEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



