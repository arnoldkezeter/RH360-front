import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, Plus, Edit2, Trash2, Users, Calendar, Save, RotateCcw, Eye, AlertCircle, Check } from 'lucide-react';
import { ChronogrammeModal } from './Chronogramme';
import { getStagiairesByFiltres } from '../../../../services/stagiaires/stagiaireAPI';
import { searchUtilisateur } from '../../../../services/utilisateurs/utilisateurAPI';
import { searchService } from '../../../../services/settings/serviceAPI';
import FilterList from '../../../ui/AutoComplete';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../_redux/store';
import { setShowModal } from '../../../../_redux/features/setting';
import FormCreateUpdate from '../../../Modals/Stagiaire/ModalGroupeStage/FormCreateUpdate';


// Composant principal de l'interface (inchangé)
const GroupStageInterface = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const lang:string = useSelector((state: RootState) => state.setting.language) || 'fr';
    const [selectedStagiaires, setSelectedStagiaires] = useState<Stagiaire[]>([]);
    const [services, setServices] = React.useState<ServiceGroupAssignment[]>([]);
    const [selectedServiceForSupervisor, setSelectedServiceForSupervisor] = useState<Service | null>(null);
    const [generatedGroups, setGeneratedGroups] = useState<Groupe[]>([]);
    const [groupeParams, setGroupeParams] = useState<GroupeParams>({
        dateDebut: '',
        dateFin: '',
        stagiaireParGroupe: '',
        joursRotation: ''
    });
    const [notifications, setNotifications] = useState<{id: number, message: string, type: 'success' | 'error'}[]>([]);
    const [showChronogrammeModal, setShowChronogrammeModal] = useState<boolean>(false);
    const [selectedGroupe, setSelectedGroupe] = useState<Groupe>();


    // Fonctions d'ajout/suppression de stagiaires/services (inchangées)
    const addNotification = (message: string, type: 'success' | 'error') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };


    const addStagiaire = (stagiaire: Stagiaire | string) => {
        if (typeof stagiaire === "string") return
        setSelectedStagiaires([...selectedStagiaires, stagiaire]);
        addNotification(`${stagiaire.nom} ajouté avec succès`, 'success');
    };

    const removeStagiaire = (stagiaireId: string) => {
        const stagiaire = selectedStagiaires.find(t => t._id === stagiaireId);
        setSelectedStagiaires(selectedStagiaires.filter(t => t._id !== stagiaireId));
        if (stagiaire) {
        addNotification(`${stagiaire.nom} retiré des stagiaires`, 'success');
        }
    };

    const selectServiceForSupervisor = (service: Service | string) => {
        if (typeof service === "string") return
        setSelectedServiceForSupervisor(service);
    };

    const addServiceWithSupervisor = (supervisor: Utilisateur | string) => {
        if (typeof supervisor === "string") return
        if (selectedServiceForSupervisor) {
        setServices([...services, { 
            ...selectedServiceForSupervisor, 
            superviseur: supervisor 
        }]);
        addNotification(`${selectedServiceForSupervisor.nomFr} avec ${supervisor} ajouté`, 'success');
        setSelectedServiceForSupervisor(null);
        }
    };

    const removeService = (serviceId: string) => {
        const service = services.find(s => s?._id === serviceId);
        setServices(services.filter(s => s?._id !== serviceId));
        if (service) {
        addNotification(`${service?.nomFr} retiré des services`, 'success');
        }
    };

    // Fonctions de validation et génération de groupes (inchangées)
    const validateParams = () => {
        if (selectedStagiaires.length === 0) {
        addNotification('Veuillez sélectionner au moins un stagiaire', 'error');
        return false;
        }
        if (!groupeParams.stagiaireParGroupe || parseInt(groupeParams.stagiaireParGroupe) <= 0) {
        addNotification('Veuillez spécifier le nombre de stagiaires par groupe', 'error');
        return false;
        }
        if (parseInt(groupeParams.stagiaireParGroupe) > selectedStagiaires.length) {
        addNotification('Le nombre de stagiaires par groupe ne peut pas dépasser le nombre total de stagiaires', 'error');
        return false;
        }
        return true;
    };

    const generateGroups = () => {
        if (!validateParams()) return;

        const stagiaireParGroupe = parseInt(groupeParams.stagiaireParGroupe);
        const groups: Groupe[] = [];
        
        const shuffledStagiaires = [...selectedStagiaires].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < shuffledStagiaires.length; i += stagiaireParGroupe) {
        const groupStagiaires = shuffledStagiaires.slice(i, i + stagiaireParGroupe);
        groups.push({
                nom: `Groupe ${groups.length + 1}`,
                stagiaires: groupStagiaires,
            });
        }
        
        setGeneratedGroups(groups);
        addNotification(`${groups.length} groupes générés avec succès`, 'success');
    };

    const generateRotation = () => {
        if (generatedGroups.length === 0) {
        addNotification('Générez d\'abord les groupes', 'error');
        return;
        }
        if (services.length === 0) {
        addNotification('Sélectionnez au moins un service pour la rotation', 'error');
        return;
        }
        if (!groupeParams.dateDebut || !groupeParams.dateFin || !groupeParams.joursRotation) {
        addNotification('Veuillez spécifier les dates de début, de fin et les jours de rotation', 'error');
        return;
        }
        
        addNotification('Rotation générée avec succès', 'success');
        console.log('Génération des rotations...', {
        groups: generatedGroups,
        services: services,
        params: groupeParams
        });
    };

    const removeFromGroup = (stagiaireId: string, groupId?: string) => {
        const group = generatedGroups.find(g => g._id === groupId);
        const stagiaire = group?.stagiaires.find(t => t._id === stagiaireId);
        
        setGeneratedGroups(groups =>
        groups.map(group =>
            group._id === groupId
            ? { ...group, stagiaires: group.stagiaires.filter(t => t._id !== stagiaireId) }
            : group
        ).filter(group => group.stagiaires.length > 0)
        );
        
        if (stagiaire) {
        addNotification(`${stagiaire.nom} retiré du groupe`, 'success');
        }
    };

    const editGroupName = (newName: string, groupId?: string) => {
        setGeneratedGroups(groups =>
        groups.map(group =>
            group._id === groupId ? { ...group, name: newName } : group
        )
        );
    };

    const calculateTotalDays = () => {
        if (groupeParams.dateDebut && groupeParams.dateFin) {
        const start = new Date(groupeParams.dateDebut);
        const end = new Date(groupeParams.dateFin);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
        }
        return 0;
    };

    // La validation ici est légèrement ajustée pour le chronogramme
    const handleViewChronogramme = () => {
        if (generatedGroups.length === 0) {
        addNotification('Veuillez générer des groupes avant de voir le chronogramme.', 'error');
        return;
        }
        if (services.length === 0) {
        addNotification('Veuillez sélectionner des services avant de voir le chronogramme.', 'error');
        return;
        }
        if (!groupeParams.dateDebut || !groupeParams.dateFin || !groupeParams.joursRotation) {
        addNotification('Veuillez définir les dates de début, de fin et les jours de rotation.', 'error');
        return;
        }
        setShowChronogrammeModal(true);
    };

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

    const handleUpdateGroupe = async (groupe: Groupe) => {
        setGeneratedGroups(prevGroups =>
            prevGroups.map(group =>
            group._id === groupe._id ? groupe : group
            )
        );
    }

    

    return (
        <div className="bg-[#ffffff] rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map(notification => (
            <div
                key={notification.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
                notification.type === 'success' 
                    ? 'bg-[#d1fae5] text-[#10b981] border border-[#a7f3d0]'
                    : 'bg-[#fee2e2] text-[#ef4444] border border-[#fecaca]'
                }`}
            >
                {notification.type === 'success' ? (
                <Check className="h-4 w-4" />
                ) : (
                <AlertCircle className="h-4 w-4" />
                )}
                {notification.message}
            </div>
            ))}
        </div>

        <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-bold text-[#1f2937]">Stage en Groupe</h3>
            <div className="text-sm text-[#4b5563]">
            {selectedStagiaires.length} stagiaires • {services.length} services • {generatedGroups.length} groupes
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Section Stagiaires */}
            <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#374151] flex items-center gap-2">
                <Users className="h-5 w-5" />
                Sélection des Stagiaires
            </h4>
            
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] h-4 w-4" />
                <FilterList
                    items={[]}
                    placeholder={t('recherche.rechercher')+t('recherche.stagiaire')}
                    displayProperty={(item) => `${item.nom} ${item?.prenom || ""}`}
                    onSelect={(selected)=>addStagiaire(selected)}
                    enableBackendSearch={true}
                    onSearch={onSearchStagiaire}
                    searchDelay={300}
                    minSearchLength={2}
                    defaultValue={undefined}
                    noResultsMessage={t('label.aucun_stagiaire')}
                    loadingMessage={t('label.recherche_stagiaire')}
                />
            </div>

            <div className="space-y-2">
                <div className="text-sm font-medium text-[#4b5563]">
                Stagiaires sélectionnés ({selectedStagiaires.length})
                </div>
                <div className="min-h-[120px] bg-[#f9fafb] rounded-lg p-3 border-2 border-dashed border-[#e5e7eb]">
                {selectedStagiaires.length === 0 ? (
                    <div className="text-[#6b7280] text-center py-8 flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-[#d1d5db]" />
                    Aucun stagiaire sélectionné
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                    {selectedStagiaires.map(stagiaire => (
                        <div
                        key={stagiaire._id}
                        className="bg-[#dbeafe] text-[#1e40af] px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-[#bfdbfe] transition-colors duration-150"
                        >
                        {stagiaire.nom}
                        <X
                            className="h-4 w-4 cursor-pointer hover:text-[#dc2626] transition-colors duration-150"
                            onClick={() => removeStagiaire(stagiaire._id || "")}
                        />
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
            </div>

            {/* Section Services */}
            <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#374151]">Sélection des Services</h4>
            
            {!selectedServiceForSupervisor ? (
                <>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] h-4 w-4" />
                    <FilterList
                        items={[]}
                        placeholder={t('recherche.rechercher')+t('recherche.service')}
                        displayProperty={(item) => `${lang==='fr'?item.nomFr:item.nomEn}`}
                        onSelect={(selected) => selectServiceForSupervisor(selected)}
                        enableBackendSearch={true}
                        onSearch={onSearchService}
                        searchDelay={300}
                        minSearchLength={2}
                        defaultValue={undefined}
                        noResultsMessage={t('label.aucun_service')}
                        loadingMessage={t('label.recherche_service')}
                    />
                </div>
                </>
            ) : (
                <>
                <div className="bg-[#dbeafe] border border-[#bfdbfe] rounded-lg p-3">
                    <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-[#1e40af]">Service sélectionné:</div>
                        <div className="text-[#2563eb]">{lang==='fr'?selectedServiceForSupervisor.nomFr:selectedServiceForSupervisor.nomEn}</div>
                    </div>
                    <button
                        onClick={() => setSelectedServiceForSupervisor(null)}
                        className="text-[#2563eb] hover:text-[#dc2626] transition-colors duration-150"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] h-4 w-4" />
                    <FilterList
                        items={[]}
                        placeholder={t('recherche.rechercher')+t('recherche.superviseur')}
                        displayProperty={(item) => `${item.nom} ${item.prenom || ""}`}
                        onSelect={(selected) => addServiceWithSupervisor(selected)}
                        enableBackendSearch={true}
                        onSearch={onSearchSuperviseur}
                        searchDelay={300}
                        minSearchLength={2}
                        defaultValue={undefined}
                        noResultsMessage={t('label.aucun_superviseur')}
                        loadingMessage={t('label.recherche_superviseur')}
                    />
                </div>
                </>
            )}

            <div className="space-y-2">
                <div className="text-sm font-medium text-[#4b5563]">
                Services sélectionnés ({services.length})
                </div>
                <div className="min-h-[120px] bg-[#f9fafb] rounded-lg p-3 border-2 border-dashed border-[#e5e7eb]">
                {services.length === 0 ? (
                    <div className="text-[#6b7280] text-center py-8 flex flex-col items-center gap-2">
                    <Calendar className="h-8 w-8 text-[#d1d5db]" />
                    Aucun service sélectionné
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                    {services.map((service, index) => (
                        <div
                        key={index}
                        className="bg-[#d1fae5] text-[#065f46] px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-[#a7f3d0] transition-colors duration-150"
                        >
                        <div className="font-medium">{lang==='fr'?service?.nomFr:service?.nomEn}</div>
                        <div className="text-sm">({service?.superviseur?.nom})</div>
                        <X
                            className="h-4 w-4 cursor-pointer hover:text-[#dc2626] transition-colors duration-150"
                            onClick={() => removeService(service?._id||"")}
                        />
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
            </div>
        </div>

        {/* Paramètres des groupes */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[#f9fafb] to-[#eff6ff] rounded-lg border border-[#e5e7eb]">
            <h4 className="text-lg font-semibold text-[#374151] mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Paramètres de Création des Groupes
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-[#4b5563] mb-1">Date de début</label>
                <input
                type="date"
                value={groupeParams.dateDebut}
                onChange={(e) => setGroupeParams({ ...groupeParams, dateDebut: e.target.value })}
                className="w-full p-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-[#4b5563] mb-1">Date de fin</label>
                <input
                type="date"
                value={groupeParams.dateFin}
                onChange={(e) => setGroupeParams({ ...groupeParams, dateFin: e.target.value })}
                className="w-full p-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-[#4b5563] mb-1">Stagiaires par groupe</label>
                <input
                type="number"
                min="1"
                max={selectedStagiaires.length}
                placeholder="Ex: 3"
                value={groupeParams.stagiaireParGroupe}
                onChange={(e) => setGroupeParams({ ...groupeParams, stagiaireParGroupe: e.target.value })}
                className="w-full p-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-[#4b5563] mb-1">Jours entre rotations</label>
                <input
                type="number"
                min="1"
                placeholder="Ex: 7"
                value={groupeParams.joursRotation}
                onChange={(e) => setGroupeParams({ ...groupeParams, joursRotation: e.target.value })}
                className="w-full p-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                />
            </div>
            </div>

            {groupeParams.dateDebut && groupeParams.dateFin && (
            <div className="mb-4 p-3 bg-[#dbeafe] rounded-lg">
                <div className="text-sm text-[#1e40af]">
                Durée totale: <span className="font-semibold">{calculateTotalDays()} jours</span>
                {groupeParams.joursRotation && (
                    <span> • Rotations possibles: <span className="font-semibold">{Math.floor(calculateTotalDays() / parseInt(groupeParams.joursRotation))}</span></span>
                )}
                </div>
            </div>
            )}

            <div className="flex gap-4">
            <button
                onClick={generateGroups}
                disabled={selectedStagiaires.length === 0 || !groupeParams.stagiaireParGroupe}
                className="px-6 py-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-[#ffffff] rounded-lg hover:from-[#1d4ed8] hover:to-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
                <Plus className="h-4 w-4" />
                Générer les Groupes
            </button>
            
            <button
                onClick={generateRotation}
                disabled={generatedGroups.length === 0 || !groupeParams.dateDebut || !groupeParams.dateFin || !groupeParams.joursRotation || services.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-[#ffffff] rounded-lg hover:from-[#c2410c] hover:to-[#9a3412] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
                <RotateCcw className="h-4 w-4" />
                Générer Rotation
            </button>
            </div>
        </div>

        {/* Tableau des groupes générés */}
        {generatedGroups.length > 0 && (
            <div className="mt-8">
            <h4 className="text-lg font-semibold text-[#374151] mb-4">Groupes Générés</h4>
            
            <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#f9fafb] to-[#f3f4f6]">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                        Nom du Groupe
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                        Stagiaires ({generatedGroups.reduce((acc, g) => acc + g.stagiaires.length, 0)})
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                        Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-[#ffffff] divide-y divide-[#e5e7eb]">
                    {generatedGroups.map(group => (
                        <tr key={group._id} className="hover:bg-[#f9fafb] transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <input
                            type="text"
                            value={group.nom}
                            onChange={(e) => editGroupName(e.target.value, group._id)}
                            className="font-medium text-[#1f2937] bg-transparent border-none focus:ring-2 focus:ring-[#3b82f6] rounded px-2 py-1 transition-all duration-200"
                            />
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                            {group.stagiaires.map(stagiaire => (
                                <div
                                key={stagiaire._id}
                                className="bg-[#ede9fe] text-[#5b21b6] px-2 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-[#d8b4fe] transition-colors duration-150"
                                >
                                {stagiaire.nom}
                                <X
                                    className="h-3 w-3 cursor-pointer hover:text-[#dc2626] transition-colors duration-150"
                                    onClick={() => removeFromGroup(stagiaire._id||"", group._id)}
                                />
                                </div>
                            ))}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                            <button className="text-[#2563eb] hover:text-[#1e40af] transition-colors duration-150"
                                onClick={()=>{
                                    setSelectedGroupe(group); dispatch(setShowModal())
                                }}
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => {
                                setGeneratedGroups(groups => groups.filter(g => g._id !== group._id));
                                addNotification(`${group.nom} supprimé`, 'success');
                                }}
                                className="text-[#dc2626] hover:text-[#991b1b] transition-colors duration-150"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Boutons d'action */}
            <div className="mt-6 flex gap-4">
                <button 
                onClick={() => addNotification('Groupes enregistrés avec succès', 'success')}
                className="px-6 py-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-[#ffffff] rounded-lg hover:from-[#059669] hover:to-[#047857] flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                >
                <Save className="h-4 w-4" />
                Enregistrer les Groupes
                </button>
                
                <button 
                onClick={handleViewChronogramme}
                className="px-6 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-[#ffffff] rounded-lg hover:from-[#7c3aed] hover:to-[#6d28d9] flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                >
                <Eye className="h-4 w-4" />
                Voir le Chronogramme
                </button>
            </div>
            </div>
        )}

        {/* Chronogramme Modal */}
        {showChronogrammeModal && (
            <ChronogrammeModal
                groups={generatedGroups}
                services={services}
                groupeParams={groupeParams}
                onClose={() => setShowChronogrammeModal(false)}
            />
        )}
            <FormCreateUpdate groupe={selectedGroupe} onEditGroupe={handleUpdateGroupe}/>
        </div>

    );
};

export default GroupStageInterface;