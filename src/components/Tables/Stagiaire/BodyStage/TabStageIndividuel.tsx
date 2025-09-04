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
import { getStagiairesByFiltres, searchStagiaire } from '../../../../services/stagiaires/stagiaireAPI';
import { searchUtilisateur } from '../../../../services/utilisateurs/utilisateurAPI';
import { RootState } from '../../../../_redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { searchService } from '../../../../services/settings/serviceAPI';
import { createStage, updateStage } from '../../../../services/stagiaires/stageAPI';
import createToast from '../../../../hooks/toastify';
import { createStageSlice, updateStageSlice } from '../../../../_redux/features/stagiaire/stageSlice';
import Skeleton from 'react-loading-skeleton';

interface IndividualStageTabProps {
  stageToEdit?: Stage | null;
  onEditComplete?: () => void;
  pageIsLoading:boolean
}

export const IndividualStageTab = ({ stageToEdit, onEditComplete, pageIsLoading }: IndividualStageTabProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const lang:string = useSelector((state: RootState) => state.setting.language) || 'fr';
    const [nomFr, setNomFr] = useState("")
    const [nomEn, setNomEn] = useState("")
    const [stagiaire, setStagiaire] = useState<Stagiaire>();
    const [services, setServices] = React.useState<ServiceAssignment[]>([
        { serviceId: "", superviseurId: "", dateDebut: "", dateFin: "" } // Au moins un élément par défaut
    ]);

    // Effect pour remplir le formulaire quand on reçoit un stage à éditer
    useEffect(() => {
        if (stageToEdit) {
            // Remplir le formulaire avec les données du stage
            setNomFr(stageToEdit.nomFr || "");
            setNomEn(stageToEdit.nomEn || "");
            setStagiaire(stageToEdit.stagiaire);
            
            // Remplir les services avec les données des affectationsFinales
            if (stageToEdit.affectationsFinales && stageToEdit.affectationsFinales.length > 0) {
                const servicesFromAffectations = stageToEdit.affectationsFinales.map(affectation => ({
                    serviceId: affectation.service?._id || "",
                    superviseurId: affectation.superviseur?._id || "",
                    dateDebut: affectation.dateDebut ? new Date(affectation.dateDebut).toISOString().split('T')[0] : "",
                    dateFin: affectation.dateFin ? new Date(affectation.dateFin).toISOString().split('T')[0] : "",
                    // Conserver les références complètes pour l'affichage
                    _serviceRef: affectation.service,
                    _superviseurRef: affectation.superviseur
                }));
                setServices(servicesFromAffectations);
            }
        } else {
            // Réinitialiser le formulaire
            setNomFr("");
            setNomEn("");
            setStagiaire(undefined);
            setServices([{ serviceId: "", superviseurId: "", dateDebut: "", dateFin: "" }]);
        }
    }, [stageToEdit]);

    const onSearchStagiaire = async (search: string) => {
        const data = await getStagiairesByFiltres({page:1, search: search, lang});
        return data?.stagiaires || [];
    };

    const onSearchSuperviseur = async (search: string) => {
        const data = await searchUtilisateur({searchString: search, lang});
        return data?.utilisateurs || [];
    };

    const onSearchService = async (search: string) => {
        const data = await searchService({searchString: search, lang});
        return data?.services || [];
    };

    const handleServiceSelect = (selected: Service | string, index:number) => {
        if (typeof selected === "string") return
        const updatedServices = services.map((service, i) => 
            i === index ? { 
                ...service, 
                'serviceId': selected?._id || "",
                '_serviceRef': selected // Conserver la référence pour l'affichage
            } : service
        );
        setServices(updatedServices);
    };

    const handleSuperviseurSelect = (selected: Utilisateur | string, index:number) => {
        if (typeof selected === "string") return
        const updatedServices = services.map((service, i) => 
            i === index ? { 
                ...service, 
                'superviseurId': selected?._id || "",
                '_superviseurRef': selected // Conserver la référence pour l'affichage
            } : service
        );
        setServices(updatedServices);
    };

    const handleServiceAdd = () => {
        setServices([...services, {
            serviceId: "",
            superviseurId: "",
            dateDebut: "",
            dateFin: ""
        }]);
    };
    
    const handleServiceRemove = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const handleServiceChange = (index: number, field: keyof ServiceAssignment, value: string) => {
        const updatedServices = services.map((service, i) => 
            i === index ? { ...service, [field]: value } : service
        );
        setServices(updatedServices);
    };

    const handleStagiaireSelect = (selected: Stagiaire | string) => {
        if (typeof selected === "string") return
        setStagiaire(selected)
    };

    const handleCreateStage = async () => {
        try {
            // Filtrer services valides
            const validServices = services.filter(s => s.serviceId && s.superviseurId && s.dateDebut && s.dateFin);
            if (validServices.length === 0) throw new Error("Au moins un service complet requis.");

            // Créer les rotations, une par service
            const rotations = validServices.map(s => ({
                stagiaire: stagiaire?._id,
                service: s.serviceId||"",
                superviseur: s.superviseurId||"",
                dateDebut: s.dateDebut||"",
                dateFin: s.dateFin||"",
            }));

            // Créer une affectation finale par service parcouru (correspondant à une rotation)
            const affectationsFinales = validServices.map(s => ({
                stagiaire: stagiaire?._id,
                service: s.serviceId||"",
                superviseur: s.superviseurId||"",
                dateDebut: s.dateDebut||"",
                dateFin: s.dateFin||"",
            }));

            // Déterminer dateDebut globale = plus tôt, dateFin globale = plus tard
            const dateDebutGlobale = new Date(Math.min(...validServices.map(s => new Date(s.dateDebut||"").getTime()))).toISOString();
            const dateFinGlobale = new Date(Math.max(...validServices.map(s => new Date(s.dateFin||"").getTime()))).toISOString();

            if(!stageToEdit){
                await createStage({
                    nomFr,
                    nomEn,
                    type: 'INDIVIDUEL',
                    stagiaire: stagiaire?._id,
                    rotations,
                    affectationsFinales,
                    dateDebut: dateDebutGlobale||"",
                    dateFin: dateFinGlobale||"",
                    anneeStage: new Date(dateDebutGlobale).getFullYear(),
                    statut: 'EN_ATTENTE',
                }, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(createStageSlice({
                            stage: {
                                _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                type: e.data.type,
                                statut: e.data.statut,
                                dateDebut: e.data.dateDebut,
                                dateFin: e.data.dateFin,
                                anneeStage: e.data.anneStage
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
                await updateStage({
                    nomFr,
                    nomEn,
                    type: 'INDIVIDUEL',
                    stagiaire: stagiaire?._id,
                    rotations,
                    affectationsFinales,
                    dateDebut: dateDebutGlobale||"",
                    dateFin: dateFinGlobale||"",
                    anneeStage: new Date(dateDebutGlobale).getFullYear(),
                    statut: 'EN_ATTENTE',
                }, stageToEdit._id||"", lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateStageSlice({
                            id:e.data._id,
                            stageData: {
                                _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                type: e.data.type,
                                statut: e.data.statut,
                                dateDebut: e.data.dateDebut,
                                dateFin: e.data.dateFin,
                                anneeStage: e.data.anneStage
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
        }
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] dark:from-[#1f2937] dark:to-[#374151] rounded-lg p-6">
                <h3 className="text-2xl font-bold text-[#111827] dark:text-white mb-2 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#2563eb]" />
                    {stageToEdit ? 'Modifier le Stage Individuel' : 'Stage Individuel'}
                </h3>
                <p className="text-[#4b5563] dark:text-[#d1d5db] text-sm">
                    Gérez l'affectation d'un stagiaire à des services
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

            {/* Recherche stagiaire */}
            {pageIsLoading?<Skeleton height={40} className='mt-5'/>:<div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
                <FilterList
                    items={[]}
                    placeholder={t('recherche.rechercher')+t('recherche.stagiaire')}
                    displayProperty={(item) => `${item.nom} ${item?.prenom || ""}`}
                    onSelect={handleStagiaireSelect}
                    enableBackendSearch={true}
                    onSearch={onSearchStagiaire}
                    searchDelay={300}
                    minSearchLength={2}
                    defaultValue={stagiaire}
                    noResultsMessage={t('label.aucun_stagiaire')}
                    loadingMessage={t('label.recherche_stagiaire')}
                />
            </div>}

            {/* Services et superviseurs */}
            <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#2563eb]" />
                        Services et Supervision
                    </label>
                    <button 
                        onClick={handleServiceAdd}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#dbeafe] dark:bg-[#1e3a8a] 
                                text-[#1d4ed8] dark:text-[#93c5fd] rounded-lg hover:bg-[#bfdbfe] dark:hover:bg-[#1e40af] 
                                transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter
                    </button>
                </div>

                {pageIsLoading?<Skeleton height={200}/>:<div className="space-y-4">
                    {services && services.map((service, index) => (
                        <div 
                            key={index}
                            className="p-4 bg-[#f9fafb] dark:bg-[#374151] rounded-lg border-l-4 border-[#3b82f6] space-y-4"
                        >
                            {/* Première ligne : Service et Superviseur */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Service */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                        Service
                                    </label>
                                    <div className="relative">
                                        <FilterList
                                            items={[]}
                                            placeholder={t('recherche.rechercher')+t('recherche.service')}
                                            displayProperty={(item) => `${lang==='fr'?item.nomFr:item.nomEn}`}
                                            onSelect={(selected) => handleServiceSelect(selected, index)}
                                            enableBackendSearch={true}
                                            onSearch={onSearchService}
                                            searchDelay={300}
                                            minSearchLength={2}
                                            defaultValue={service._serviceRef}
                                            noResultsMessage={t('label.aucun_service')}
                                            loadingMessage={t('label.recherche_service')}
                                        />
                                    </div>
                                </div>

                                {/* Superviseur */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                        Superviseur
                                    </label>
                                    <div className="relative">
                                        <FilterList
                                            items={[]}
                                            placeholder={t('recherche.rechercher')+t('recherche.superviseur')}
                                            displayProperty={(item) => `${item.nom} ${item.prenom || ""}`}
                                            onSelect={(selected) => handleSuperviseurSelect(selected, index)}
                                            enableBackendSearch={true}
                                            onSearch={onSearchSuperviseur}
                                            searchDelay={300}
                                            minSearchLength={2}
                                            defaultValue={service._superviseurRef}
                                            noResultsMessage={t('label.aucun_superviseur')}
                                            loadingMessage={t('label.recherche_superviseur')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Deuxième ligne : Dates et bouton supprimer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Date début */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                        Date début
                                    </label>
                                    <input 
                                        type="date" 
                                        value={service?.dateDebut || ''}
                                        onChange={(e) => handleServiceChange(index, 'dateDebut', e.target.value)}
                                        className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                                bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                                focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" 
                                    />
                                </div>

                                {/* Date fin avec bouton supprimer */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                        Date fin
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="date" 
                                            value={service?.dateFin || ''}
                                            onChange={(e) => handleServiceChange(index, 'dateFin', e.target.value)}
                                            className="flex-1 h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                                        bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                                        focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" 
                                        />
                                        {/* Afficher le bouton supprimer seulement s'il y a plus d'un service */}
                                        {services.length > 1 && (
                                            <button 
                                                onClick={() => handleServiceRemove(index)}
                                                className="h-10 w-10 flex items-center justify-center text-[#ef4444] hover:text-[#dc2626] 
                                                        hover:bg-[#fef2f2] dark:hover:bg-[#7f1d1d]/20 rounded-md transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>}
            </div>

            {/* Actions */}
            <div className="flex justify-center pt-4">
                <button 
                    onClick={handleCreateStage}
                    className="px-8 py-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] 
                                hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold rounded-xl
                                shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
                                transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <UserPlus className="w-5 h-5" />
                    {stageToEdit ? 'Modifier le stagiaire' : 'Ajouter le stagiaire'}
                </button>
            </div>

            {/* Note d'aide */}
            <div className="bg-[#eff6ff] dark:bg-[#1e3a8a]/20 border border-[#bfdbfe] dark:border-[#1e40af] 
                            rounded-lg p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-[#1e40af] dark:text-[#93c5fd]">
                    <p className="font-medium mb-1">Conseil</p>
                    <p className="text-[#1d4ed8] dark:text-[#bfdbfe]">
                        Vous pouvez affecter un stagiaire à plusieurs services avec des périodes différentes. 
                        Assurez-vous que les dates ne se chevauchent pas.
                    </p>
                </div>
            </div>
        </div>
    );
};