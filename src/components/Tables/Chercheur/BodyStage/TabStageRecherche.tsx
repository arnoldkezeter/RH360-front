import React, { useEffect, useState } from 'react';
import { 
  User, 
  Search, 
  Users, 
  Plus, 
  Trash2, 
  UserPlus, 
  Info 
} from 'lucide-react';
import FilterList from '../../../ui/AutoComplete';
import { useTranslation } from 'react-i18next';
import { getChercheursByFiltres } from '../../../../services/chercheurs/chercheurAPI';
import { searchUtilisateur } from '../../../../services/utilisateurs/utilisateurAPI';
import { RootState } from '../../../../_redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { searchStructure } from '../../../../services/settings/structureAPI';
import { createStageRecherche, updateStageRecherche } from '../../../../services/chercheurs/stageRechercheAPI';
import createToast from '../../../../hooks/toastify';
import { createStageRechercheSlice, updateStageRechercheSlice } from '../../../../_redux/features/chercheurs/stageRechercheSlice';
import Skeleton from 'react-loading-skeleton';
import { Spinner } from '../../../ui/loading';

interface StageRechercheTabProps {
  stageRechercheToEdit?: StageRecherche | null;
  onEditComplete?: () => void;
  pageIsLoading:boolean
}

export const StageRechercheTab = ({ stageRechercheToEdit, onEditComplete, pageIsLoading }: StageRechercheTabProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const lang:string = useSelector((state: RootState) => state.setting.language) || 'fr';
    const [nomFr, setNomFr] = useState("")
    const [nomEn, setNomEn] = useState("")
    const [chercheur, setChercheur] = useState<Chercheur>();
    const [structure, setStructure] = React.useState<StructureAssignment>(
        { structureId: "", superviseurId: "", dateDebut: "", dateFin: "" } // Au moins un élément par défaut
    );
    const [isCreating, setIsCreation] = useState<boolean>(false);

    // Effect pour remplir le formulaire quand on reçoit un stage à éditer
    useEffect(() => {
        if (stageRechercheToEdit) {
            // Remplir le formulaire avec les données du stage
            setNomFr(stageRechercheToEdit.nomFr || "");
            setNomEn(stageRechercheToEdit.nomEn || "");
            setChercheur(stageRechercheToEdit.chercheur);
            setStructure({
                structureId:stageRechercheToEdit.structure._id,
                superviseurId: stageRechercheToEdit.superviseur._id,
                dateDebut: new Date(stageRechercheToEdit.dateDebut).toISOString().split('T')[0],
                dateFin: new Date(stageRechercheToEdit.dateFin).toISOString().split('T')[0],
                _structureRef:stageRechercheToEdit.structure,
                _superviseurRef:stageRechercheToEdit.superviseur
            })
            
        } else {
            // Réinitialiser le formulaire
            setNomFr("");
            setNomEn("");
            setChercheur(undefined);
            setStructure({ structureId: "", superviseurId: "", dateDebut: "", dateFin: "" });
        }
    }, [stageRechercheToEdit]);

    const onSearchChercheur = async (search: string) => {
        const data = await getChercheursByFiltres({page:1, search: search, lang});
        return data?.chercheurs || [];
    };

    const onSearchSuperviseur = async (search: string) => {
        const data = await searchUtilisateur({searchString: search, lang});
        return data?.utilisateurs || [];
    };

    const onSearchStructure = async (search: string) => {
        const data = await searchStructure({searchString: search, lang});
        return data?.structures || [];
    };

    const handleStructureSelect = (selected: Structure | string) => {
        if (typeof selected === "string") return
        const updatedStructure = { 
                ...structure, 
                'structureId': selected?._id || "",
                '_structureRef': selected // Conserver la référence pour l'affichage
            } 
    
        setStructure(updatedStructure);
    };

    const handleSuperviseurSelect = (selected: Utilisateur | string) => {
        if (typeof selected === "string") return
        const updatedStructure = { 
                ...structure, 
                'superviseurId': selected?._id || "",
                '_superviseurRef': selected // Conserver la référence pour l'affichage
            } 
        setStructure(updatedStructure);
    };

    // const handleStructureAdd = () => {
    //     setStructure(...structure, {
    //         structureId: "",
    //         superviseurId: "",
    //         dateDebut: "",
    //         dateFin: ""
    //     });
    // };
    
    // const handleStructureRemove = (index: number) => {
    //     setStructure(structure.filter((_, i) => i !== index));
    // };

    const handleStructureChange = (field: keyof StructureAssignment, value: string) => {
        const updatedStructure = { ...structure, [field]: value } 
        setStructure(updatedStructure);
    };

    const handleChercheurSelect = (selected: Chercheur | string) => {
        if (typeof selected === "string") return
        setChercheur(selected)
    };

    const handleCreateStage = async () => {
        try {
            setIsCreation(true);
            // Filtrer structure valides
            if (!structure) throw new Error("La structure complète requise.");
           
            if(!stageRechercheToEdit){
                await createStageRecherche({
                    nomFr,
                    nomEn,
                    chercheur: chercheur?._id,
                    dateDebut: structure.dateDebut||"",
                    dateFin: structure.dateFin||"",
                    anneeStage: new Date(structure.dateDebut||"").getFullYear(),
                    superviseur:structure.superviseurId||"",
                    structure:structure.structureId||"",
                    statut: 'EN_ATTENTE',
                }, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(createStageRechercheSlice({
                            stageRecherche: {
                                _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                statut: e.data.statut,
                                dateDebut: e.data.dateDebut,
                                dateFin: e.data.dateFin,
                                anneeStage: e.data.anneStage,
                                chercheur: e.data.chercheur,
                                superviseur: e.data.superviseur,
                                structure: e.data.structure
                            }
                        }));
                    } else {
                        createToast(e.message, '', 2);
                    }
                }).catch((e) => {
                    console.log(e);
                    createToast(e.response.data.message, '', 2);
                })
            }else{
                await updateStageRecherche({
                    nomFr,
                    nomEn,
                    chercheur: chercheur?._id,
                    dateDebut: structure.dateDebut||"",
                    dateFin: structure.dateFin||"",
                    anneeStage: new Date(structure.dateDebut||"").getFullYear(),
                    superviseur:structure.superviseurId||"",
                    structure:structure.structureId||"",
                    statut: 'EN_ATTENTE',
                }, stageRechercheToEdit._id||"", lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateStageRechercheSlice({
                            id:e.data._id,
                            stageRechercheData: {
                                _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                statut: e.data.statut,
                                dateDebut: e.data.dateDebut,
                                dateFin: e.data.dateFin,
                                anneeStage: e.data.anneStage,
                                chercheur: e.data.chercheur,
                                superviseur: e.data.superviseur,
                                structure: e.data.structure
                            }
                        }));
                    } else {
                        createToast(e.message, '', 2);
                    }
                }).catch((e) => {
                    console.log(e);
                    createToast(e.response.data.message, '', 2);
                })
            }
        } catch (err: any) {
            console.error('Erreur création stage individuel:', err.message);
        }finally{
            setIsCreation(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] dark:from-[#1f2937] dark:to-[#374151] rounded-lg p-6">
                <h3 className="text-2xl font-bold text-[#111827] dark:text-white mb-2 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#2563eb]" />
                    {stageRechercheToEdit ? 'Modifier le Stage' : 'Stage de recherche'}
                </h3>
                <p className="text-[#4b5563] dark:text-[#d1d5db] text-sm">
                    Gérez l'affectation d'un chercheur à des structure
                </p>
            </div>

            <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] flex items-center gap-2">
                        <Info className="w-4 h-4 text-[#2563eb]" />
                        Information sur le stage
                    </label>
                </div>

                {pageIsLoading?<Skeleton height={100}/>:<div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* nom en français */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                {t('label.nom_chose_fr')}
                            </label>
                            <input 
                                type="text" 
                                value={nomFr}
                                onChange={(e) => {setNomFr(e.target.value)}}
                                className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                        bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                        focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" 
                            />
                        </div>

                        {/* nom en anglais */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                {t('label.nom_chose_en')}
                            </label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={nomEn}
                                    onChange={(e) => {setNomEn(e.target.value)}}
                                    className="flex-1 h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                                bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                                focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" 
                                />
                            </div>
                        </div>
                    </div>    
                </div>}
            </div>

            {/* Recherche chercheur */}
            {pageIsLoading?<Skeleton height={40} className='mt-5'/>:<div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
                <FilterList
                    items={[]}
                    placeholder={t('recherche.rechercher')+t('recherche.chercheur')}
                    displayProperty={(item) => `${item.nom} ${item?.prenom || ""}`}
                    onSelect={handleChercheurSelect}
                    enableBackendSearch={true}
                    onSearch={onSearchChercheur}
                    searchDelay={300}
                    minSearchLength={2}
                    defaultValue={chercheur}
                    noResultsMessage={t('label.aucun_chercheur')}
                    loadingMessage={t('label.recherche_chercheur')}
                />
            </div>}

            {/* Structure et superviseurs */}
            <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#2563eb]" />
                        Structure et Supervision
                    </label>
                </div> 
                <div className="space-y-4">
                    
                    <div 
                        
                        className="p-4 bg-[#f9fafb] dark:bg-[#374151] rounded-lg border-l-4 border-[#3b82f6] space-y-4"
                    >
                        {/* Première ligne : Structure et Superviseur */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Structure */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                    Structure
                                </label>
                                {pageIsLoading?<Skeleton height={40} />:<div className="relative">
                                    <FilterList
                                        items={[]}
                                        placeholder={t('recherche.rechercher')+t('recherche.structure')}
                                        displayProperty={(item) => `${lang==='fr'?item.nomFr:item.nomEn}`}
                                        onSelect={(selected) => handleStructureSelect(selected)}
                                        enableBackendSearch={true}
                                        onSearch={onSearchStructure}
                                        searchDelay={300}
                                        minSearchLength={2}
                                        defaultValue={structure._structureRef}
                                        noResultsMessage={t('label.aucun_structure')}
                                        loadingMessage={t('label.recherche_structure')}
                                    />
                                </div>}
                            </div>

                            {/* Superviseur */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                    Superviseur
                                </label>
                                {pageIsLoading?<Skeleton height={40} />:<div className="relative">
                                    <FilterList
                                        items={[]}
                                        placeholder={t('recherche.rechercher')+t('recherche.superviseur')}
                                        displayProperty={(item) => `${item.nom} ${item.prenom || ""}`}
                                        onSelect={(selected) => handleSuperviseurSelect(selected)}
                                        enableBackendSearch={true}
                                        onSearch={onSearchSuperviseur}
                                        searchDelay={300}
                                        minSearchLength={2}
                                        defaultValue={structure._superviseurRef}
                                        noResultsMessage={t('label.aucun_superviseur')}
                                        loadingMessage={t('label.recherche_superviseur')}
                                    />
                                </div>}
                            </div>
                        </div>

                        {/* Deuxième ligne : Dates et bouton supprimer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date début */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                    Date début
                                </label>
                                {pageIsLoading?<Skeleton height={40} />:<input 
                                    type="date" 
                                    value={structure?.dateDebut || ''}
                                    onChange={(e) => handleStructureChange('dateDebut', e.target.value)}
                                    className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                            bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                            focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" 
                                />}
                            </div>

                            {/* Date fin avec bouton supprimer */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                    Date fin
                                </label>
                                {pageIsLoading?<Skeleton height={40} />:<div className="flex gap-2">
                                    <input 
                                        type="date" 
                                        value={structure?.dateFin || ''}
                                        onChange={(e) => handleStructureChange('dateFin', e.target.value)}
                                        className="flex-1 h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                                    bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                                    focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" 
                                    />
                                    
                                </div>}
                            </div>
                        </div>
                    </div>
                  
                </div>
                
            </div>

            {/* Actions */}
            <div className="flex justify-center pt-4">
                <button 
                    onClick={handleCreateStage}
                    className={`px-8 py-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] 
                                hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold rounded-xl
                                shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
                                transition-all duration-200 flex items-center justify-center gap-2
                                 ${(isCreating || !chercheur || !structure) 
                                ? 'opacity-75 cursor-not-allowed' 
                                : 'hover:shadow-lg'}`}
                               
                    disabled={isCreating || !chercheur || !structure}
                >
                    
                     {isCreating ? (
                        <>
                            <Spinner />
                            {stageRechercheToEdit ? 'Modification en cours...' : 'Création en cours...'}
                        </>
                    ) : (
                        <>
                            <UserPlus className="w-5 h-5" />
                            {stageRechercheToEdit ? 'Modifier le stage' : 'Crée le stage'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};