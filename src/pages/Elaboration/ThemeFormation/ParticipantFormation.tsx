import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Plus, User, Mail, Phone, X, Users, Search, Check, UserPlus, Loader2 } from 'lucide-react';
import { searchUtilisateur } from '../../../services/utilisateurs/utilisateurAPI';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../_redux/store';
import { addParticipantFormation, deleteParticipantFormation, getFilteredParticipantFormations } from '../../../services/elaborations/participantFormationAPI';
import { createParticipantFormationSlice, deleteParticipantFormationSlice, setErrorPageParticipantFormation, setParticipantFormationLoading, setParticipantFormations } from '../../../_redux/features/elaborations/participantFormationSlice';
import createToast from '../../../hooks/toastify';
import { getTacheAndUserId, hasTacheExecution } from '../../../fonctions/fonction';
import { updateStatutTacheThemeFormation } from '../../../services/elaborations/tacheThemeFormationAPI';
import BreadcrumbPageDescription from '../../../components/BreadcrumbPageDescription';
import { useTranslation } from 'react-i18next';
import { useFetchData } from '../../../hooks/fechDataOptions';
import Pagination from '../../../components/Pagination/Pagination';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';




// Composant de loading pour la recherche
const SearchLoading: React.FC<{t:any }> = ({ t }) => (
    <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                <div className="w-10 h-10 border-4 border-[#e2e8f0] border-t-[#3b82f6] rounded-full animate-spin"></div>
                <Search className="w-5 h-5 text-[#3b82f6] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[#64748b] text-sm animate-pulse">{t('label.recherche_en_cours')}</p>
        </div>
    </div>
);

// Composant d'état vide pour la recherche
const EmptySearchState: React.FC<{ searchTerm: string, t:any }> = ({ searchTerm, t }) => (
    <div className="text-center py-8">
        <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-[#64748b]" />
        </div>
        <h3 className="text-lg font-medium text-[#374151] mb-2">
            {searchTerm ? t('label.aucun_utilisateur') : t('label.commencez_recherche')}
        </h3>
        <p className="text-[#6b7280] max-w-sm mx-auto">
            {searchTerm 
                ? t('label.essayez_mot_cle')
                : t('label.tapez_car_min')
            }
        </p>
    </div>
);

export default function ParticipantFormation() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    // Refs pour cleanup et debouncing
    const searchTimeoutRef = useRef<NodeJS.Timeout>();
    const latestQueryUtilisateur = useRef<string>('');
    const isMountedRef = useRef<boolean>(true);

    // Redux selectors
    const lang: string = useSelector((state: RootState) => state.setting.language);
    const { data: { participantFormations } } = useSelector((state: RootState) => state.participantFormationSlice);
    const pageIsLoading = useSelector((state: RootState) => state.participantFormationSlice.pageIsLoading);
    const selectedTheme = useSelector((state: RootState) => state.themeFormationSlice.selectedTheme);
    
    // Variables pour la pagination
    const itemsPerPage = useSelector((state: RootState) => state.lieuFormationSlice.data.pageSize);
    const count = useSelector((state: RootState) => state.lieuFormationSlice.data.totalItems);

    const dispatch = useDispatch();
    const fetchData = useFetchData();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Calculs de pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const pageNumbers: number[] = [];
    
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);
    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);


    useEffect(()=>{
            if(!selectedTheme){
                navigate("/elaboration-programme/formation/themes-formation")
            }
    },[])

    // Cleanup function
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Fetch participants avec amélioration des erreurs
    useEffect(() => {
        if (!selectedTheme || !isMountedRef.current) return;

        fetchData({
            apiFunction: getFilteredParticipantFormations,
            params: {
                page: currentPage,
                themeId: selectedTheme?._id || "",
                lang,
            },
            onSuccess: (data) => {
                
                if (isMountedRef.current) {
                    
                    dispatch(setParticipantFormations(data || {
                        participantFormations: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            },
            onError: (error) => {
                if (isMountedRef.current) {
                    const errorMsg = error?.message || t('message.erreur');
                    dispatch(setErrorPageParticipantFormation(errorMsg));
                }
            },
            onLoading: (isLoading) => {
                if (isMountedRef.current) {
                    dispatch(setParticipantFormationLoading(isLoading));
                }
            },
        });
    }, [currentPage, lang, selectedTheme?._id, dispatch, fetchData, t]);

    // Fonction de recherche avec debouncing amélioré
    const searchUtilisateurs = useCallback(async (query: string) => {
        if (!query || query.length < 2) {
            setUtilisateurs([]);
            setIsSearching(false);
            return;
        }

        latestQueryUtilisateur.current = query;
        setIsSearching(true);

        try {
            const result = await searchUtilisateur({ 
                searchString: query, 
                lang 
            });

            // Vérifier que la requête est toujours la plus récente
            if (latestQueryUtilisateur.current === query && isMountedRef.current) {
                if (result?.utilisateurs) {
                    setUtilisateurs(result.utilisateurs);
                } else {
                    setUtilisateurs([]);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la recherche d\'utilisateurs:', error);
            if (latestQueryUtilisateur.current === query && isMountedRef.current) {
                setUtilisateurs([]);
            }
        } finally {
            if (latestQueryUtilisateur.current === query && isMountedRef.current) {
                setIsSearching(false);
            }
        }
    }, [lang, t]);

    // Effect pour la recherche avec debouncing
    useEffect(() => {
        // Nettoyer le timeout précédent
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Définir un nouveau timeout
        searchTimeoutRef.current = setTimeout(() => {
            searchUtilisateurs(searchTerm);
        }, 300); // 300ms de délai

        // Cleanup
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, searchUtilisateurs]);

    // Fonction d'ajout avec gestion d'erreur améliorée
    const ajouterParticipantFormation = async (participantId?: string) => {
        if (!participantId || participantId==="") {
            createToast(t('message.participant_id_manquant'), '', 2);
            return;
        }

        try {
            const response: ReponseApiPros = await addParticipantFormation({
                participantId,
                themeId: selectedTheme?._id || "",
                lang
            });

            if (response.success) {
                createToast(response.message, '', 0);
                dispatch(createParticipantFormationSlice({
                    participantFormation: {
                        _id: response.data._id,
                        participant: response.data.participant
                    }
                }));

                if (hasTacheExecution()) {
                    const { tacheId, userId } = getTacheAndUserId();
                    await updateStatutTacheThemeFormation({
                        tacheId: tacheId || "",
                        currentUser: userId || "",
                        statut: "EN_ATTENTE",
                        donnees: 'check',
                        lang
                    });
                }
                setSearchTerm("");
            } else {
                createToast(response.message, '', 2);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du participant:', error);
            createToast(t('message.erreur'), '', 2);
        }
    };

    // Fonction de suppression avec gestion d'erreur améliorée
    const retirerParticipantFormation = async (participantId?: string) => {
        if (!participantId) {
            createToast(t('message.participant_id_manquant'), '', 2);
            return;
        }

        try {
            const response: ReponseApiPros = await deleteParticipantFormation({
                participantId,
                themeId: selectedTheme?._id || "",
                lang
            });

            if (response.success) {
                createToast(response.message, '', 0);
                dispatch(deleteParticipantFormationSlice({
                    id: participantId
                }));
                setSearchTerm("");
            } else {
                createToast(response.message, '', 2);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du participant:', error);
             createToast(t('message.erreur'), '', 2);
        }
    };

    const getInitials = (nom: string, prenom: string) => {
        return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
    };

    // Fonction pour déterminer le contenu de la zone de recherche
    const renderSearchContent = () => {
        if (isSearching) {
            return <SearchLoading t={t}/>;
        }

        if (searchTerm.length > 0 && searchTerm.length < 2) {
            return <EmptySearchState searchTerm="" t={t} />;
        }

        if (searchTerm.length >= 2 && utilisateurs.length === 0) {
            return <EmptySearchState searchTerm={searchTerm} t={t} />;
        }

        if (utilisateurs.length > 0) {
            return (
                <div className="space-y-3">
                    {utilisateurs.map((utilisateur) => (
                        <div
                            key={utilisateur._id}
                            className="flex items-center justify-between p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl hover:bg-[#f1f5f9] transition-all duration-200 hover:shadow-sm"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-full flex items-center justify-center text-white font-semibold">
                                    {getInitials(utilisateur.nom, utilisateur.prenom || "")}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-[#1e293b]">
                                        {utilisateur.nom} {utilisateur.prenom || ""}
                                    </h4>
                                    <div className="text-sm text-[#64748b] space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3 h-3" />
                                            <span>{utilisateur.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => ajouterParticipantFormation(utilisateur._id || "")}
                                className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                {t('button.ajouter')}
                            </button>
                        </div>
                    ))}
                </div>
            );
        }

        return <EmptySearchState searchTerm="" t={t} />;
    };

    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.participant_formation')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.participants_formation')} 
                breadcrumbItems={[{
                    isActive: false,
                    name: t('sub_menu.themes_formations'),
                    path: "/elaboration-programme/formation/themes-formation"
                }, {
                    isActive: true,
                    name: t('sub_menu.participants_formation'),
                    path: "#"
                }]}
            />
            <div className="min-h-screen bg-[#f8fafc] p-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="bg-[#ffffff] rounded-2xl shadow-lg p-6 border border-[#e2e8f0]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-2 bg-[#eff6ff] px-4 py-2 rounded-lg">
                                    <Users className="w-4 h-4 text-[#3b82f6]" />
                                    <span className="font-semibold text-[#3b82f6]">
                                        {participantFormations? participantFormations.length:0} {t('label.inscrits')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interface de sélection des participants */}
                    <div className="mb-6">
                        <div className="bg-[#ffffff] rounded-2xl shadow-lg border border-[#e2e8f0] overflow-hidden">
                            <div className="p-6">
                                {/* Barre de recherche avec indicateur de loading */}
                                <div className="mb-6 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748b] w-5 h-5" />
                                    {isSearching && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <Loader2 className="w-5 h-5 text-[#3b82f6] animate-spin" />
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder={`${t('recherche.rechercher')} ${t('recherche.participant')}`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none transition-all duration-200"
                                    />
                                </div>

                                {/* Zone de contenu de recherche */}
                                <div className="max-h-96 overflow-y-auto">
                                    {renderSearchContent()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des participants inscrits */}
                    <div className="bg-[#ffffff] rounded-2xl shadow-lg border border-[#e2e8f0] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] px-6 py-4 border-b border-[#e2e8f0]">
                            <h3 className="text-lg font-semibold text-[#1e293b]">{t('label.participant_inscrits')}</h3>
                        </div>
                        
                        {pageIsLoading ? (
                            <Skeleton height={300} />
                        ) : participantFormations && participantFormations.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-[#64748b]" />
                                </div>
                                <h3 className="text-lg font-medium text-[#374151] mb-2">
                                    {t('label.aucun_participant_inscrit')}
                                </h3>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="grid gap-4 p-6">
                                    {participantFormations && participantFormations.map((p) => (
                                        <div
                                            key={p._id}
                                            className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-6 hover:bg-[#f1f5f9] transition-all duration-200 hover:shadow-md"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center text-white font-semibold">
                                                            {getInitials(p.participant.nom, p.participant.prenom || "")}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-[#1e293b] text-lg">
                                                                {p.participant.nom} {p.participant.prenom}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                        <div className="flex items-center gap-2 text-[#64748b]">
                                                            <Mail className="w-4 h-4 text-[#3b82f6]" />
                                                            <span>{p.participant.email}</span>
                                                        </div>
                                                        {p.participant.telephone && (
                                                            <div className="flex items-center gap-2 text-[#64748b]">
                                                                <Phone className="w-4 h-4 text-[#10b981]" />
                                                                <span>{p.participant.telephone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => retirerParticipantFormation(p._id)}
                                                        className="flex items-center gap-2 bg-[#ef4444] hover:bg-[#dc2626] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        {t('button.retirer')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {participantFormations && participantFormations.length > 0 && (
                <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={setCurrentPage}
                />
            )}
        </>
    );
}