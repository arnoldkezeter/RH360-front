import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting.tsx';
import { RootState } from '../../../../_redux/store.tsx';
import CustomDialogModal from '../../CustomDialogModal.tsx';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify.tsx';
import { deleteStagiaire } from '../../../../services/stagiaires/stagiaireAPI.tsx';
import { deleteStagiaireSlice } from '../../../../_redux/features/stagiaire/stagiaireSlice.tsx';



function FormDelete({ stagiaire }: { stagiaire : Stagiaire|null}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (stagiaire?._id != undefined) {
            await deleteStagiaire(stagiaire._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (stagiaire._id) {
                        dispatch(deleteStagiaireSlice({ id: stagiaire._id }));
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
                <h1>{t('form_delete.suppression')+t('form_delete.stagiaire')} : {stagiaire?stagiaire.nom:""} {stagiaire?stagiaire.prenom:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



