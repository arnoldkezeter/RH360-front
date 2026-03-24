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
import { SearchSelectComponent } from '../../../../ui/MultipleSearchSelectedComponent';
import { searchUtilisateur } from '../../../../../services/utilisateurs/utilisateurAPI';
import { searchPosteDeTravail, searchPosteDeTravailByFamille } from '../../../../../services/settings/posteDeTravailAPI';
import { searchStructureByPoste } from '../../../../../services/settings/structureAPI';
import { searchServiceByStructure } from '../../../../../services/settings/serviceAPI';
import { X, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { searchFamilleMetier } from '../../../../../services/elaborations/familleMetierAPI';

interface PublicCibleUIState {
    familleMetier?: FamilleMetier; // ✅ Optionnel maintenant
    modeDirectPoste: boolean; // ✅ NOUVEAU: true = saisie directe par poste
    postes: {
        poste: PosteDeTravail;
        allStructures: boolean;
        structures: {
            structure: Structure;
            allServices: boolean;
            services: Service[];
        }[];
    }[];
    allPostes: boolean;
}

interface ConflitFamille {
    poste: PosteDeTravail;
    famillesDisponibles: FamilleMetier[];
    famillesChoisies: FamilleMetier[]; // ✅ tableau au lieu d'une seule famille
}

interface FormCreateUpdateProps {
    themeFormation: ThemeFormation | undefined | null;
    isParticipant: boolean;
    onSuccess?: () => void; // ✅ Ajout du callback
}

function FormCreateUpdate({ themeFormation, isParticipant, onSuccess }: FormCreateUpdateProps) {
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
    const [duree, setDuree] = useState<number|undefined>();
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
    const [errorDuree, setErrorDuree] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");

    const [modeAjout, setModeAjout] = useState<'famille' | 'poste'>('famille');
    
    const [conflitsFamilles, setConflitsFamilles] = useState<ConflitFamille[]>([]);
    const [showConflitModal, setShowConflitModal] = useState(false);


    // ✅ Conversion des données backend vers l'UI
    const convertBackendToUI = (publicCible?: FamilleMetierRestriction[]): PublicCibleUIState[] => {
        if (!publicCible) return [];

        return publicCible.map(fam => ({
            familleMetier: fam.familleMetier,
            modeDirectPoste: false,
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
        const result: FamilleMetierInput[] = [];

        for (const item of publicCibleList) {
            if (!item.modeDirectPoste && item.familleMetier) {
                result.push({
                    familleMetier: item.familleMetier._id!,
                    postes: item.allPostes ? undefined : item.postes.map(pos => ({
                        poste: pos.poste._id!,
                        structures: pos.allStructures ? undefined : pos.structures.map(str => ({
                            structure: str.structure._id!,
                            services: str.allServices ? undefined : str.services.map(srv => ({
                                service: srv._id!
                            }))
                        }))
                    }))
                });
            } else {
                // Mode direct : grouper par famille choisie (_familleChoisie)
                for (const posteItem of item.postes) {
                    const famille = (posteItem.poste as any)._familleChoisie as FamilleMetier;
                    if (!famille) continue;

                    let famEntry = result.find(r => r.familleMetier === famille._id);
                    if (!famEntry) {
                        famEntry = { familleMetier: famille._id!, postes: [] };
                        result.push(famEntry);
                    }

                    famEntry.postes = famEntry.postes || [];
                    famEntry.postes.push({
                        poste: posteItem.poste._id!,
                        structures: posteItem.allStructures ? undefined : posteItem.structures.map(str => ({
                            structure: str.structure._id!,
                            services: str.allServices ? undefined : str.services.map(srv => ({
                                service: srv._id!
                            }))
                        }))
                    });
                }
            }
        }

        return result;
    };

    const getFamItemKey = (famItem: PublicCibleUIState): string => {
        return famItem.modeDirectPoste 
            ? '__direct__' 
            : famItem.familleMetier!._id!;
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
            setDuree(themeFormation.duree);
            const uiList = convertBackendToUI(themeFormation.publicCible);
            setPublicCibleList(uiList);
            const hasDirectPoste = uiList.some(f => f.modeDirectPoste);
            setModeAjout(hasDirectPoste ? 'poste' : 'famille');
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
            setDuree(undefined);
            setModeAjout('famille');
        }

        if (isFirstRender) {
            setErrorTitreFr("");
            setErrorTitreEn("");
            setErrorDuree("");
            setErrorProgrammeFormation("");
            setErrorFormation("");
            setIsFirstRender(false);
        }
    }, [themeFormation, isFirstRender, t]);

    const closeModal = () => {
        setErrorTitreFr("");
        setErrorTitreEn("");
        setErrorDuree("");
        setErrorProgrammeFormation("");
        setErrorFormation("");
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

    const onSearchPosteParFamille = async (search: string, familleId: string) => {
        const data = await searchPosteDeTravailByFamille({ familleId, searchString: search, lang });
        return data?.posteDeTravails || [];
    };

    const onSearchStructureParPoste = async (search: string, posteId: string) => {
        const data = await searchStructureByPoste({ posteId, searchString: search, lang });
        return data?.structures || [];
    };

    const onSearchServiceParStructure = async (search: string, structureId: string) => {
        const data = await searchServiceByStructure({ structureId, searchString: search, lang });
        return data?.services || [];
    };
    // Recherche de poste sans filtre famille
    const onSearchPosteDirect = async (search: string) => {
        const data = await searchPosteDeTravail({ searchString: search, lang });
        return data?.posteDeTravails || [];
    };

   

    const onSearchResponsable = async (search: string) => {
        const data = await searchUtilisateur({ searchString: search, lang });
        return data?.utilisateurs || [];
    };

    // ✅ Gestion du public cible
    const addFamilleMetier = (familles: FamilleMetier[]) => {
        const nouvellesFamilles = familles.filter(famille => {
            const dejaAjoute = publicCibleList.some(
                f => !f.modeDirectPoste && f.familleMetier?._id === famille._id
            );
            if (dejaAjoute) {
                createToast(t('error.famille_deja_ajoutee'), '', 1);
                return false;
            }
            return true;
        });

        if (nouvellesFamilles.length === 0) return;

        const nouvellesEntrees: PublicCibleUIState[] = nouvellesFamilles.map(famille => ({
            familleMetier: famille,
            modeDirectPoste: false,
            allPostes: true,
            postes: []
        }));

        setPublicCibleList([...publicCibleList, ...nouvellesEntrees]);

        setExpandedFamilles(prev => {
            const next = new Set(prev);
            nouvellesFamilles.forEach(f => next.add(f._id!));
            return next;
        });
    };

    const removeFamilleMetier = (familleId: string) => {
        setPublicCibleList(publicCibleList.filter(f => getFamItemKey(f) !== familleId));
        setExpandedFamilles(prev => {
            const next = new Set(prev);
            next.delete(familleId);
            return next;
        });
    };

    const toggleAllPostes = (familleId: string) => {
        setPublicCibleList(publicCibleList.map(fam => {
            if (getFamItemKey(fam) === familleId) {
                return {
                    ...fam,
                    allPostes: !fam.allPostes,
                    postes: !fam.allPostes ? [] : fam.postes
                };
            }
            return fam;
        }));
    };

    const addPosteToFamille = (familleId: string, postes: PosteDeTravail[]) => {
        setPublicCibleList(publicCibleList.map(fam => {
            // ✅ Ne traiter que la famille ciblée
            if (getFamItemKey(fam) !== familleId) return fam;

            const nouveauxPostes = postes.filter(poste => {
                const dejaAjoute = fam.postes.some(p => p.poste._id === poste._id);
                if (dejaAjoute) return false;

                // Vérification famille uniquement en mode classique
                if (!fam.modeDirectPoste) {
                    const appartient = poste.famillesMetier.some(
                        fm => fm._id?.toString() === familleId.toString()
                    );
                    if (!appartient) {
                        createToast(t('error.poste_pas_dans_famille'), '', 2);
                        return false;
                    }
                }

                return true;
            });

            if (nouveauxPostes.length === 0) return fam;

            return {
                ...fam,
                allPostes: false,
                postes: [
                    ...fam.postes,
                    ...nouveauxPostes.map(poste => ({
                        poste,
                        allStructures: true,
                        structures: []
                    }))
                ]
            };
        }));
    };

    // Ajouter des postes directement (sans famille sélectionnée d'abord)
    const addPostesDirect = (postes: PosteDeTravail[]) => {
        // ✅ Exclure les postes déjà présents dans le bloc direct
        // pour ne traiter que les NOUVEAUX postes
        const postesDejaAjoutes = publicCibleList
            .flatMap(f => f.postes)
            .map(p => p.poste._id);

        const nouveauxPostes = postes.filter(p => !postesDejaAjoutes.includes(p._id));

        // Si aucun nouveau poste, ne rien faire
        if (nouveauxPostes.length === 0) return;

        const postesAvecConflit: PosteDeTravail[] = [];
        const postesSansConflit: PosteDeTravail[] = [];

        nouveauxPostes.forEach(poste => {
            if (poste.famillesMetier.length > 1) {
                postesAvecConflit.push(poste);
            } else {
                postesSansConflit.push(poste);
            }
        });

        if (postesSansConflit.length > 0) {
            _doAddPostesDirect(postesSansConflit);
        }

        if (postesAvecConflit.length > 0) {
            setConflitsFamilles(postesAvecConflit.map(poste => ({
                poste,
                famillesDisponibles: poste.famillesMetier,
                famillesChoisies: []
            })));
            setShowConflitModal(true);
        } else {
            setShowConflitModal(false);
            setConflitsFamilles([]);
        }
    };

    // Fonction interne d'ajout effectif (extraite de l'ancienne addPostesDirect)
    const _doAddPostesDirect = (postes: PosteDeTravail[], famillesOverride?: Map<string, FamilleMetier[]>) => {
        const existingDirectIndex = publicCibleList.findIndex(f => f.modeDirectPoste);

        const nouveauxPostes = postes.filter(poste => {
            const dejaAjoute = publicCibleList
                .flatMap(f => f.postes)
                .some(p => p.poste._id === poste._id);
            if (dejaAjoute) createToast(t('error.poste_deja_ajoute'), '', 1);
            return !dejaAjoute;
        });

        if (nouveauxPostes.length === 0) return;
        setConflitsFamilles([]);

        // ✅ Un poste peut générer plusieurs entrées si plusieurs familles choisies
        const postesAvecFamille: { poste: PosteDeTravail & { _familleChoisie: FamilleMetier }, allStructures: boolean, structures: any[] }[] = [];

        for (const poste of nouveauxPostes) {
            const familles = famillesOverride?.get(poste._id!) ?? [poste.famillesMetier[0]];
            for (const famille of familles) {
                postesAvecFamille.push({
                    poste: { ...poste, _familleChoisie: famille },
                    allStructures: true,
                    structures: []
                });
            }
        }

        if (existingDirectIndex >= 0) {
            setPublicCibleList(publicCibleList.map((item, idx) => {
                if (idx !== existingDirectIndex) return item;
                return { ...item, postes: [...item.postes, ...postesAvecFamille] };
            }));
        } else {
            setPublicCibleList([...publicCibleList, {
                familleMetier: undefined,
                modeDirectPoste: true,
                allPostes: false,
                postes: postesAvecFamille
            }]);
        }
    };

    const resolveConflits = () => {
        const nonResolus = conflitsFamilles.filter(c => c.famillesChoisies.length === 0);
        if (nonResolus.length > 0) {
            createToast(t('error.choisir_famille_pour_tous_postes'), '', 1);
            return;
        }

        // ✅ Map posteId → tableau de familles choisies
        const famillesOverride = new Map<string, FamilleMetier[]>(
            conflitsFamilles.map(c => [c.poste._id!, c.famillesChoisies])
        );

        _doAddPostesDirect(conflitsFamilles.map(c => c.poste), famillesOverride);
        setConflitsFamilles([]);
        setShowConflitModal(false);
    };

    const removePosteFromFamille = (familleId: string, posteId: string) => {
        setPublicCibleList(publicCibleList.map(fam => {
            if (getFamItemKey(fam) === familleId) {
                return {
                    ...fam,
                    postes: fam.postes.filter(p => p.poste._id !== posteId)
                };
            }
            return fam;
        }));
    };

    const toggleAllStructures = (familleId: string, posteId: string) => {
        
        setPublicCibleList(publicCibleList.map(fam => {
            if (getFamItemKey(fam) === familleId) {
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

    const addStructureToPoste = (familleId: string, posteId: string, structures: Structure[]) => {
        setPublicCibleList(publicCibleList.map(fam => {
            if (getFamItemKey(fam) === familleId) {
                return {
                    ...fam,
                    postes: fam.postes.map(pos => {
                        if (pos.poste._id === posteId) {
                            const nouvellesStructures = structures.filter(structure =>
                                !pos.structures.some(s => s.structure._id === structure._id)
                            );

                            if (nouvellesStructures.length === 0) return pos;

                            return {
                                ...pos,
                                allStructures: false,
                                structures: [
                                    ...pos.structures,
                                    ...nouvellesStructures.map(structure => ({
                                        structure,
                                        allServices: true,
                                        services: []
                                    }))
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
            if (getFamItemKey(fam) === familleId) {
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
       
        setPublicCibleList(publicCibleList.map(fam => {
            if (getFamItemKey(fam) === familleId) {
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

    const addServiceToStructure = (familleId: string, posteId: string, structureId: string, services: Service[]) => {
        setPublicCibleList(publicCibleList.map(fam => {
            if (getFamItemKey(fam) === familleId) {
                return {
                    ...fam,
                    postes: fam.postes.map(pos => {
                        if (pos.poste._id === posteId) {
                            return {
                                ...pos,
                                structures: pos.structures.map(str => {
                                    if (str.structure._id === structureId) {
                                        const nouveauxServices = services.filter(service => {
                                            if (service.structure._id !== structureId) {
                                                createToast(t('error.service_pas_dans_structure'), '', 2);
                                                return false;
                                            }
                                            return !str.services.some(s => s._id === service._id);
                                        });

                                        if (nouveauxServices.length === 0) return str;

                                        return {
                                            ...str,
                                            allServices: false,
                                            services: [...str.services, ...nouveauxServices]
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
            if (getFamItemKey(fam) === familleId) {
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
                // ✅ Mettre à jour currentFamilleId quand on ouvre le panneau
                // uniquement si ce n'est pas le bloc direct
                // if (familleId !== '__direct__') {
                //     setCurrentFamilleId(familleId);
                // }
            }
            return next;
        });
    };

    const handleCreateThemeFormation = async () => {
        if (!titreFr || !titreEn || !duree || !programmeFormation || !formation) {
            if (!titreFr) setErrorTitreFr(t('error.titre_fr'));
            if (!titreEn) setErrorTitreEn(t("error.titre_en"));
            if (!duree) setErrorDuree(t('error.duree'));
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
                    duree,
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
                    duree,
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
                    onSuccess?.();
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
                    <label>{t('label.duree')}<span className="text-red-500"> *</span></label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="number"
                        disabled={isParticipant}
                        value={duree}
                        onChange={(e) => { setDuree(parseInt(e.target.value)); setErrorDuree(""); }}
                    />
                    {errorDuree && <p className="text-red-500 text-sm mt-1">{errorDuree}</p>}
                </div>

                <div>
                    <label>{t('label.date_debut')}</label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        disabled={isParticipant}
                        value={dateDebut}
                        onChange={(e) => { setDateDebut(e.target.value); }}
                    />
                </div>

                <div>
                    <label>{t('label.date_fin')}</label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        value={dateFin}
                        disabled={isParticipant}
                        onChange={(e) => { setDateFin(e.target.value); }}
                    />
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

                    {/* ✅ NOUVEAU: Choix du mode d'ajout */}
                    <div className="flex gap-2 mb-3">
                        <button
                            type="button"
                            onClick={() => setModeAjout('famille')}
                            className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                                modeAjout === 'famille'
                                    ? 'bg-[#2563EB] text-[#FFFFFF] border-[#2563EB]'
                                    : 'bg-[#FFFFFF] text-[#4B5563] border-[#D1D5DB] hover:border-[#60A5FA]'
                            }`}
                        >
                            {t('label.par_famille_metier')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setModeAjout('poste')}
                            className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                                modeAjout === 'poste'
                                    ? 'bg-[#2563EB] text-[#FFFFFF] border-[#2563EB]'
                                    : 'bg-[#FFFFFF] text-[#4B5563] border-[#D1D5DB] hover:border-[#60A5FA]'
                            }`}
                        >
                            {t('label.par_poste_direct')}
                        </button>
                    </div>

                    {/* Mode famille (existant) */}
                    {modeAjout === 'famille' && (
                        <SearchSelectComponent<FamilleMetier>
                            onSearch={onSearchFamilleMetier}
                            selectedItems={publicCibleList.filter(f => !f.modeDirectPoste).map(f => f.familleMetier!)}
                            onSelectionChange={(items) => addFamilleMetier(items)}
                            placeholder={t('recherche.ajouter_famille_metier')}
                            displayField={lang === 'fr' ? "nomFr" : "nomEn"}
                            searchDelay={300}
                            minSearchLength={2}
                            noResultsMessage={t('label.aucune_famille')}
                            loadingMessage={t('label.recherche_famille')}
                            textDebutCaractere={t('label.tapez_car_deb')}
                            textFinCaractere={t('label.tapez_car_fin')}
                        />
                    )}

                    {/* ✅ NOUVEAU: Mode poste direct */}
                    {modeAjout === 'poste' && (
                        <div>
                            <SearchSelectComponent<PosteDeTravail>
                                onSearch={onSearchPosteDirect}
                                selectedItems={
                                    publicCibleList.find(f => f.modeDirectPoste)?.postes.map(p => p.poste) || []
                                }
                                onSelectionChange={(items) => addPostesDirect(items)}
                                placeholder={t('recherche.ajouter_poste')}
                                displayField={lang === 'fr' ? "nomFr" : "nomEn"}
                                searchDelay={300}
                                minSearchLength={2}
                                noResultsMessage={t('label.aucun_poste')}
                                loadingMessage={t('label.recherche_poste')}
                                textDebutCaractere={t('label.tapez_car_deb')}
                                textFinCaractere={t('label.tapez_car_fin')}
                            />
                            {/* Info famille déduite */}
                            {(publicCibleList.find(f => f.modeDirectPoste)?.postes.length ?? 0) > 0 && (
                                <p className="text-xs text-gray-500 mt-1 italic">
                                    {t('label.famille_deduite_automatiquement')}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Liste des familles sélectionnées */}
                    <div className="mt-4 space-y-3">
                        {publicCibleList.map((famItem) => (
                            <div key={getFamItemKey(famItem)} className="border rounded-lg p-4 bg-[#eff6ff]">
                                {/* En-tête de la famille */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleFamilleExpanded(getFamItemKey(famItem))}
                                            className="text-[#4b5563] hover:text-[#1f2937]"
                                        >
                                            {expandedFamilles.has(getFamItemKey(famItem)) ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </button>
                                        <span className="font-semibold text-[#1e40af]">
                                            {famItem.modeDirectPoste
                                                ? t('label.postes_selectionnes_direct')
                                                : (lang === 'fr' ? famItem.familleMetier?.nomFr : famItem.familleMetier?.nomEn)
                                            }
                                        </span>
                                        {famItem.allPostes && (
                                            <span className="text-xs bg-[#a7f3d0] text-[#166534] px-2 py-1 rounded">
                                                {t('label.toute_famille')}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFamilleMetier(getFamItemKey(famItem))}
                                        className="text-[#dc2626] hover:text-[#991b1b]"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Toggle toute la famille */}
                               {/* Toggle toute la famille — masqué en mode direct */}
                                {!famItem.modeDirectPoste && (
                                    <div className="mb-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={famItem.allPostes}
                                                onChange={() => toggleAllPostes(getFamItemKey(famItem))}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">{t('label.cibler_toute_famille')}</span>
                                        </label>
                                    </div>
                                )}

                                {/* Détails étendus */}
                                {expandedFamilles.has(getFamItemKey(famItem)) && !famItem.allPostes && (
                                    <div className="ml-4 space-y-3 border-l-2 border-[#93c5fd] pl-4">
                                        {/* Recherche de poste */}
                                        {!famItem.modeDirectPoste && (
                                            <SearchSelectComponent<PosteDeTravail>
                                                onSearch={(search) => onSearchPosteParFamille(search, getFamItemKey(famItem))}
                                                selectedItems={famItem.postes.map(p => p.poste)}
                                                onSelectionChange={(items) => addPosteToFamille(getFamItemKey(famItem), items)}
                                                placeholder={t('recherche.ajouter_poste')}
                                                displayField={lang === 'fr' ? "nomFr" : "nomEn"}
                                                searchDelay={300}
                                                minSearchLength={2}
                                                noResultsMessage={t('label.aucun_poste')}
                                                loadingMessage={t('label.recherche_poste')}
                                                textDebutCaractere={t('label.tapez_car_deb')}
                                                textFinCaractere={t('label.tapez_car_fin')}
                                            />
                                        )}

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
                                                        onClick={() => removePosteFromFamille(getFamItemKey(famItem), posteItem.poste._id!)}
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
                                                            onChange={() => toggleAllStructures(getFamItemKey(famItem), posteItem.poste._id!)}
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
                                                            onSearch={(search) => onSearchStructureParPoste(search, posteItem.poste._id!)}
                                                            selectedItems={posteItem.structures.map(s => s.structure)}
                                                            onSelectionChange={(items) => addStructureToPoste(getFamItemKey(famItem), posteItem.poste._id!, items)}
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
                                                                        onClick={() => removeStructureFromPoste(getFamItemKey(famItem), posteItem.poste._id!, structureItem.structure._id!)}
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
                                                                            onChange={() => toggleAllServices(getFamItemKey(famItem), posteItem.poste._id!, structureItem.structure._id!)}
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
                                                                            onSearch={(search) => onSearchServiceParStructure(search, structureItem.structure._id!)}
                                                                            selectedItems={structureItem.services}
                                                                            onSelectionChange={(items) => addServiceToStructure(getFamItemKey(famItem), posteItem.poste._id!, structureItem.structure._id!, items)}
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
                                                                                        onClick={() => removeServiceFromStructure(getFamItemKey(famItem), posteItem.poste._id!, structureItem.structure._id!, service._id!)}
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
                                const famNom = fam.modeDirectPoste
                                    ? t('label.postes_selectionnes_direct')
                                    : (lang === 'fr' ? fam.familleMetier?.nomFr : fam.familleMetier?.nomEn) ?? '';

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

                    {showConflitModal && (
                        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
                            <div className="bg-[#FFFFFF] rounded-lg p-6 max-w-md w-full shadow-xl">
                                <h3 className="font-semibold text-lg mb-4">
                                    {t('label.choisir_famille_poste')}
                                </h3>
                                <p className="text-sm text-[#6B7280] mb-4">
                                    {t('label.postes_multi_familles_info')}
                                </p>

                                <div className="space-y-4">
                                    {conflitsFamilles.map((conflit, idx) => (
                                        <div key={conflit.poste._id} className="border border-[#E5E7EB] rounded p-3">
                                            <p className="font-medium text-sm mb-2">
                                                {lang === 'fr' ? conflit.poste.nomFr : conflit.poste.nomEn}
                                            </p>
                                            <div className="flex flex-col gap-1">
                                                {conflit.famillesDisponibles.map(famille => (
                                                    <label key={famille._id} className="flex items-center gap-2 cursor-pointer text-sm">
                                                        {/* ✅ checkbox au lieu de radio → plusieurs familles possibles */}
                                                        <input
                                                            type="checkbox"
                                                            checked={conflit.famillesChoisies.some(f => f._id === famille._id)}
                                                            onChange={(e) => {
                                                                setConflitsFamilles(prev => prev.map((c, i) => {
                                                                    if (i !== idx) return c;
                                                                    const already = c.famillesChoisies.some(f => f._id === famille._id);
                                                                    return {
                                                                        ...c,
                                                                        famillesChoisies: already
                                                                            ? c.famillesChoisies.filter(f => f._id !== famille._id)
                                                                            : [...c.famillesChoisies, famille]
                                                                    };
                                                                }));
                                                            }}
                                                        />
                                                        {lang === 'fr' ? famille.nomFr : famille.nomEn}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setShowConflitModal(false); setConflitsFamilles([]); }}
                                        className="px-4 py-2 text-sm border border-[#D1D5DB] rounded text-[#4B5563] hover:bg-[#F9FAFB]"
                                    >
                                        {t('button.annuler')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resolveConflits}
                                        className="px-4 py-2 text-sm bg-[#2563EB] text-[#FFFFFF] rounded hover:bg-[#1D4ED8]"
                                    >
                                        {t('button.confirmer')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomDialogModal>
    );
}

export default FormCreateUpdate;