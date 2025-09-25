import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { deletePosteDeTravail } from '../../../../services/settings/posteDeTravailAPI';
import { deletePosteDeTravailSlice } from '../../../../_redux/features/parametres/posteDeTravailSlice';
import { useState } from 'react';



function ModalDelete({ posteDeTravail }: { posteDeTravail: PosteDeTravail | null }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const lang = useSelector((state: RootState) => state.setting.language);

    const closeModal = () => { dispatch(setShowModalDelete()); };

    const handleDelete = async () => {
        if (posteDeTravail?._id != undefined) {
            setIsLoading(true)
            await deletePosteDeTravail(posteDeTravail._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (posteDeTravail._id) {
                        dispatch(deletePosteDeTravailSlice({ id: posteDeTravail._id }));
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
                <h1>{t('form_delete.suppression') + t('form_delete.poste_de_travail')} : {posteDeTravail ? (lang === 'fr' ? posteDeTravail.nomFr : posteDeTravail.nomEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



