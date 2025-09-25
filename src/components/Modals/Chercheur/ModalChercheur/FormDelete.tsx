import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting.tsx';
import { RootState } from '../../../../_redux/store.tsx';
import CustomDialogModal from '../../CustomDialogModal.tsx';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify.tsx';
import { deleteChercheur } from '../../../../services/chercheurs/chercheurAPI.tsx';
import { deleteChercheurSlice } from '../../../../_redux/features/chercheurs/chercheurSlice.tsx';



function FormDelete({ chercheur }: { chercheur : Chercheur|null}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (chercheur?._id != undefined) {
            setIsLoading(true)
            await deleteChercheur(chercheur._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (chercheur._id) {
                        dispatch(deleteChercheurSlice({ id: chercheur._id }));
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
                <h1>{t('form_delete.suppression')+t('form_delete.chercheur')} : {chercheur?chercheur.nom:""} {chercheur?chercheur.prenom:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



function useState<T>(arg0: boolean): [any, any] {
    throw new Error('Function not implemented.');
}

