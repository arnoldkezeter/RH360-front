import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { createNoteServiceStageGroupe, updateNoteService } from '../../../../services/notes/noteServiceAPI';
import { updateNoteServiceSlice } from '../../../../_redux/features/notes/noteServiceSlice';


function FormCreateUpdateStageGroupe({note, themeId, mandatId, stageId }: {note:NoteService|undefined, themeId?:string,  mandatId?:string, stageId?:string }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    const userId = useSelector((state: RootState) => state.utilisateurSlice.utilisateur._id);
    const dispatch = useDispatch();
    const [titreFr, setTitreFr] = useState("");
    const [titreEn, setTitreEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [copieA, setCopieA] = useState("");
    const [designationTuteur, setDesignationTuteur] = useState("");
    const [miseEnOeuvre, setMiseEnOeuvre] = useState("");
    const [dispositions, setDispositions] = useState("");
    const [personnesResponsables, setPersonnesResponsables] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    

    const [errorTitreFr, setErrorTitreFr] = useState("");
    const [errorTitreEn, setErrorTitreEn] = useState("");
    const [errorDescriptionFr, setErrorDescriptionFr] = useState("");
    const [errorDescriptionEn, setErrorDescriptionEn] = useState("");
    const [errorCopieA, setErrorCopieA] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (note) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.note'));
            
            setTitreFr(note.titreFr);
            setTitreEn(note.titreEn);
            setDescriptionFr(note?.descriptionFr||"")
            setDescriptionEn(note?.descriptionEn||"")
            setCopieA(note.copieA)
            setDesignationTuteur(note.designationTuteur||"");
            setMiseEnOeuvre(note.miseEnOeuvre||"")
            setDispositions(note?.dispositions||"")
            setPersonnesResponsables(note?.personnesResponsables||"")
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.note'));
            
            setTitreFr("");
            setTitreEn("");
            setDescriptionFr("")
            setDescriptionEn("")
            setCopieA("");
            setDesignationTuteur("");
            setMiseEnOeuvre("");
            setDispositions("")
            setPersonnesResponsables("")
            
        }


        if (isFirstRender) {
            setErrorTitreFr("");
            setErrorTitreEn("");
            setErrorDescriptionFr("");
            setErrorDescriptionEn("");
            setErrorCopieA("")
           
            
            setIsFirstRender(false);
        }
    }, [note, isFirstRender, t]);

    const closeModal = () => {
        setErrorTitreFr("");
        setErrorTitreEn("");
        setErrorCopieA("");
        setErrorDescriptionFr("");
        setErrorDescriptionEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };



   

   


    const handleCreateNoteService = async () => {
        if (!titreFr || !titreEn || !copieA || !descriptionFr || !descriptionEn) {
            if (!titreFr) {
                setErrorTitreFr(t('error.titre_fr'));
            }

            if(!titreEn){
                setErrorTitreEn(t("error.titre_en"))
            }

            if(!copieA){
                setErrorCopieA(t('error.copie_a'))
            }

            if (!descriptionFr) {
                setErrorDescriptionFr(t('error.description_fr'));
            }

            if(!descriptionEn){
                setErrorDescriptionEn(t("error.description_en"))
            }

            return;
        }

        if (!note) {
            setIsLoading(true)
            await createNoteServiceStageGroupe(
                {
                    titreFr,
                    titreEn,
                    descriptionFr,
                    descriptionEn,
                    theme:themeId, 
                    stage:stageId, 
                    mandat:mandatId, 
                    designationTuteur, 
                    miseEnOeuvre,
                    dispositions,
                    personnesResponsables,
                    typeNote:themeId?"convocation":stageId?"acceptation_stage":"mandat", 
                    copieA, 
                    creePar:userId, 
                    valideParDG:false
                },lang
            ).then( (e: any) => {
                
                if (e) {
                    // createToast(e.message, '', 0);
                    // dispatch(createNoteServiceSlice({

                    //     noteService: {
                    //         _id: e.data._id,
                    //         titreFr: e.data.titreFr,
                    //         titreEn: e.data.titreEn,
                    //         copieA: e.data.copieA,
                    //         typeNote: e.data.typeNote
                    //     }

                    // }));

                   
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
                    stage:stageId, 
                    mandat:mandatId, 
                    designationTuteur, 
                    miseEnOeuvre,
                    typeNote:themeId?"convocation":stageId?"acceptation_stage":"mandat", 
                    copieA, 
                    creePar:userId, 
                    valideParDG:false
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
                <label>{t('label.descrip_fr')}</label><label className="text-red-500"> *</label>
                <textarea
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    value={descriptionFr}
                    onChange={(e) => { setDescriptionFr(e.target.value); setErrorDescriptionFr("") }}
                />
                {errorDescriptionFr && <p className="text-red-500" >{errorDescriptionFr}</p>}
                
                <label>{t('label.descrip_en')}</label><label className="text-red-500"> *</label>
                <textarea
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    value={descriptionEn}
                    onChange={(e) => { setDescriptionEn(e.target.value); setErrorDescriptionEn("") }}
                />
                {errorDescriptionEn && <p className="text-red-500" >{errorDescriptionEn}</p>}
                <label>{t('label.copie_a')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={copieA}
                    onChange={(e) => { setCopieA(e.target.value); setErrorCopieA("") }}
                    placeholder={t('label.placeholder_copie_a')}
                />
                {errorCopieA && <p className="text-red-500" >{errorCopieA}</p>}
                <label>{t('label.designation_tuteur')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={designationTuteur}
                    onChange={(e) => { setDesignationTuteur(e.target.value)}}
                />
                <label>{t('label.mise_oeuvre')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={miseEnOeuvre}
                    onChange={(e) => { setMiseEnOeuvre(e.target.value)}}
                />
                <label>{t('label.dispositions')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={dispositions}
                    onChange={(e) => { setDispositions(e.target.value)}}
                    placeholder={t('label.placeholder_dispositions')}
                />
                <label>{t('label.personnes_responsables')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={personnesResponsables}
                    onChange={(e) => { setPersonnesResponsables(e.target.value)}}
                />
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdateStageGroupe;
