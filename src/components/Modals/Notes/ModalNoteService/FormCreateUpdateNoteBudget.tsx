import { useDispatch, useSelector } from 'react-redux';
import {setShowModalGenerateDoc } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { createNoteServiceBudget, updateNoteService } from '../../../../services/notes/noteServiceAPI';
import { createNoteServiceSlice, updateNoteServiceSlice } from '../../../../_redux/features/notes/noteServiceSlice';
import { TYPE_BUDGET } from '../../../../config';


function FormCreateUpdateNoteBudget({note, themeId }: {note:NoteService|undefined, themeId?:string }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    const userId = useSelector((state: RootState) => state.utilisateurSlice.utilisateur._id);
    const dispatch = useDispatch();
    const typesBudget = Object.values(TYPE_BUDGET)
    const [titreFr, setTitreFr] = useState("");
    const [titreEn, setTitreEn] = useState("");
    const [typeBudget, setTypeBudget] = useState<typeBudget>();
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    

    const [errorTitreFr, setErrorTitreFr] = useState("");
    const [errorTitreEn, setErrorTitreEn] = useState("");
    const [errorTypeBudget, setErrorTypeBudget] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openGenerateDoc);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (note) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.note'));
            
            setTitreFr(note.titreFr);
            setTitreEn(note.titreEn);
            const typeBudget = typesBudget.find(tb=>tb.key === note.sousTypeNote);
            setTypeBudget(typeBudget);
           
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.note'));
            
            setTitreFr("");
            setTitreEn("");  
            setTypeBudget(undefined);      
            
        }


        if (isFirstRender) {
            setErrorTitreFr("");
            setErrorTitreEn("");
            setErrorTypeBudget("")
            
            setIsFirstRender(false);
        }
    }, [note, isFirstRender, t]);

    const closeModal = () => {
        setErrorTitreFr("");
        setErrorTitreEn("");
        setErrorTypeBudget("")
        setIsFirstRender(true);
        dispatch(setShowModalGenerateDoc());
    };

    const handleTypeBudgetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTypeBudgetNom = e.target.value;
        var selected=null;

        if (lang === 'fr') {
            selected = typesBudget.find(tb => tb.nomFr === selectedTypeBudgetNom);
        }
        else {
            selected = typesBudget.find(tb => tb.nomEn === selectedTypeBudgetNom);
        }
        
        if(selected){
            setTypeBudget(selected)
        }
    }

   

   


    const handleCreateNoteService = async () => {
        if (!titreFr || !titreEn || !typeBudget) {
            if (!titreFr) {
                setErrorTitreFr(t('error.titre_fr'));
            }

            if(!titreEn){
                setErrorTitreEn(t("error.titre_en"))
            }

            if(!typeBudget){
                setErrorTypeBudget(t("error.type_budget"))
            }
            return;
        }

        if (!note) {
            setIsLoading(true)
            await createNoteServiceBudget(
                {
                    titreFr,
                    titreEn,
                    theme:themeId, 
                    creePar:userId, 
                    typeBudget:typeBudget.key.toLocaleLowerCase(),
                    typeNote:"budget_formation",
                    copieA:""
                }, lang
            ).then( (e: any) => {
                
                if (e) {
                    dispatch(createNoteServiceSlice({
                        noteService: e.data

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
                    typeNote:"budget_formation", 
                    copieA:"", 
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
                <label>{t('label.type_budget')}</label><label className="text-red-500"> *</label>
                <select
                    value={typeBudget? (lang === 'fr' ? typeBudget.nomFr : typeBudget.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.type_budget')}
                    onChange={handleTypeBudgetChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.type_budget')}</option>
                    {typesBudget.map(tb => (
                        <option key={tb.key} value={(lang === 'fr' ? tb.nomFr : tb.nomEn)}>{(lang === 'fr' ? tb.nomFr : tb.nomEn)}</option>
                    ))}
                </select>
                {errorTypeBudget && <p className="text-red-500">{errorTypeBudget}</p>}
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdateNoteBudget;
