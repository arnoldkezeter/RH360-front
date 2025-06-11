import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { deleteBesoinFormationPredefini } from '../../../services/settings/besoinFormationPredefiniAPI';
import { deleteBesoinFormationPredefiniSlice } from '../../../_redux/features/settings/besoinFormationPredefini';


function FormDelete({ besoinFormationPredefini }: { besoinFormationPredefini: BesoinFormationPredefini | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };

    const lang = useSelector((state: RootState) => state.setting.language);


    const handleDelete = async () => {

        if (besoinFormationPredefini?._id != undefined) {
            await deleteBesoinFormationPredefini(besoinFormationPredefini._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (besoinFormationPredefini._id) {
                        dispatch(deleteBesoinFormationPredefiniSlice({ id: besoinFormationPredefini._id }));
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
                <h1>{t('form_delete.suppression') + t('form_delete.besoin_formation_predefini')} : {besoinFormationPredefini ? (lang == "fr" ? besoinFormationPredefini.titreFr : besoinFormationPredefini.titreEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



