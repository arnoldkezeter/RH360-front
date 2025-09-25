import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting.tsx';
import { RootState } from '../../../../_redux/store.tsx';
import CustomDialogModal from '../../CustomDialogModal.tsx';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify.tsx';
import { deleteStageRechercheSlice } from '../../../../_redux/features/chercheurs/stageRechercheSlice.tsx';
import { deleteStageRecherche } from '../../../../services/chercheurs/stageRechercheAPI.tsx';
import { useState } from 'react';



function FormDelete({ stageRecherche }: { stageRecherche : StageRecherche|undefined}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (stageRecherche?._id != undefined) {
            setIsLoading(true)
            await deleteStageRecherche(stageRecherche._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (stageRecherche._id) {
                        dispatch(deleteStageRechercheSlice({ id: stageRecherche._id }));
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
                <h1>{t('form_delete.suppression')+t('form_delete.stage_recherche')} : {lang==='fr'?(stageRecherche?.nomFr||""):(stageRecherche?.nomEn||"")}</h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



