import { useDispatch, useSelector } from 'react-redux';
import {setShowModalConvocationParticipant } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { createNoteServiceConvocationParticipant, updateNoteService } from '../../../../services/notes/noteServiceAPI';
import { updateNoteServiceSlice } from '../../../../_redux/features/notes/noteServiceSlice';
import { updateTacheThemeFormationSlice } from '../../../../_redux/features/elaborations/tacheThemeFormationSlice';


function FormCreateUpdateConvocationParticipant({tache, note, themeId }: {tache:TacheThemeFormation, note:NoteService|undefined, themeId?:string }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    const userId = useSelector((state: RootState) => state.utilisateurSlice.utilisateur._id);
    const dispatch = useDispatch();
    const [titreFr, setTitreFr] = useState("");
    const [titreEn, setTitreEn] = useState("");
    const [copieA, setCopieA] = useState("");
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    

    const [errorTitreFr, setErrorTitreFr] = useState("");
    const [errorTitreEn, setErrorTitreEn] = useState("");
    const [errorCopieA, setErrorCopieA] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openConvocationParticipant);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (note) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.note'));
            
            setTitreFr(note.titreFr);
            setTitreEn(note.titreEn);
           
            setCopieA(note.copieA)
           
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.note'));
            
            setTitreFr("");
            setTitreEn("");
            
            setCopieA("");           
            
        }


        if (isFirstRender) {
            setErrorTitreFr("");
            setErrorTitreEn("");
            setErrorCopieA("")
           
            
            setIsFirstRender(false);
        }
    }, [note, isFirstRender, t]);

    const closeModal = () => {
        setErrorTitreFr("");
        setErrorTitreEn("");
        setErrorCopieA("");
        setIsFirstRender(true);
        dispatch(setShowModalConvocationParticipant());
    };



   

   


    const handleCreateNoteService = async () => {
        if (!titreFr || !titreEn || !copieA) {
            if (!titreFr) {
                setErrorTitreFr(t('error.titre_fr'));
            }

            if(!titreEn){
                setErrorTitreEn(t("error.titre_en"))
            }

            if(!copieA){
                setErrorCopieA(t('error.copie_a'))
            }

            return;
        }

        if (!note) {
            setIsLoading(true)
            await createNoteServiceConvocationParticipant(
                {
                    titreFr,
                    titreEn,
                    theme:themeId, 
                    copieA, 
                    creePar:userId, 
                    typeNote:"convocation"
                }, tache._id||"", lang
            ).then( (e: any) => {
                
                if (e) {
                    // createToast(e.message, '', 0);
                    dispatch(updateTacheThemeFormationSlice({
                        id: tache._id||"",
                        tacheThemeFormationData: {
                            _id: tache._id,
                            dateDebut: tache.dateDebut,
                            dateFin: tache.dateFin,
                            theme: tache.theme,
                            tache: tache.tache,
                            statut:"EN_ATTENTE",
                        }

                    }));

                   
                    closeModal();

                } else {
                    createToast(e.message, '', 2);

                }
            }).catch((e) => {
                console.log(e);
                createToast(e.response.data.message, '', 2);
            }).finally(()=>{
                setIsLoading(false)
            })

        } else {
            setIsLoading(true)
            await updateNoteService(
                {
                    _id: note._id||"",
                    titreFr,
                    titreEn,
                    theme:themeId, 
                    typeNote:"convocation", 
                    copieA, 
                    creePar:userId, 
                },lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateNoteServiceSlice({
                            id: e.data._id,
                            noteServiceData: {
                                _id: e.data._id,
                                titreFr: e.data.titreFr,
                                titreEn: e.data.titreEn,
                            }

                        }));

                        closeModal();

                    } else {
                        createToast(e.message, '', 2);

                    }
                }).catch((e) => {
                    console.log(e);
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
                handleConfirm={handleCreateNoteService}
                isLoading={isLoading}
            >
                
                <label>{t('label.titre_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={titreFr}
                    onChange={(e) => { setTitreFr(e.target.value); setErrorTitreFr("") }}
                />
                {errorTitreFr && <p className="text-red-500" >{errorTitreFr}</p>}
                
                <label>{t('label.titre_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={titreEn}
                    onChange={(e) => { setTitreEn(e.target.value); setErrorTitreEn("") }}
                />
                {errorTitreEn && <p className="text-red-500" >{errorTitreEn}</p>}
                <label>{t('label.copie_a')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={copieA}
                    onChange={(e) => { setCopieA(e.target.value); setErrorCopieA("") }}
                    placeholder={t('label.placeholder_copie_a')}
                />
                {errorCopieA && <p className="text-red-500" >{errorCopieA}</p>}
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdateConvocationParticipant;
