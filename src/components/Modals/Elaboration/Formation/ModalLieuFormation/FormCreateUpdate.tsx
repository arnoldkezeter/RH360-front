import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { createLieuFormation, updateLieuFormation } from '../../../../../services/elaborations/lieuFormationAPI';
import { createLieuFormationSlice, updateLieuFormationSlice } from '../../../../../_redux/features/elaborations/lieuFormationSlice';
import { searchCohorte } from '../../../../../services/settings/cohorteAPI';
import { SearchSelectComponent } from '../../../../ui/MultipleSearchSelectedComponent';
import { formatDateForInput } from '../../../../../fonctions/fonction';
import { searchFamilleMetier } from '../../../../../services/elaborations/familleMetierAPI';
import { searchPosteDeTravail, searchPosteDeTravailByFamille } from '../../../../../services/settings/posteDeTravailAPI';
import { searchStructureByPoste } from '../../../../../services/settings/structureAPI';
import { searchServiceByStructure } from '../../../../../services/settings/serviceAPI';
import { ChevronDown, ChevronUp, Trash2, X } from 'lucide-react';

interface ParticipantsUIState {
    familleMetier?: FamilleMetier;
    modeDirectPoste: boolean;
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

interface ConflitFamille {
    poste: PosteDeTravail;
    famillesDisponibles: FamilleMetier[];
    famillesChoisies: FamilleMetier[];
}
function FormCreateUpdate({ lieuFormation, themeId }: { lieuFormation: LieuFormation | null, themeId:string }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const [lieu, setLieu] = useState("");
    const [selectedCohortes, setSelectedCohortes] = useState<Cohorte[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<FamilleMetier[]>([]);
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    // ✅ NOUVEAU: État pour le public cible hiérarchique
    const [participantList, setParticipantList] = useState<ParticipantsUIState[]>([]);
    const [expandedFamilles, setExpandedFamilles] = useState<Set<string>>(new Set());
    
   
    const [errorLieu, setErrorLieu] = useState("");
    const [errorCohorteParticipants, setErrorCohorteParticipants] = useState("");
    const [errorDateDebut, setErrorDateDebut] = useState("");
    const [errorDateFin, setErrorDateFin] = useState("")
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

     const [modeAjout, setModeAjout] = useState<'famille' | 'poste'>('famille');
        
    const [conflitsFamilles, setConflitsFamilles] = useState<ConflitFamille[]>([]);
    const [showConflitModal, setShowConflitModal] = useState(false);
    // ✅ Conversion des données backend vers l'UI
    
    const convertBackendToUI = (participant?: FamilleMetierRestriction[]): ParticipantsUIState[] => {
        if (!participant) return [];

        return participant.map(fam => ({
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

        for (const item of participantList) {
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

    const getFamItemKey = (famItem: ParticipantsUIState): string => {
        return famItem.modeDirectPoste 
            ? '__direct__' 
            : famItem.familleMetier!._id!;
    };


    useEffect(() => {
        
        if (lieuFormation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.lieu_formation'));
            
            setLieu(lieuFormation.lieu);
            setSelectedCohortes(lieuFormation.cohortes)
            const uiList = convertBackendToUI(lieuFormation.participants);
            setParticipantList(uiList);
            const hasDirectPoste = uiList.some(f => f.modeDirectPoste);
            setModeAjout(hasDirectPoste ? 'poste' : 'famille');
            setDateDebut(formatDateForInput(lieuFormation.dateDebut) || "");
            setDateFin(formatDateForInput(lieuFormation.dateFin) || "");
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.lieu_formation'));
            
            setLieu("");
           
            setSelectedCohortes([]);
            setParticipantList([])
            setDateDebut("");
            setDateFin("");
            setModeAjout('famille');
            
        }


        if (isFirstRender) {
            setErrorLieu("");
            setErrorCohorteParticipants("")
            setErrorDateDebut("")
            setErrorDateFin("")
            
            setIsFirstRender(false);
        }
    }, [lieuFormation, isFirstRender, t]);

    const closeModal = () => {
       
        setErrorLieu("");
        setErrorCohorteParticipants("");
        setErrorDateDebut("")
        setErrorDateFin("")
        setIsFirstRender(true);
        dispatch(setShowModal());
    };



    const onSearchCohorte = async (search: string) => {
        setErrorCohorteParticipants("");
        const data = await searchCohorte({searchString: search, lang});
        return data?.cohortes || [];
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

    const onSearchPosteDirect = async (search: string) => {
        const data = await searchPosteDeTravail({ searchString: search, lang });
        return data?.posteDeTravails || [];
    };
    

   // ✅ Gestion du public cible
    const addFamilleMetier = (familles: FamilleMetier[]) => {
        const nouvellesFamilles = familles.filter(famille => {
            const dejaAjoute = participantList.some(
                f => !f.modeDirectPoste && f.familleMetier?._id === famille._id
            );
            if (dejaAjoute) {
                createToast(t('error.famille_deja_ajoutee'), '', 1);
                return false;
            }
            return true;
        });

        if (nouvellesFamilles.length === 0) return;

        const nouvellesEntrees: ParticipantsUIState[] = nouvellesFamilles.map(famille => ({
            familleMetier: famille,
            modeDirectPoste: false,
            allPostes: true,
            postes: []
        }));

        setParticipantList([...participantList, ...nouvellesEntrees]);

        setExpandedFamilles(prev => {
            const next = new Set(prev);
            nouvellesFamilles.forEach(f => next.add(f._id!));
            return next;
        });
    };

    const removeFamilleMetier = (familleId: string) => {
        setParticipantList(participantList.filter(f => getFamItemKey(f) !== familleId));
        setExpandedFamilles(prev => {
            const next = new Set(prev);
            next.delete(familleId);
            return next;
        });
    };

    const toggleAllPostes = (familleId: string) => {
        setParticipantList(participantList.map(fam => {
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
        setParticipantList(participantList.map(fam => {
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
        const postesDejaAjoutes = participantList
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
        const existingDirectIndex = participantList.findIndex(f => f.modeDirectPoste);

        const nouveauxPostes = postes.filter(poste => {
            const dejaAjoute = participantList
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
            setParticipantList(participantList.map((item, idx) => {
                if (idx !== existingDirectIndex) return item;
                return { ...item, postes: [...item.postes, ...postesAvecFamille] };
            }));
        } else {
            setParticipantList([...participantList, {
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
        setParticipantList(participantList.map(fam => {
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
        
        setParticipantList(participantList.map(fam => {
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
        setParticipantList(participantList.map(fam => {
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
        setParticipantList(participantList.map(fam => {
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
       
        setParticipantList(participantList.map(fam => {
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
        setParticipantList(participantList.map(fam => {
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
        setParticipantList(participantList.map(fam => {
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



    const handleCreateLieuFormation = async () => {
        if (!lieu || (!selectedCohortes && !selectedParticipants) || !dateDebut || !dateFin) {
            if (!lieu) {
                setErrorLieu(t('error.titre_fr'));
            }

            if(!selectedCohortes || !selectedParticipants){
                setErrorCohorteParticipants(t("error.cohorte_participant"))
            }

            if (!dateDebut) {
                setErrorDateDebut(t('error.date_debut'));
            }

            if (!dateFin) {
                setErrorDateFin(t('error.date_fin'));
            }

            return;
        }
        const participantInput = convertUIToBackend();
        if (!lieuFormation) {
            setIsLoading(true)
            await createLieuFormation(
                {
                    lieu,
                    cohortes:selectedCohortes.map(c => c._id!),
                    participants:participantInput,
                    dateDebut,
                    dateFin
                }, themeId,lang
            ).then(async (e: ReponseApiPros) => {
                
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createLieuFormationSlice({
                        lieuFormation: e.data,
                        themeId: themeId
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
            await updateLieuFormation(
                {
                    _id: lieuFormation._id,
                    lieu,
                    cohortes:selectedCohortes.map(c => c._id!),
                    participants:participantInput,
                    dateDebut,
                    dateFin

                }, themeId,lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateLieuFormationSlice({
                            id: e.data._id,
                            lieuFormationData: e.data

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
                handleConfirm={handleCreateLieuFormation}
                isLoading={isLoading}
            >
                
                <label>{t('label.lieu')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={lieu}
                    onChange={(e) => { setLieu(e.target.value); setErrorLieu("") }}
                />
                {errorLieu && <p className="text-red-500" >{errorLieu}</p>}
                
                <label>{t('label.cohortes')}</label><label className="text-red-500"> *</label>
                <SearchSelectComponent<Cohorte>
                    onSearch={onSearchCohorte}
                    selectedItems={selectedCohortes}
                    onSelectionChange={setSelectedCohortes}
                    placeholder={t('recherche.rechercher')+t('recherche.cohorte')}
                    displayField={lang?"nomFr":"nomEn"}
                    searchDelay={300}
                    minSearchLength={2}
                    noResultsMessage={t('label.aucune_cohorte')}
                    loadingMessage={t('label.recherche_cohorte')}
                    textDebutCaractere={t('label.tapez_car_deb')}
                    textFinCaractere={t('label.tapez_car_fin')}
                />
                {errorCohorteParticipants && <p className="text-red-500" >{errorCohorteParticipants}</p>}
                
                {/* ✅ NOUVEAU: Section Public Cible Hiérarchique */}
                <div className="border-t pt-4">
                    <label className="font-semibold text-lg mb-2 block">{t('label.participant')}</label>

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
                            selectedItems={participantList.filter(f => !f.modeDirectPoste).map(f => f.familleMetier!)}
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
                                    participantList.find(f => f.modeDirectPoste)?.postes.map(p => p.poste) || []
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
                            {(participantList.find(f => f.modeDirectPoste)?.postes.length ?? 0) > 0 && (
                                <p className="text-xs text-gray-500 mt-1 italic">
                                    {t('label.famille_deduite_automatiquement')}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Liste des familles sélectionnées */}
                    <div className="mt-4 space-y-3">
                        {participantList.map((famItem) => (
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

                    {/* Résumé des participant */}
                    {participantList.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
                            <strong>{t('label.participant')}: </strong>
                            {participantList.map((fam, idx) => {
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

                {errorCohorteParticipants && <p className="text-red-500" >{errorCohorteParticipants}</p>}
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
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;
