import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { deleteBesoinAjoute } from '../../../../../services/elaborations/besoinAjouteUtilisateurAPI';
import { deleteBesoinAjouteUtilisateurSlice } from '../../../../../_redux/features/elaborations/besoinAjouteUtilisateurSlice';
import { useState } from 'react';



function ModalDelete({ besoinAjouteUtilisateur }: { besoinAjouteUtilisateur: BesoinAjouteUtilisateur | null }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const lang = useSelector((state: RootState) => state.setting.language);

    const closeModal = () => { dispatch(setShowModalDelete()); };

    const handleDelete = async () => {
        
        if (besoinAjouteUtilisateur?._id != undefined) {
            setIsLoading(true);
            await deleteBesoinAjoute(besoinAjouteUtilisateur._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (besoinAjouteUtilisateur._id) {
                        dispatch(deleteBesoinAjouteUtilisateurSlice({ id: besoinAjouteUtilisateur._id }));
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
                <h1>{t('form_delete.suppression') + t('form_delete.competence')} : {besoinAjouteUtilisateur ? (lang === 'fr' ? besoinAjouteUtilisateur.titreFr || "" : besoinAjouteUtilisateur.titreEn || "") : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



