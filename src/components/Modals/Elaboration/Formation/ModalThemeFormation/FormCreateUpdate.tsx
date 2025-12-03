import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { formatDateForInput } from '../../../../../fonctions/fonction';
import FilterList from '../../../../ui/AutoComplete';
import { createThemeFormation, updateThemeFormation } from '../../../../../services/elaborations/themeFormationAPI';
import { createThemeFormationSlice, updateThemeFormationSlice } from '../../../../../_redux/features/elaborations/themeFormationSlice';
import { getFormationForDropDown } from '../../../../../services/elaborations/formationAPI';
import { SearchSelectComponent } from '../../../../ui/SearchSelectComponent';
import { searchUtilisateur } from '../../../../../services/utilisateurs/utilisateurAPI';
import { searchPosteDeTravailByFamille } from '../../../../../services/settings/posteDeTravailAPI';
import { searchStructureByPoste } from '../../../../../services/settings/structureAPI';
import { searchServiceByStructure } from '../../../../../services/settings/serviceAPI';
import { X, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { searchFamilleMetier } from '../../../../../services/elaborations/familleMetierAPI';

interface PublicCibleUIState {
    familleMetier: FamilleMetier;
    postes: {
        poste: PosteDeTravail;
        allStructures: boolean; // true = toutes les structures
        structures: {
            structure: Structure;
            allServices: boolean; // true = tous les services
            services: Service[];
        }[];
    }[];
    allPostes: boolean; // true = toute la famille (pas de restriction)
}

function FormCreateUpdate({ themeFormation, isParticipant }: { themeFormation: ThemeFormation | undefined |null, isParticipant:boolean }) {
    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { programmeFormations } } = useSelector((state: RootState) => state.programmeFormationSlice);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);

    const dispatch = useDispatch();
    const [titreFr, setTitreFr] = useState("");
    const [titreEn, setTitreEn] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [responsable, setResponsable] = useState<Utilisateur>();
    const [programmeFormation, setProgrammeFormation] = useState<ProgrammeFormation>();
    const [formation, setFormation] = useState<Formation>();

    // ✅ NOUVEAU: État pour le public cible hiérarchique
    const [publicCibleList, setPublicCibleList] = useState<PublicCibleUIState[]>([]);
    const [expandedFamilles, setExpandedFamilles] = useState<Set<string>>(new Set());

    const [errorTitreFr, setErrorTitreFr] = useState("");
    const [errorTitreEn, setErrorTitreEn] = useState("");
    const [errorProgrammeFormation, setErrorProgrammeFormation] = useState("");
    const [errorFormation, setErrorFormation] = useState("");
    const [errorDateDebut, setErrorDateDebut] = useState("");
    const [errorDateFin, setErrorDateFin] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    const [currentFamilleId, setCurrentFamilleId] = useState<string>("");
    const [currentPosteId, setCurrentPosteId] = useState<string>("");
    const [currentStructureId, setCurrentStructureId] = useState<string>("");

    // ✅ Conversion des données backend vers l'UI
    const convertBackendToUI = (publicCible?: FamilleMetierRestriction[]): PublicCibleUIState[] => {
        if (!publicCible) return [];

        return publicCible.map(fam => ({
            familleMetier: fam.familleMetier,
            allPostes: !fam.postes || fam.postes.length === 0,
            postes: (fam.postes || []).map(pos => ({
                poste: pos.poste,
                allStructures: !pos.structures || pos.structures.length === 0,
                structures: (pos.structures || []).map(str => ({
                    structure: str.structure,
                    allServices: !str.services || str.services.length === 0,
                    services: (str.services || []).map(srv => srv.service)
                }))
            }))
        }));
    };

    // ✅ Conversion de l'UI vers le format backend
    const convertUIToBackend = (): FamilleMetierInput[] => {
        return publicCibleList.map(fam => ({
            familleMetier: fam.familleMetier._id!,
            postes: fam.allPostes ? undefined : fam.postes.map(pos => ({
                poste: pos.poste._id!,
                structures: pos.allStructures ? undefined : pos.structures.map(str => ({
                    structure: str.structure._id!,
                    services: str.allServices ? undefined : str.services.map(srv => ({
                        service: srv._id!
                    }))
                }))
            }))
        }));
    };

    useEffect(() => {
        if (themeFormation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.theme_formation'));
            setTitreFr(themeFormation.titreFr);
            setTitreEn(themeFormation.titreEn);
            setDateDebut(formatDateForInput(themeFormation.dateDebut) || "");
            setDateFin(formatDateForInput(themeFormation.dateFin) || "");
            setResponsable(themeFormation.responsable);
            setProgrammeFormation(themeFormation.formation.programmeFormation);
            setFormation(themeFormation.formation);
            setPublicCibleList(convertBackendToUI(themeFormation.publicCible));
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.theme_formation'));
            setTitreFr("");
            setTitreEn("");
            setDateDebut("");
            setDateFin("");
            setProgrammeFormation(undefined);
            setFormation(undefined);
            setResponsable(undefined);
            setPublicCibleList([]);
        }

        if (isFirstRender) {
            setErrorTitreFr("");
            setErrorTitreEn("");
            setErrorDateDebut("");
            setErrorDateFin("");
            setErrorProgrammeFormation("");
            setErrorFormation("");
            setIsFirstRender(false);
        }
    }, [themeFormation, isFirstRender, t]);

    const closeModal = () => {
        setErrorTitreFr("");
        setErrorTitreEn("");
        setErrorDateDebut("");
        setErrorDateFin("");
        setErrorProgrammeFormation("");
        setErrorFormation("");
        setCurrentFamilleId("");
        setCurrentPosteId("");
        setCurrentStructureId("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    useEffect(() => {
        if (programmeFormation && programmeFormation._id) {
            getFormationForDropDown({ programmeId: programmeFormation._id, lang }).then((data) =>
                setFilteredFormations(data.formations)
            );
        }
    }, [programmeFormation]);

    const handleProgrammeFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProgrammeFormationTitreFr = e.target.value;
        let selectedProgrammeFormation = null;

        if (!selectedProgrammeFormationTitreFr) {
            setProgrammeFormation(undefined);
            setFilteredFormations([]);
            setFormation(undefined);
            return;
        }

        selectedProgrammeFormation = programmeFormations.find(
            programmeFormation => programmeFormation.annee.toString() === selectedProgrammeFormationTitreFr
        );

        if (selectedProgrammeFormation) {
            setProgrammeFormation(selectedProgrammeFormation);
        }
        setErrorProgrammeFormation("");
    };

    const handleFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFormationTitreFr = e.target.value;
        let selectedFormation = null;

        if (!selectedFormationTitreFr) {
            setFormation(undefined);
            return;
        }

        if (lang === 'fr') {
            selectedFormation = filteredFormations.find(formation => formation.titreFr === selectedFormationTitreFr);
        } else {
            selectedFormation = filteredFormations.find(formation => formation.titreEn === selectedFormationTitreFr);
        }

        if (selectedFormation) {
            setFormation(selectedFormation);
        }
        setErrorFormation("");
    };

    const handleResponsableSelect = (selected: Utilisateur | string) => {
        if (typeof selected === "string") return;
        if (selected) {
            setResponsable(selected);
        }
    };

    // ✅ Fonctions de recherche
    const onSearchFamilleMetier = async (search: string) => {
        const data = await searchFamilleMetier({ searchString: search, lang });
        return data?.familleMetiers || [];
    };

    const onSearchPoste = async (search: string) => {
        const data = await searchPosteDeTravailByFamille({familleId:currentFamilleId, searchString: search, lang });
        return data?.posteDeTravails || [];
    };

    const onSearchStructure = async (search: string) => {
        const data = await searchStructureByPoste({posteId:currentPosteId, searchString: search, lang });
        return data?.structures || [];
    };

    const onSearchService = async (search: string) => {
        const data = await searchServiceByStructure({structureId:currentStructureId, searchString: search, lang });
        return data?.services || [];
    };

    const onSearchResponsable = async (search: string) => {
        const data = await searchUtilisateur({ searchString: search, lang });
        return data?.utilisateurs || [];
    };

    // ✅ Gestion du public cible
    const addFamilleMetier = (famille: FamilleMetier) => {
        // Vérifier si déjà ajoutée
        if (publicCibleList.some(f => f.familleMetier._id === famille._id)) {
            createToast(t('error.famille_deja_ajoutee'), '', 1);
            return;
        }
        setCurrentFamilleId(famille._id!)
        setPublicCibleList([
            ...publicCibleList,
            {
                familleMetier: famille,
                allPostes: true,
                postes: []
            }
        ]);
        setExpandedFamilles(prev => new Set([...prev, famille._id!]));
    };

    const removeFamilleMetier = (familleId: string) => {
        setPublicCibleList(publicCibleList.filter(f => f.familleMetier._id !== familleId));
        setExpandedFamilles(prev => {
            const next = new Set(prev);
            next.delete(familleId);
            return next;
        });
    };

    const toggleAllPostes = (familleId: string) => {
        setCurrentFamilleId(familleId)
        setPublicCibleList(publicCibleList.map(fam => {
            if (fam.familleMetier._id === familleId) {
                return {
                    ...fam,
                    allPostes: !fam.allPostes,
                    postes: !fam.allPostes ? [] : fam.postes
                };
            }
            return fam;
        }));
    };

    const addPosteToFamille = (familleId: string, poste: PosteDeTravail) => {
        setPublicCibleList(publicCibleList.map(fam => {
            if (fam.familleMetier._id === familleId) {
                // Vérifier si le poste appartient à cette famille
                const appartient = poste.famillesMetier.some(fm => fm._id === familleId);
                if (!appartient) {
                    createToast(t('error.poste_pas_dans_famille'), '', 2);
                    return fam;
                }

                // Vérifier si déjà ajouté
                if (fam.postes.some(p => p.poste._id === poste._id)) {
                    return fam;
                }
                setCurrentPosteId(poste._id!)
                return {
                    ...fam,
                    allPostes: false,
                    postes: [
                        ...fam.postes,
                        {
                            poste,
                            allStructures: true,
                            structures: []
                        }
                    ]
                };
            }
            return fam;
        }));
    };

    const removePosteFromFamille = (familleId: string, posteId: string) => {
        setPublicCibleList(publicCibleList.map(fam => {
            if (fam.familleMetier._id === familleId) {
                return {
                    ...fam,
                    postes: fam.postes.filter(p => p.poste._id !== posteId)
                };
            }
            return fam;
        }));
    };

    const toggleAllStructures = (familleId: string, posteId: string) => {
        setCurrentFamilleId(familleId);
        setCurrentPosteId(posteId);
        setPublicCibleList(publicCibleList.map(fam => {
            if (fam.familleMetier._id === familleId) {
                return {
                    ...fam,
                    postes: fam.postes.map(pos => {
                        if (pos.poste._id === posteId) {
                            return {
                                ...pos,
                                allStructures: !pos.allStructures,
                                structures: !pos.allStructures ? [] : pos.structures
                            };
                        }
                        return pos;
                    })
                };
            }
            return fam;
        }));
    };

    const addStructureToPoste = (familleId: string, posteId: string, structure: Structure) => {
        setPublicCibleList(publicCibleList.map(fam => {
            if (fam.familleMetier._id === familleId) {
                return {
                    ...fam,
                    postes: fam.postes.map(pos => {
                        if (pos.poste._id === posteId) {
                            // Vérifier si déjà ajoutée
                            if (pos.structures.some(s => s.structure._id === structure._id)) {
                                return pos;
                            }
                            setCurrentStructureId(structure._id!)
                            return {
                                ...pos,
                                allStructures: false,
                                structures: [
                                    ...pos.structures,
                                    {
                                        structure,
                                        allServices: true,
                                        services: []
                                    }
                                ]
                            };
                        }
                        return pos;
                    })
                };
            }
            return fam;
        }));
    };

    const removeStructureFromPoste = (familleId: string, posteId: string, structureId: string) => {
        setPublicCibleList(publicCibleList.map(fam => {
            if (fam.familleMetier._id === familleId) {
                return {
                    ...fam,
                    postes: fam.postes.map(pos => {
                        if (pos.poste._id === posteId) {
                            return {
                                ...pos,
                                structures: pos.structures.filter(s => s.structure._id !== structureId)
                            };
                        }
                        return pos;
                    })
                };
            }
            return fam;
        }));
    };

    const toggleAllServices = (familleId: string, posteId: string, structureId: string) => {
        setCurrentFamilleId(familleId);
        setCurrentPosteId(posteId);
        setCurrentStructureId(structureId);
        setPublicCibleList(publicCibleList.map(fam => {
            if (fam.familleMetier._id === familleId) {
                return {
                    ...fam,
                    postes: fam.postes.map(pos => {
                        if (pos.poste._id === posteId) {
                            return {
                                ...pos,
                                structures: pos.structures.map(str => {
                                    if (str.structure._id === structureId) {
                                        return {
                                            ...str,
                                            allServices: !str.allServices,
                                            services: !str.allServices ? [] : str.services
                                        };
                                    }
                                    return str;
                                })
                            };
                        }
                        return pos;
                    })
                };
            }
            return fam;
        }));
    };

    const addServiceToStructure = (familleId: string, posteId: string, structureId: string, service: Service) => {
        setPublicCibleList(publicCibleList.map(fam => {
            if (fam.familleMetier._id === familleId) {
                return {
                    ...fam,
                    postes: fam.postes.map(pos => {
                        if (pos.poste._id === posteId) {
                            return {
                                ...pos,
                                structures: pos.structures.map(str => {
                                    if (str.structure._id === structureId) {
                                        // Vérifier si le service appartient à cette structure
                                        if (service.structure._id !== structureId) {
                                            createToast(t('error.service_pas_dans_structure'), '', 2);
                                            return str;
                                        }

                                        // Vérifier si déjà ajouté
                                        if (str.services.some(s => s._id === service._id)) {
                                            return str;
                                        }

                                        return {
                                            ...str,
                                            allServices: false,
                                            services: [...str.services, service]
                                        };
                                    }
                                    return str;
                                })
                            };
                        }
                        return pos;
                    })
                };
            }
            return fam;
        }));
    };

    const removeServiceFromStructure = (familleId: string, posteId: string, structureId: string, serviceId: string) => {
        setPublicCibleList(publicCibleList.map(fam => {
            if (fam.familleMetier._id === familleId) {
                return {
                    ...fam,
                    postes: fam.postes.map(pos => {
                        if (pos.poste._id === posteId) {
                            return {
                                ...pos,
                                structures: pos.structures.map(str => {
                                    if (str.structure._id === structureId) {
                                        return {
                                            ...str,
                                            services: str.services.filter(s => s._id !== serviceId)
                                        };
                                    }
                                    return str;
                                })
                            };
                        }
                        return pos;
                    })
                };
            }
            return fam;
        }));
    };

    const toggleFamilleExpanded = (familleId: string) => {
        setExpandedFamilles(prev => {
            const next = new Set(prev);
            if (next.has(familleId)) {
                next.delete(familleId);
            } else {
                next.add(familleId);
            }
            return next;
        });
    };

    const handleCreateThemeFormation = async () => {
        if (!titreFr || !titreEn || !dateDebut || !dateFin || !programmeFormation || !formation) {
            if (!titreFr) setErrorTitreFr(t('error.titre_fr'));
            if (!titreEn) setErrorTitreEn(t("error.titre_en"));
            if (!dateDebut) setErrorDateDebut(t('error.date_debut'));
            if (!dateFin) setErrorDateFin(t('error.date_fin'));
            if (!programmeFormation) setErrorProgrammeFormation(t('error.programme_formation'));
            if (!formation) setErrorFormation(t('error.formation'));
            return;
        }

        const publicCibleInput = convertUIToBackend();

        if (!themeFormation) {
            setIsLoading(true);
            await createThemeFormation(
                {
                    titreFr,
                    titreEn,
                    dateDebut,
                    dateFin,
                    responsable: responsable?._id,
                    formation: formation._id||"",
                    publicCible: publicCibleInput
                }, lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createThemeFormationSlice({
                        themeFormation: e.data
                    }));
                    closeModal();
                } else {
                    createToast(e.message, '', 2);
                }
            }).catch((e) => {
                console.log(e);
                createToast(e.response.data.message, '', 2);
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(true);
            await updateThemeFormation(
                {
                    _id: themeFormation._id,
                    titreFr,
                    titreEn,
                    dateDebut,
                    dateFin,
                    responsable: responsable?._id,
                    formation: formation._id||"",
                    publicCible: publicCibleInput
                }, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateThemeFormationSlice({
                        id: e.data._id,
                        themeFormationData: e.data
                    }));
                    closeModal();
                } else {
                    createToast(e.message, '', 2);
                }
            }).catch((e) => {
                console.log(e);
                createToast(e.response.data.message, '', 2);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    };

    return (
        <CustomDialogModal
            title={modalTitle}
            isModalOpen={isModalOpen}
            isDelete={false}
            closeModal={closeModal}
            handleConfirm={handleCreateThemeFormation}
            isLoading={isLoading}
        >
            <div className="space-y-4">
                <div>
                    <label>{t('label.titre_fr')}<span className="text-red-500"> *</span></label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        disabled={isParticipant}
                        value={titreFr}
                        onChange={(e) => { setTitreFr(e.target.value); setErrorTitreFr(""); }}
                    />
                    {errorTitreFr && <p className="text-red-500 text-sm mt-1">{errorTitreFr}</p>}
                </div>

                <div>
                    <label>{t('label.titre_en')}<span className="text-red-500"> *</span></label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        value={titreEn}
                        disabled={isParticipant}
                        onChange={(e) => { setTitreEn(e.target.value); setErrorTitreEn(""); }}
                    />
                    {errorTitreEn && <p className="text-red-500 text-sm mt-1">{errorTitreEn}</p>}
                </div>

                <div>
                    <label>{t('label.date_debut')}<span className="text-red-500"> *</span></label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        disabled={isParticipant}
                        value={dateDebut}
                        onChange={(e) => { setDateDebut(e.target.value); setErrorDateDebut(""); }}
                    />
                    {errorDateDebut && <p className="text-red-500 text-sm mt-1">{errorDateDebut}</p>}
                </div>

                <div>
                    <label>{t('label.date_fin')}<span className="text-red-500"> *</span></label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        value={dateFin}
                        disabled={isParticipant}
                        onChange={(e) => { setDateFin(e.target.value); setErrorDateFin(""); }}
                    />
                    {errorDateFin && <p className="text-red-500 text-sm mt-1">{errorDateFin}</p>}
                </div>

                <div>
                    <label>{t('label.programme_formation')}<span className="text-red-500"> *</span></label>
                    <select
                        value={programmeFormation ? programmeFormation.annee : ""}
                        onChange={handleProgrammeFormationChange}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        disabled={isParticipant}
                    >
                        <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.programme_formation')}</option>
                        {programmeFormations.map(programmeFormation => (
                            <option key={programmeFormation._id} value={programmeFormation.annee}>
                                {programmeFormation.annee}
                            </option>
                        ))}
                    </select>
                    {errorProgrammeFormation && <p className="text-red-500 text-sm mt-1">{errorProgrammeFormation}</p>}
                </div>

                <div>
                    <label>{t('label.formation')}<span className="text-red-500"> *</span></label>
                    <select
                        value={formation ? (lang === 'fr' ? formation.titreFr : formation.titreEn) : ""}
                        onChange={handleFormationChange}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        disabled={isParticipant}
                    >
                        <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.formation')}</option>
                        {filteredFormations.map(formation => (
                            <option key={formation._id} value={(lang === 'fr' ? formation.titreFr : formation.titreEn)}>
                                {(lang === 'fr' ? formation.titreFr : formation.titreEn)}
                            </option>
                        ))}
                    </select>
                    {errorFormation && <p className="text-red-500 text-sm mt-1">{errorFormation}</p>}
                </div>

                {!isParticipant && (<div>
                    <label>{t('label.responsable')}</label>
                    <FilterList
                        items={[]}
                        placeholder={t('recherche.rechercher') + t('recherche.responsable')}
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
                </div>)}

                {/* ✅ NOUVEAU: Section Public Cible Hiérarchique */}
                <div className="border-t pt-4">
                    <label className="font-semibold text-lg mb-2 block">{t('label.public_cible')}</label>
                    
                    {/* Recherche de famille de métier */}
                    <SearchSelectComponent<FamilleMetier>
                        onSearch={onSearchFamilleMetier}
                        selectedItems={[]}
                        onSelectionChange={(items) => {
                            if (items.length > 0) {
                                addFamilleMetier(items[0]);
                            }
                        }}
                        placeholder={t('recherche.ajouter_famille_metier')}
                        displayField={lang === 'fr' ? "nomFr" : "nomEn"}
                        searchDelay={300}
                        minSearchLength={2}
                        noResultsMessage={t('label.aucune_famille')}
                        loadingMessage={t('label.recherche_famille')}
                        textDebutCaractere={t('label.tapez_car_deb')}
                        textFinCaractere={t('label.tapez_car_fin')}
                    />

                    {/* Liste des familles sélectionnées */}
                    <div className="mt-4 space-y-3">
                        {publicCibleList.map((famItem) => (
                            <div key={famItem.familleMetier._id} className="border rounded-lg p-4 bg-[#eff6ff]">
                                {/* En-tête de la famille */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleFamilleExpanded(famItem.familleMetier._id!)}
                                            className="text-[#4b5563] hover:text-[#1f2937]"
                                        >
                                            {expandedFamilles.has(famItem.familleMetier._id!) ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </button>
                                        <span className="font-semibold text-[#1e40af]">
                                            {lang === 'fr' ? famItem.familleMetier.nomFr : famItem.familleMetier.nomEn}
                                        </span>
                                        {famItem.allPostes && (
                                            <span className="text-xs bg-[#a7f3d0] text-[#166534] px-2 py-1 rounded">
                                                {t('label.toute_famille')}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFamilleMetier(famItem.familleMetier._id!)}
                                        className="text-[#dc2626] hover:text-[#991b1b]"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Toggle toute la famille */}
                                <div className="mb-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={famItem.allPostes}
                                            onChange={() => toggleAllPostes(famItem.familleMetier._id!)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">{t('label.cibler_toute_famille')}</span>
                                    </label>
                                </div>

                                {/* Détails étendus */}
                                {expandedFamilles.has(famItem.familleMetier._id!) && !famItem.allPostes && (
                                    <div className="ml-4 space-y-3 border-l-2 border-[#93c5fd] pl-4">
                                        {/* Recherche de poste */}
                                        <SearchSelectComponent<PosteDeTravail>
                                            onSearch={onSearchPoste}
                                            selectedItems={[]}
                                            onSelectionChange={(items) => {
                                                if (items.length > 0) {
                                                    addPosteToFamille(famItem.familleMetier._id!, items[0]);
                                                }
                                            }}
                                            placeholder={t('recherche.ajouter_poste')}
                                            displayField={lang === 'fr' ? "nomFr" : "nomEn"}
                                            searchDelay={300}
                                            minSearchLength={2}
                                            noResultsMessage={t('label.aucun_poste')}
                                            loadingMessage={t('label.recherche_poste')}
                                            textDebutCaractere={t('label.tapez_car_deb')}
                                            textFinCaractere={t('label.tapez_car_fin')}
                                        />

                                        {/* Liste des postes */}
                                        {famItem.postes.map((posteItem) => (
                                            <div key={posteItem.poste._id} className="border rounded p-3 bg-[#fffbeb]">
                                                {/* En-tête du poste */}
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-[#b45309]">
                                                            {lang === 'fr' ? posteItem.poste.nomFr : posteItem.poste.nomEn}
                                                        </span>
                                                        {posteItem.allStructures && (
                                                            <span className="text-xs bg-[#a7f3d0] text-[#166534] px-2 py-1 rounded">
                                                                {t('label.toutes_structures')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePosteFromFamille(famItem.familleMetier._id!, posteItem.poste._id!)}
                                                        className="text-[#dc2626] hover:text-[#991b1b]"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Toggle toutes les structures */}
                                                <div className="mb-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={posteItem.allStructures}
                                                            onChange={() => toggleAllStructures(famItem.familleMetier._id!, posteItem.poste._id!)}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm">{t('label.toutes_structures_poste')}</span>
                                                    </label>
                                                </div>

                                                {/* Structures */}
                                                {!posteItem.allStructures && (
                                                    <div className="ml-4 space-y-2 border-l-2 border-[#fcd34d] pl-3">
                                                        {/* Recherche de structure */}
                                                        <SearchSelectComponent<Structure>
                                                            onSearch={onSearchStructure}
                                                            selectedItems={[]}
                                                            onSelectionChange={(items) => {
                                                                if (items.length > 0) {
                                                                    addStructureToPoste(famItem.familleMetier._id!, posteItem.poste._id!, items[0]);
                                                                }
                                                            }}
                                                            placeholder={t('recherche.ajouter_structure')}
                                                            displayField={lang === 'fr' ? "nomFr" : "nomEn"}
                                                            searchDelay={300}
                                                            minSearchLength={2}
                                                            noResultsMessage={t('label.aucune_structure')}
                                                            loadingMessage={t('label.recherche_structure')}
                                                            textDebutCaractere={t('label.tapez_car_deb')}
                                                            textFinCaractere={t('label.tapez_car_fin')}
                                                        />

                                                        {/* Liste des structures */}
                                                        {posteItem.structures.map((structureItem) => (
                                                            <div key={structureItem.structure._id} className="border rounded p-2 bg-[#f5f3ff]">
                                                                {/* En-tête de la structure */}
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium text-[#6b21a8] text-sm">
                                                                            {lang === 'fr' ? structureItem.structure.nomFr : structureItem.structure.nomEn}
                                                                        </span>
                                                                        {structureItem.allServices && (
                                                                            <span className="text-xs bg-[#a7f3d0] text-[#166534] px-2 py-1 rounded">
                                                                                {t('label.tous_services')}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeStructureFromPoste(famItem.familleMetier._id!, posteItem.poste._id!, structureItem.structure._id!)}
                                                                        className="text-[#dc2626] hover:text-[#991b1b]"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>

                                                                {/* Toggle tous les services */}
                                                                <div className="mb-2">
                                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={structureItem.allServices}
                                                                            onChange={() => toggleAllServices(famItem.familleMetier._id!, posteItem.poste._id!, structureItem.structure._id!)}
                                                                            className="w-4 h-4"
                                                                        />
                                                                        <span className="text-xs">{t('label.tous_services_structure')}</span>
                                                                    </label>
                                                                </div>

                                                                {/* Services */}
                                                                {!structureItem.allServices && (
                                                                    <div className="ml-4 space-y-2">
                                                                        {/* Recherche de service */}
                                                                        <SearchSelectComponent<Service>
                                                                            onSearch={onSearchService}
                                                                            selectedItems={[]}
                                                                            onSelectionChange={(items) => {
                                                                                if (items.length > 0) {
                                                                                    addServiceToStructure(famItem.familleMetier._id!, posteItem.poste._id!, structureItem.structure._id!, items[0]);
                                                                                }
                                                                            }}
                                                                            placeholder={t('recherche.ajouter_service')}
                                                                            displayField={lang === 'fr' ? "nomFr" : "nomEn"}
                                                                            searchDelay={300}
                                                                            minSearchLength={2}
                                                                            noResultsMessage={t('label.aucun_service')}
                                                                            loadingMessage={t('label.recherche_service')}
                                                                            textDebutCaractere={t('label.tapez_car_deb')}
                                                                            textFinCaractere={t('label.tapez_car_fin')}
                                                                        />

                                                                        {/* Liste des services */}
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {structureItem.services.map((service) => (
                                                                                <div
                                                                                    key={service._id}
                                                                                    className="flex items-center bg-purple-200 text-[#581C87] px-2 py-1 rounded text-xs"
                                                                                >
                                                                                    <span>{lang === 'fr' ? service.nomFr : service.nomEn}</span>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => removeServiceFromStructure(famItem.familleMetier._id!, posteItem.poste._id!, structureItem.structure._id!, service._id!)}
                                                                                        className="ml-2 text-[#dc2626] hover:text-[#991b1b]"
                                                                                    >
                                                                                        <X className="w-3 h-3" />
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Résumé du public cible */}
                    {publicCibleList.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
                            <strong>{t('label.resume_public_cible')}: </strong>
                            {publicCibleList.map((fam, idx) => {
                                const famNom = lang === 'fr' ? fam.familleMetier.nomFr : fam.familleMetier.nomEn;
                                if (fam.allPostes) {
                                    return (
                                        <span key={idx}>
                                            {idx > 0 && ', '}
                                            <strong>{famNom}</strong> ({t('label.complete')})
                                        </span>
                                    );
                                }
                                const postesCount = fam.postes.length;
                                return (
                                    <span key={idx}>
                                        {idx > 0 && ', '}
                                        <strong>{famNom}</strong> ({postesCount} {t('label.poste_s')})
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </CustomDialogModal>
    );
}

export default FormCreateUpdate;