import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { deleteEtablissement } from '../../../../services/settings/etablissementAPI';
import { deleteEtablissementSlice } from '../../../../_redux/features/parametres/etablissementSlice';


function FormDelete({ etablissement }: { etablissement: Etablissement | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };

    const lang = useSelector((state: RootState) => state.setting.language);


    const handleDelete = async () => {

        if (etablissement?._id != undefined) {
            await deleteEtablissement(etablissement._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (etablissement._id) {
                        dispatch(deleteEtablissementSlice({ id: etablissement._id }));
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
                <h1>{t('form_delete.suppression') + t('form_delete.etablissement')} : {etablissement ? (lang == "fr" ? etablissement.nomFr : etablissement.nomEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



