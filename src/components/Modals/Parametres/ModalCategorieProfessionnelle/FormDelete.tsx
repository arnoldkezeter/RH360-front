import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { deleteCategorieProfessionnelle } from '../../../../services/settings/categorieProfessionnelleAPI';
import { deleteCategorieProfessionnelleSlice } from '../../../../_redux/features/parametres/categorieProfessionnelleSlice';



function ModalDelete({ categorieProfessionnelle }: { categorieProfessionnelle: CategorieProfessionnelle | null }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const lang = useSelector((state: RootState) => state.setting.language);

    const closeModal = () => { dispatch(setShowModalDelete()); };

    const handleDelete = async () => {
        if (categorieProfessionnelle?._id != undefined) {
            await deleteCategorieProfessionnelle(categorieProfessionnelle._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (categorieProfessionnelle._id) {
                        dispatch(deleteCategorieProfessionnelleSlice({ id: categorieProfessionnelle._id }));
                    }

                    closeModal();
                } else {
                    createToast(e.message, '', 2);
                }
            }).catch((e) => {
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
                <h1>{t('form_delete.suppression') + t('form_delete.categorie_professionnelle')} : {categorieProfessionnelle ? (lang === 'fr' ? categorieProfessionnelle.nomFr : categorieProfessionnelle.nomEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



