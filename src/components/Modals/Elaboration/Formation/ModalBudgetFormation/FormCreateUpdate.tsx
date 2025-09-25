import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { createBudgetFormationSlice, updateBudgetFormationSlice } from '../../../../../_redux/features/elaborations/budgetFormationSlice';
import { STATUT_BUDGET } from '../../../../../config';
import { createBudgetFormation, updateBudgetFormation } from '../../../../../services/elaborations/budgetFormationAPI';


function FormCreateUpdate({ budgetFormation, formation }: { budgetFormation: BudgetFormation | null, formation:Formation|undefined }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const statuts = Object.values(STATUT_BUDGET)
    const dispatch = useDispatch();
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [statut, setStatut] = useState<StatutBudget | undefined>(statuts[0] || undefined);
    
    

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (budgetFormation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.budget'));
            
            setNomFr(budgetFormation.nomFr);
            setNomEn(budgetFormation.nomEn);
            const statut = statuts.find(sta => sta.key === budgetFormation.statut);
            setStatut(statut)
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.budget'));
            
            setNomFr("");
            setNomEn("")
            setStatut(statuts[0] || undefined)
            
        }


        if (isFirstRender) {
            setErrorNomFr("");
            setErrorNomEn("")
           
            
            setIsFirstRender(false);
        }
    }, [budgetFormation, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


   const handleStatutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRoleNom = e.target.value;
        var selected=null;

        if (lang === 'fr') {
            selected = statuts.find(statut => statut.nomFr === selectedRoleNom);
        }
        else {
            selected = statuts.find(statut => statut.nomEn === selectedRoleNom);
        }
        
        if(selected){
            setStatut(selected)
        }
    }


    const handleCreateBudgetFormation = async () => {
        if (!nomFr || !nomEn) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }

            if(!nomEn){
                setErrorNomEn(t("error.nom_en"))
            }

            return;
        }

        if (!budgetFormation ) {
            setIsLoading(true)
            if(formation){     
                await createBudgetFormation(
                    {
                        formation,
                        nomFr,
                        nomEn,
                        statut:statut?.key ||""
                    },lang
                ).then((e: ReponseApiPros) => {
                    
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(createBudgetFormationSlice({

                            budgetFormation: {
                                _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                formation: e.data.formation,
                                statut: e.data.statut
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
        } else {
            setIsLoading(true);
            await updateBudgetFormation(
                {
                    _id: budgetFormation._id,
                    nomFr,
                    nomEn,
                    statut:statut?.key || ""
                }, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateBudgetFormationSlice({
                            id: e.data._id,
                            budgetFormationData: {
                                _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                formation: e.data.formation,
                                statut: e.data.statut
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
                handleConfirm={handleCreateBudgetFormation}
                isLoading={isLoading}
            >
                
                <label>{t('label.nom_chose_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomFr}
                    onChange={(e) => { setNomFr(e.target.value); setErrorNomFr("") }}
                />
                {errorNomFr && <p className="text-red-500" >{errorNomFr}</p>}
                
                <label>{t('label.nom_chose_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomEn}
                    onChange={(e) => { setNomEn(e.target.value); setErrorNomEn("") }}
                />
                {errorNomEn && <p className="text-red-500" >{errorNomEn}</p>}

                <label>{t('label.statut')}</label>
                <select
                    value={statut? (lang === 'fr' ? statut.nomFr : statut.nomEn) : (statuts.length>0? (lang === 'fr' ? statuts[0].nomFr : statuts[0].nomEn):t('select_par_defaut.selectionnez') + t('select_par_defaut.type_depense'))}
                    onChange={handleStatutChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    {statuts.map(statut => (
                        <option key={statut.key} value={(lang === 'fr' ? statut.nomFr : statut.nomEn)}>{(lang === 'fr' ? statut.nomFr : statut.nomEn)}</option>
                    ))}
                </select>
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;
