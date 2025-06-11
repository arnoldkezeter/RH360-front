import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { deleteAxeStrategique } from '../../../services/axeStrategiqueAPI';
import { deleteAxeStrategiqueSlice } from '../../../_redux/features/axeStrategiqueSlice';


function FormDelete({ axeStrategique }: { axeStrategique: AxeStrategique | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };

    const lang = useSelector((state: RootState) => state.setting.language);


    const handleDelete = async () => {

        if (axeStrategique?._id != undefined) {
            await deleteAxeStrategique(axeStrategique._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (axeStrategique._id) {
                        dispatch(deleteAxeStrategiqueSlice({ id: axeStrategique._id }));
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
                <h1>{t('form_delete.suppression') + t('form_delete.axe_strategique')} : {axeStrategique ? (lang == "fr" ? axeStrategique.nomFr : axeStrategique.nomEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



