import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../../_redux/features/setting.tsx';
import { RootState } from '../../../../../_redux/store.tsx';
import CustomDialogModal from '../../../CustomDialogModal.tsx';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify.tsx';
import { deleteBudgetFormation } from '../../../../../services/elaborations/budgetFormationAPI.tsx';
import { deleteBudgetFormationSlice } from '../../../../../_redux/features/elaborations/budgetFormationSlice.tsx';



function FormDelete({ budgetFormation}: { budgetFormation : BudgetFormation | null}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (budgetFormation?._id != undefined) {
            await deleteBudgetFormation(budgetFormation._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (budgetFormation._id) {
                        dispatch(deleteBudgetFormationSlice({ id: budgetFormation._id }));
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
                <h1>{t('form_delete.suppression')+t('form_delete.budget')} : {lang==='fr'?budgetFormation?.nomFr:budgetFormation?.nomEn} </h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



