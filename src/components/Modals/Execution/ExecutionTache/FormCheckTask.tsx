import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reinitialiserStatutTaches, updateStatutTacheThemeFormation } from '../../../../services/elaborations/tacheThemeFormationAPI';
import { RootState } from '../../../../_redux/store';
import {setShowModalCheckTask } from '../../../../_redux/features/setting';
import createToast from '../../../../hooks/toastify';
import CustomDialogModal from '../../CustomDialogModal';
import { updateTacheThemeFormationSlice } from '../../../../_redux/features/elaborations/tacheThemeFormationSlice';


function FormCheckTask({ tache }: { tache: TacheThemeFormation|undefined }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openCheckTask);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    
    useEffect(() => {
        setModalTitle(t('label.marquer_tache'));
        


        if (isFirstRender) {
            
            setIsFirstRender(false);
        }
    }, [isFirstRender, t]);

    const closeModal = () => {
        setIsFirstRender(true);
        dispatch(setShowModalCheckTask());
    };

  


    


    const handleCheckTask = async () => {
        // await reinitialiserStatutTaches({lang}).then(()=>{

        // })
        if(tache){
            setIsLoading(true)
            await updateStatutTacheThemeFormation({tacheId:tache._id||"", currentUser:currentUser._id||"", statut:"EN_ATTENTE",donnees:'check', lang}).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateTacheThemeFormationSlice({
                        id: e.data._id,
                        tacheThemeFormationData: {
                            _id: tache._id,
                            dateDebut: tache.dateDebut,
                            dateFin: tache.dateFin,
                            theme: tache.theme,
                            tache: tache.tache,
                            statut:"EN_ATTENTE",
                        }

                    }));
        
                    closeModal()
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
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCheckTask}
                isLoading={isLoading}
            >     
                        
               <h1>{`${t('label.marquer')} ${lang==='fr'?tache?.tache.nomFr:tache?.tache.nomEn} ${t('label.comme_achever')} ${lang==='fr'?tache?.theme?.titreFr||"":tache?.theme?.titreEn||""}`} </h1>
                   
            </CustomDialogModal>

        </>
    );
}



export default FormCheckTask;
