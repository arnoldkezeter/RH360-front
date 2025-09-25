import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting.tsx';
import { RootState } from '../../../../_redux/store.tsx';
import CustomDialogModal from '../../CustomDialogModal.tsx';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify.tsx';
import { deleteObjectifTheme } from '../../../../services/elaborations/objectifThemeAPI.tsx';
import { deleteObjectifThemeSlice } from '../../../../_redux/features/elaborations/objectifThemeSlice.tsx';
import { useState } from 'react';



function FormDelete({ objectifTheme, themeId }: { objectifTheme : ObjectifTheme | null, themeId:string}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (objectifTheme?._id != undefined) {
            setIsLoading(true)
            await deleteObjectifTheme(themeId, objectifTheme._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (objectifTheme._id) {
                        dispatch(deleteObjectifThemeSlice({ id: objectifTheme._id }));
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
                <h1>{t('form_delete.suppression')+t('form_delete.objectif')} : {lang==='fr'?objectifTheme?.nomFr:objectifTheme?.nomEn} </h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



