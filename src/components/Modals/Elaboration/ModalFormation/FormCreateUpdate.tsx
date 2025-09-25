import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { createFormation, updateFormation } from '../../../../services/elaborations/formationAPI';
import { createFormationSlice, updateFormationSlice } from '../../../../_redux/features/elaborations/formationSlice';


function FormCreateUpdate({ formation }: { formation: Formation | null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {data:{axeStrategiques}} = useSelector((state: RootState) => state.axeStrategiqueSlice)
    const {data:{programmeFormations}} = useSelector((state: RootState) => state.programmeFormationSlice)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    

    const dispatch = useDispatch();
    const [titreFr, setTitreFr] = useState("");
    const [titreEn, setTitreEn] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [programmeFormation, setProgrammeFormation] = useState<ProgrammeFormation>()
    const [axeStrategique, setAxeStrategique] = useState<AxeStrategique>();
    

    const [errorTitreFr, setErrorTitreFr] = useState("");
    const [errorTitreEn, setErrorTitreEn] = useState("");
    const [errorProgrammeFormation, setErrorProgrammeFormation] = useState("");
    const [errorAxeStrategique, setErrorAxeStrategique] = useState("");
    
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (formation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.formation'));
            setTitreFr(formation.titreFr);
            setTitreEn(formation.titreEn); 
            setDescriptionFr(formation?.descriptionFr || "");
            setDescriptionEn(formation?.descriptionEn || "");
            setProgrammeFormation(formation.programmeFormation);
            setAxeStrategique(formation.axeStrategique);
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.formation'));
            setTitreFr("");
            setTitreEn("");
            setDescriptionFr("");
            setDescriptionEn("");
            setAxeStrategique(undefined);
            setProgrammeFormation(undefined);
            
        }


        if (isFirstRender) {
            setErrorTitreFr("");
            setErrorTitreEn("");
            setErrorProgrammeFormation("")
            setErrorAxeStrategique("")
            setIsFirstRender(false);
        }
    }, [formation, isFirstRender, t]);

    const closeModal = () => {
        setErrorTitreFr("");
        setErrorTitreEn("");
        setErrorProgrammeFormation("")
        setErrorAxeStrategique("")
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    
    const handleAxeStrategiqueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAxeStrategiqueNom = e.target.value;
        var selectedAxeStrategique = null;

        if(!selectedAxeStrategiqueNom){
            setAxeStrategique(undefined);
            return;
        } 
        if (lang === 'fr') {
            selectedAxeStrategique = axeStrategiques.find(axeStrategique => axeStrategique.nomFr === selectedAxeStrategiqueNom);
        }
        else {
            selectedAxeStrategique = axeStrategiques.find(axeStrategique => axeStrategique.nomEn === selectedAxeStrategiqueNom);
        }

        if (selectedAxeStrategique) {
            setAxeStrategique(selectedAxeStrategique);
            setErrorAxeStrategique("")
        }
    };

    const handleProgrammeFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProgrammeFormationNom = e.target.value;
        var selectedProgrammeFormation = null;

        if(!selectedProgrammeFormationNom){
            setProgrammeFormation(undefined);
            return;
        } 
        selectedProgrammeFormation = programmeFormations.find(programmeFormation => programmeFormation.annee.toString() === selectedProgrammeFormationNom);
        
        

        if (selectedProgrammeFormation) {
            setProgrammeFormation(selectedProgrammeFormation);
            setErrorProgrammeFormation("")
        }
        
    };

    

    



    const handleCreateFormation = async () => {
        if (!titreFr || !titreEn || !programmeFormation || !axeStrategique) {
            if (!titreFr) {
                setErrorTitreFr(t('error.titre_fr'));
            }
            if (!titreEn) {
                setErrorTitreEn(t('error.titre_en'));
            }

            if(!axeStrategique){
                setErrorAxeStrategique(t("error.axe_strategique"))
            }

            if(!programmeFormation){
                setErrorProgrammeFormation(t('error.programme_formation'))
            }
            
            
            return;
        }

       
        if (!formation) {
            setIsLoading(true)
            await createFormation(
                {
                    titreFr,
                    titreEn,
                    descriptionEn,
                    descriptionFr,
                    programmeFormation,
                    axeStrategique
                }, lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createFormationSlice({

                        formation: {
                            _id: e.data._id,
                            titreFr: e.data.titreFr,
                            titreEn: e.data.titreEn,
                            descriptionEn: e.data.descriptionEn,
                            descriptionFr: e.data.descriptionFr,
                            axeStrategique:e.data.axeStrategique,
                            programmeFormation:e.data.programmeFormation,
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
                setIsLoading(false);
            })

        } else {
            setIsLoading(true)
            await updateFormation(
                {
                    _id:formation._id,
                    titreFr,
                    titreEn,
                    descriptionEn,
                    descriptionFr,
                    programmeFormation,
                    axeStrategique
                }, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateFormationSlice({
                            id: e.data._id,
                            formationData: {
                                 _id: e.data._id,
                                titreFr: e.data.titreFr,
                                titreEn: e.data.titreEn,
                                descriptionEn: e.data.descriptionEn,
                                descriptionFr: e.data.descriptionFr,
                                axeStrategique:e.data.axeStrategique,
                                programmeFormation:e.data.programmeFormation,
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
                handleConfirm={handleCreateFormation}
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
                    onChange={(e) => setTitreEn(e.target.value)}
                />
                {errorTitreEn && <p className="text-red-500">{errorTitreEn}</p>}
                
                <label>{t('label.axe_strategique')}</label><label className="text-red-500"> *</label>
                <select
                    value={axeStrategique ? (lang === 'fr' ? axeStrategique.nomFr : axeStrategique.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.axe_strategique')}
                    onChange={handleAxeStrategiqueChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.axe_strategique')}</option>
                    {axeStrategiques.map(axeStrategique => (
                        <option key={axeStrategique._id} value={(lang === 'fr' ? axeStrategique.nomFr : axeStrategique.nomEn)}>{(lang === 'fr' ? axeStrategique.nomFr : axeStrategique.nomEn)}</option>
                    ))}
                </select>
                {errorAxeStrategique && <p className="text-red-500">{errorAxeStrategique}</p>}
                <label>{t('label.programme_formation')}</label><label className="text-red-500"> *</label>
                <select
                    value={programmeFormation ?programmeFormation.annee.toString(): t('select_par_defaut.selectionnez') + t('select_par_defaut.programme_formation')}
                    onChange={handleProgrammeFormationChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.programme_formation')}</option>
                    {programmeFormations.map(programmeFormation => (
                        <option key={programmeFormation._id} value={programmeFormation.annee.toString()}>{programmeFormation.annee.toString()}</option>
                    ))}
                </select>
                {errorProgrammeFormation && <p className="text-red-500">{errorProgrammeFormation}</p>}
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;
