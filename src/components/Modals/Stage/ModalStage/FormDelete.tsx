import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting.tsx';
import { RootState } from '../../../../_redux/store.tsx';
import CustomDialogModal from '../../CustomDialogModal.tsx';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify.tsx';
import { deleteStageSlice } from '../../../../_redux/features/stagiaire/stageSlice.tsx';
import { deleteStage } from '../../../../services/stagiaires/stageAPI.tsx';



function FormDelete({ stage }: { stage : Stage|undefined}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (stage?._id != undefined) {
            await deleteStage(stage._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (stage._id) {
                        dispatch(deleteStageSlice({ id: stage._id }));
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
                <h1>{t('form_delete.suppression')+t('form_delete.stage')} : {lang==='fr'?(stage?.nomFr||""):(stage?.nomEn||"")}</h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



