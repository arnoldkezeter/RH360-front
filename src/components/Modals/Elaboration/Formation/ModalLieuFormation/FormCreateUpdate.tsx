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
import { SearchSelectComponent } from '../../../../ui/SearchSelectComponent';
import { formatDateForInput } from '../../../../../fonctions/fonction';
import { searchFamilleMetier } from '../../../../../services/elaborations/familleMetierAPI';
import { searchPosteDeTravailByFamille } from '../../../../../services/settings/posteDeTravailAPI';
import { searchStructureByPoste } from '../../../../../services/settings/structureAPI';
import { searchServiceByStructure } from '../../../../../services/settings/serviceAPI';
import { ChevronDown, ChevronUp, Trash2, X } from 'lucide-react';

interface ParticipantsUIState {
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
    
    const [currentFamilleId, setCurrentFamilleId] = useState<string>("");
    const [currentPosteId, setCurrentPosteId] = useState<string>("");
    const [currentStructureId, setCurrentStructureId] = useState<string>("");

    const [errorLieu, setErrorLieu] = useState("");
    const [errorCohorteParticipants, setErrorCohorteParticipants] = useState("");
    const [errorDateDebut, setErrorDateDebut] = useState("");
    const [errorDateFin, setErrorDateFin] = useState("")
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
     // ✅ Conversion des données backend vers l'UI
    const convertBackendToUI = (participant?: FamilleMetierRestriction[]): ParticipantsUIState[] => {
        if (!participant) return [];

        return participant.map(fam => ({
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
        return participantList.map(fam => ({
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
        
        if (lieuFormation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.lieu_formation'));
            
            setLieu(lieuFormation.lieu);
            setSelectedCohortes(lieuFormation.cohortes)
            setParticipantList(convertBackendToUI(lieuFormation.participants));
            setDateDebut(formatDateForInput(lieuFormation.dateDebut) || "");
            setDateFin(formatDateForInput(lieuFormation.dateFin) || "");
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.lieu_formation'));
            
            setLieu("");
           
            setSelectedCohortes([]);
            setParticipantList([])
            setDateDebut("");
            setDateFin("");
            
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
        setCurrentFamilleId("");
        setCurrentPosteId("");
        setCurrentStructureId("");
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
    

   // ✅ Gestion du public cible
    const addFamilleMetier = (famille: FamilleMetier) => {
        // Vérifier si déjà ajoutée
        if (participantList.some(f => f.familleMetier._id === famille._id)) {
            createToast(t('error.famille_deja_ajoutee'), '', 1);
            return;
        }
         setCurrentFamilleId(famille._id!)
        setParticipantList([
            ...participantList,
            {
                familleMetier: famille,
                allPostes: true,
                postes: []
            }
        ]);
        setExpandedFamilles(prev => new Set([...prev, famille._id!]));
    };

    const removeFamilleMetier = (familleId: string) => {
        setParticipantList(participantList.filter(f => f.familleMetier._id !== familleId));
        setExpandedFamilles(prev => {
            const next = new Set(prev);
            next.delete(familleId);
            return next;
        });
    };

    const toggleAllPostes = (familleId: string) => {
        setCurrentFamilleId(familleId)
        setParticipantList(participantList.map(fam => {
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
        setParticipantList(participantList.map(fam => {
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
                setCurrentPosteId(poste._id!); 
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
        setParticipantList(participantList.map(fam => {
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
        setParticipantList(participantList.map(fam => {
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
        setParticipantList(participantList.map(fam => {
            if (fam.familleMetier._id === familleId) {
                return {
                    ...fam,
                    postes: fam.postes.map(pos => {
                        if (pos.poste._id === posteId) {
                            // Vérifier si déjà ajoutée
                            if (pos.structures.some(s => s.structure._id === structure._id)) {
                                return pos;
                            }
                            setCurrentStructureId(structure._id!); 
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
        setParticipantList(participantList.map(fam => {
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
        setParticipantList(participantList.map(fam => {
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
        setParticipantList(participantList.map(fam => {
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
        setParticipantList(participantList.map(fam => {
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
                     <label>{t('label.participants')}</label><label className="text-red-500"> *</label>
                    
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
                        {participantList.map((famItem) => (
                            <div key={famItem.familleMetier._id} className="border rounded-lg p-4 bg-[#eff6ff]">
                                {/* En-tête de la famille */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleFamilleExpanded(famItem.familleMetier._id!)}
                                            className="text-[#4b5563] hover:text-[#1f2937]"
                                        >
                                            {expandedFamilles.has(famItem?famItem.familleMetier?famItem.familleMetier._id?famItem.familleMetier._id:"":"":"") ? (
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
                    {participantList.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
                            <strong>{t('label.resume_public_cible')}: </strong>
                            {participantList.map((fam, idx) => {
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
