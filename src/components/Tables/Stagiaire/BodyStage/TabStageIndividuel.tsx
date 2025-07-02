import React from 'react';
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
import { useSelector } from 'react-redux';
import { searchService } from '../../../../services/settings/serviceAPI';

// Composants Select simulés
const SelectTrigger = ({ children }: { children: React.ReactNode }) => (
  <button className="w-full h-10 px-3 py-2 text-left bg-white dark:bg-[#1f2937] border border-[#e5e7eb] dark:border-[#4b5563] rounded-md text-sm text-[#111827] dark:text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent flex items-center justify-between">
    {children}
    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
);

const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <span className="text-[#9ca3af]">{placeholder || "Sélectionner..."}</span>
);



interface IndividualStageTabProps {
  onServiceAdd: () => void;
  onServiceRemove: (index: number) => void;
  onServicesChange: (index: number, field: keyof ServiceAssignment, value: string) => void;
  onSubmit: () => void;
  services?: ServiceAssignment[];
  stagiaire?:Stagiaire
  onStagiaireChange:(stagiaire:Stagiaire)=>void
}

export const IndividualStageTab = ({ onServiceAdd, onServiceRemove, onServicesChange,onStagiaireChange, onSubmit,services, stagiaire}: IndividualStageTabProps) => {
    const {t} = useTranslation();
    const lang:string = useSelector((state: RootState) => state.setting.language) || 'fr';
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
        onServicesChange(index, 'serviceId', selected?._id||"")
       
    };
    const handleSuperviseurSelect = (selected: Utilisateur | string, index:number) => {
        if (typeof selected === "string") return
        onServicesChange(index, 'superviseurId', selected?._id||"")
       
    };

    const handleStagiaireSelect = (selected: Stagiaire | string) => {
        if (typeof selected === "string") return
        onStagiaireChange(selected)
    };
    return (
        <div className="space-y-6">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] dark:from-[#1f2937] dark:to-[#374151] rounded-lg p-6">
            <h3 className="text-2xl font-bold text-[#111827] dark:text-white mb-2 flex items-center gap-2">
            <User className="w-6 h-6 text-[#2563eb]" />
            Stage Individuel
            </h3>
            <p className="text-[#4b5563] dark:text-[#d1d5db] text-sm">
            Gérez l'affectation d'un stagiaire à des services
            </p>
        </div>

        {/* Recherche stagiaire */}
        <div className="relative">
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
        </div>

        {/* Services et superviseurs */}
        <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
            <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2563eb]" />
                Services et Supervision
            </label>
            <button 
                onClick={onServiceAdd}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#dbeafe] dark:bg-[#1e3a8a] 
                        text-[#1d4ed8] dark:text-[#93c5fd] rounded-lg hover:bg-[#bfdbfe] dark:hover:bg-[#1e40af] 
                        transition-colors"
            >
                <Plus className="w-4 h-4" />
                Ajouter
            </button>
            </div>

            <div className="space-y-4">
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
                            defaultValue={undefined}
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
                            defaultValue={undefined}
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
                        onChange={(e) => onServicesChange(index, 'dateDebut', e.target.value)}
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
                        onChange={(e) => onServicesChange(index, 'dateFin', e.target.value)}
                        className="flex-1 h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                    bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                    focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" 
                        />
                        {/* Afficher le bouton supprimer seulement s'il y a plus d'un service ou si ce n'est pas le premier */}
                        {services.length > 1 && (
                        <button 
                            onClick={() => onServiceRemove(index)}
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
            </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center pt-4">
            <button 
            onClick={onSubmit}
            className="px-8 py-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] 
                        hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold rounded-xl
                        shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
                        transition-all duration-200 flex items-center justify-center gap-2"
            >
            <UserPlus className="w-5 h-5" />
            Ajouter le stagiaire
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
