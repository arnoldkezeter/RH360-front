import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { formatDateForInput } from '../../../../../fonctions/fonction';
import FilterList from '../../../../ui/AutoComplete';
import { createThemeFormation, updateThemeFormation } from '../../../../../services/elaborations/themeFormationAPI';
import { createThemeFormationSlice, updateThemeFormationSlice } from '../../../../../_redux/features/elaborations/themeFormationSlice';
import { getFormationForDropDown } from '../../../../../services/elaborations/formationAPI';
import { searchPosteDeTravail } from '../../../../../services/settings/posteDeTravailAPI';
import { SearchSelectComponent } from '../../../../ui/SearchSelectComponent';
import { searchUtilisateur } from '../../../../../services/utilisateurs/utilisateurAPI';


function FormCreateUpdate({ themeFormation }: { themeFormation: ThemeFormation | null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {data:{programmeFormations}} = useSelector((state: RootState) => state.programmeFormationSlice)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const [filteredFormations, setFilteredFormations]=useState<Formation[]>([])

    const dispatch = useDispatch();
    const [titreFr, setTitreFr] = useState("");
    const [titreEn, setTitreEn] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [responsable, setResponsable] = useState<Utilisateur>();
    const [programmeFormation, setProgrammeFormation] = useState<ProgrammeFormation>();
    const [formation, setFormation] = useState<Formation>();
    const [selectedPublicCible, setSelectedPublicCible] = useState<PosteDeTravail[]>([]);
    
    

    const [errorTitreFr, setErrorTitreFr] = useState("");
    const [errorTitreEn, setErrorTitreEn] = useState("");
    const [errorProgrammeFormation, setErrorProgrammeFormation] = useState("");
    const [errorFormation, setErrorFormation] = useState("");
    const [errorDateDebut, setErrorDateDebut] = useState("");
    const [errorDateFin, setErrorDateFin] = useState("")
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (themeFormation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.theme_formation'));
            
            setTitreFr(themeFormation.titreFr);
            setTitreEn(themeFormation.titreEn);
            setDateDebut(formatDateForInput(themeFormation.dateDebut) || "");
            setDateFin(formatDateForInput(themeFormation.dateFin) || "");
            setResponsable(themeFormation.responsable);
            setProgrammeFormation(themeFormation.formation.programmeFormation)
            setFormation(themeFormation.formation)
            setSelectedPublicCible(themeFormation?.publicCible || [])
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.theme_formation'));
            
            setTitreFr("");
            setTitreEn("");
            setDateDebut("");
            setDateFin("");
            setProgrammeFormation(undefined);
            setFormation(undefined)
            setResponsable(undefined);
            setSelectedPublicCible([]);
            
        }


        if (isFirstRender) {
            setErrorTitreFr("");
            setErrorTitreEn("")
            setErrorDateDebut("")
            setErrorDateFin("")
            setErrorProgrammeFormation("");
            setErrorFormation("");
            
            setIsFirstRender(false);
        }
    }, [themeFormation, isFirstRender, t]);

    const closeModal = () => {
        setErrorTitreFr("");
        setErrorTitreEn("")
        setErrorDateDebut("")
        setErrorDateFin("")
        setErrorProgrammeFormation("");
        setErrorFormation("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    

    // Effets pour les dépendances
    useEffect(() => {
        if (programmeFormation && programmeFormation._id) {
            getFormationForDropDown({ programmeId: programmeFormation._id, lang }).then((data) =>
                setFilteredFormations(data.formations)
            );
        }
    }, [programmeFormation]);

    
    const handleProgrammeFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProgrammeFormationTitreFr = e.target.value;
        var selectedProgrammeFormation = null;

        if(!selectedProgrammeFormationTitreFr){
            setProgrammeFormation(undefined);
            setFilteredFormations([]);
            setFormation(undefined)
            return;
        } 
        
        selectedProgrammeFormation = programmeFormations.find(programmeFormation => programmeFormation.annee.toString() === selectedProgrammeFormationTitreFr);

        if (selectedProgrammeFormation) {
            setProgrammeFormation(selectedProgrammeFormation);
        }
        setErrorProgrammeFormation("")
    };

    const handleFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFormationTitreFr = e.target.value;
        var selectedFormation = null;

        if(!selectedFormationTitreFr){
            setFormation(undefined)
            return;
        } 

        if (lang === 'fr') {
            selectedFormation = filteredFormations.find(formation => formation.titreFr === selectedFormationTitreFr);

        }
        else {
            selectedFormation = filteredFormations.find(formation => formation.titreEn === selectedFormationTitreFr);
        }

        if (selectedFormation) {
            setFormation(selectedFormation);
        }
        setErrorFormation("")
    };

    const handleResponsableSelect = (selected: Utilisateur | string) => {
        if (typeof selected === "string") return
        if(selected){
            setResponsable(selected)
        }
       
    };


    const onSearchPoste = async (search: string) => {
        const data = await searchPosteDeTravail({searchString: search, lang});
        return data?.posteDeTravails || [];
    };

    const onSearchResponsable = async (search: string) => {
        const data = await searchUtilisateur({searchString: search, lang});
        return data?.utilisateurs || [];
    };


    const handleCreateThemeFormation = async () => {
        if (!titreFr || !titreEn || !dateDebut || !dateFin || !programmeFormation || !formation) {
            if (!titreFr) {
                setErrorTitreFr(t('error.titre_fr'));
            }

            if(!titreEn){
                setErrorTitreEn(t("error.titre_en"))
            }

            if (!dateDebut) {
                setErrorDateDebut(t('error.date_debut'));
            }

            if (!dateFin) {
                setErrorDateFin(t('error.date_fin'));
            }

            
            
            if(!programmeFormation){
                setErrorProgrammeFormation(t('error.programme_formation'))
            }
            
            if(!formation){
                setErrorFormation(t('error.formation'))
            }

            return;
        }

        if (!themeFormation) {
            setIsLoading(true)
            await createThemeFormation(
                {
                    titreFr,
                    titreEn,
                    dateDebut,
                    dateFin,
                    responsable,
                    formation,
                    publicCible:selectedPublicCible
                }, lang
            ).then((e: ReponseApiPros) => {
                
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createThemeFormationSlice({

                        themeFormation: {
                            _id: e.data._id,
                            titreFr: e.data.titreFr,
                            titreEn: e.data.titreEn,
                            dateDebut: e.data.dateDebut,
                            dateFin: e.data.dateFin,
                            responsable: e.data.reponsable,
                            formation: e.data.formation,
                            publicCible:e.data.publicCible,
                            duree:e.data.duree
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
            await updateThemeFormation(
                {
                    _id: themeFormation._id,
                    titreFr,
                    titreEn,
                    dateDebut,
                    dateFin,
                    responsable,
                    formation,
                    publicCible:selectedPublicCible
                }, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateThemeFormationSlice({
                            id: e.data._id,
                            themeFormationData: {
                                _id: e.data._id,
                                titreFr: e.data.titreFr,
                                titreEn: e.data.titreEn,
                                dateDebut: e.data.dateDebut,
                                dateFin: e.data.dateFin,
                                responsable: e.data.responsable,
                                formation: e.data.formation,
                                publicCible:e.data.publicCible,
                                duree:e.data.duree
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
                handleConfirm={handleCreateThemeFormation}
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
                    onChange={(e) => {setTitreEn(e.target.value); setErrorTitreEn("")}}
                />
                {errorTitreEn && <p className="text-red-500" >{errorTitreEn}</p>}
                <label>{t('label.date_debut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateDebut}
                    onChange={(e) => {setDateDebut(e.target.value); setErrorDateDebut("")}}
                />
                {errorDateDebut && <p className="text-red-500" >{errorDateDebut}</p>}
                 <label>{t('label.date_fin')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateFin}
                    onChange={(e) => {setDateFin(e.target.value); setErrorDateFin("")}}
                />
                {errorDateFin && <p className="text-red-500" >{errorDateFin}</p>}

                <label>{t('label.programme_formation')}</label><label className="text-red-500"> *</label>
                <select
                    value={programmeFormation ? (programmeFormation.annee) : t('select_par_defaut.selectionnez') + t('select_par_defaut.programme_formation')}
                    onChange={handleProgrammeFormationChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.programme_formation')}</option>
                    {programmeFormations.map(programmeFormation => (
                        <option key={programmeFormation._id} value={programmeFormation.annee}>{programmeFormation.annee}</option>
                    ))}
                </select>
                {errorProgrammeFormation && <p className="text-red-500">{errorProgrammeFormation}</p>}
                <label>{t('label.formation')}</label><label className="text-red-500"> *</label>
                <select
                    value={formation ? (lang === 'fr' ? formation.titreFr : formation.titreEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.formation')}
                    onChange={handleFormationChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.formation')}</option>
                    {filteredFormations.map(formation => (
                        <option key={formation._id} value={(lang === 'fr' ? formation.titreFr : formation.titreEn)}>{(lang === 'fr' ? formation.titreFr : formation.titreEn)}</option>
                    ))}
                </select>
                {errorFormation && <p className="text-red-500">{errorFormation}</p>}
                <label>{t('label.responsable')}</label>
                <FilterList
                    items={[]}
                    placeholder={t('recherche.rechercher')+t('recherche.responsable')}
                    displayProperty={(item) => `${item.nom} ${item?.prenom || ""}`}
                    onSelect={handleResponsableSelect}
                    enableBackendSearch={true}
                    onSearch={onSearchResponsable}
                    searchDelay={300}
                    minSearchLength={2}
                    defaultValue={responsable}
                    noResultsMessage={t('label.aucun_responsable')}
                    loadingMessage={t('label.recherche_responsable')}
                />
                
                <label>{t('label.public_cible')}</label>
                <SearchSelectComponent<PosteDeTravail>
                    onSearch={onSearchPoste}
                    selectedItems={selectedPublicCible}
                    onSelectionChange={setSelectedPublicCible}
                    placeholder={t('recherche.rechercher')+t('recherche.poste_de_travail')}
                    displayField={lang?"nomFr":"nomEn"}
                    searchDelay={300}
                    minSearchLength={2}
                    noResultsMessage={t('label.aucun_poste')}
                    loadingMessage={t('label.recherche_poste')}
                    textDebutCaractere={t('label.tapez_car_deb')}
                    textFinCaractere={t('label.tapez_car_fin')}
                />
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;
