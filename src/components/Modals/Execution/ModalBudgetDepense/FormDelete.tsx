import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting.tsx';
import { RootState } from '../../../../_redux/store.tsx';
import CustomDialogModal from '../../CustomDialogModal.tsx';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify.tsx';
import { deleteDepense } from '../../../../services/executions/depenseAPI.tsx';
import { deleteDepenseSlice } from '../../../../_redux/features/execution/depenseSlice.tsx';



function FormDelete({ depense, onDelete }: { depense : Depense | null, onDelete: (depenseId: string) => void;}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (depense?._id != undefined) {
            await deleteDepense(depense._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (depense._id) {
                        onDelete(depense._id);
                        dispatch(deleteDepenseSlice({ id: depense._id }));
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
                <h1>{t('form_delete.suppression')+t('form_delete.depense')} : {depense?lang === 'fr'?depense.nomFr:depense.nomEn:""} </h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



