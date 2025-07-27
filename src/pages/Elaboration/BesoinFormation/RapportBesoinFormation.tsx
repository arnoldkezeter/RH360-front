import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { TrendingUp, Users, Calendar, Target, AlertTriangle, Tag, BarChart3, Activity, CheckCircle, XCircle, Clock, ChevronUp, ChevronDown, Filter, User } from 'lucide-react';
import { useStatsAnalyses } from '../../../hooks/useFecthRapportBesoin';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../_redux/store';
import { CardStat } from '../../../components/ui/Card';
import { useTranslation } from 'react-i18next';
import { monthsFullEn, monthsFullFr, STATUT_BESOIN } from '../../../config';
import { truncateText } from '../../../fonctions/fonction';
import { useFetchData } from '../../../hooks/fechDataOptions';
import { getPosteDeTravailForDropDown } from '../../../services/settings/posteDeTravailAPI';
import { setErrorPagePosteDeTravail, setPosteDeTravails } from '../../../_redux/features/parametres/posteDeTravailSlice';
import { FaFilter, FaSort } from 'react-icons/fa';
import CustomDropDown2 from '../../../components/DropDown/CustomDropDown2';
import CustomChartTooltip from '../../../components/ui/CustomTooltip';
import { getGroupedAutoEvaluations } from '../../../services/elaborations/autoEvaluationBesoinAPI';
import { getGroupedBesoinsAjoutes } from '../../../services/elaborations/besoinAjouteUtilisateurAPI';
import BreadcrumbPageDescription from '../../../components/BreadcrumbPageDescription';
import Skeleton from 'react-loading-skeleton';
import { NoData } from '../../../components/NoData';
import { setErrorPageGroupedBesoin, setGroupedBesoinLoading, setGroupedBesoins } from '../../../_redux/features/elaborations/groupedBesoinSlice';
import Pagination from '../../../components/Pagination/Pagination';
import { setErrorPageGroupedCompetence, setGroupedCompetenceLoading, setGroupedCompetences } from '../../../_redux/features/elaborations/groupedCompetenceSlice';
import InputSearch from '../../../components/Tables/common/SearchTable';
import { setShowModalCompetence, setShowModalEvaluation } from '../../../_redux/features/setting';
import FormCreateUpdateEvaluation from '../../../components/Modals/Elaboration/BesoinFormation/ModalBesoinFormation/FormCreateUpdateEvaluation';
import FormCreateUpdate from '../../../components/Modals/Elaboration/BesoinFormation/ModalBesoinAjouteUtilisateur/FormCreateUpdateEvaluationCompetence';

const RapportAutoEvaluation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBesoin, setSelectedBesoin] = useState('');
  const lang = useSelector((state: RootState) => state.setting.language);
  const { data: { familleMetiers = [] } } = useSelector((state: RootState) => state.familleMetierSlice); 
  const { data: { posteDeTravails = [] } } = useSelector((state: RootState) => state.posteDeTavailSlice);  
  const { data: { groupedBesoins = [] } } = useSelector((state: RootState) => state.groupedBesoinSlice); 
  const { data: { groupedCompetences = [] } } = useSelector((state: RootState) => state.groupedCompetenceSlice);  
  const [currentFamilleMetier, setCurrentFamilleMetier] = useState<FamilleMetier | undefined>();
  const [currentPoste, setCurrentPoste] = useState<PosteDeTravail | undefined>();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [currentPageBesoin, setCurrentPageBesoin] = useState<number>(1);
  const [currentPageCompetence, setCurrentPageCompetence] = useState<number>(1);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedBesoinId, setSelectedBesoinId] = useState("");
  const [selectedGroupeBesoin, setSelectedGroupeBesoin] = useState<GroupedBesoin | undefined>(undefined);
  const [selectedGroupeCompetence, setSelectedGroupeCompetence] = useState<GroupedCompetence | undefined>(undefined);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fetchData = useFetchData();
  const statuts = Object.values(STATUT_BESOIN);

  // Pagination pour auto evaluation des besoins
  const itemsPerPageBesoin = useSelector((state: RootState) => state.groupedBesoinSlice.data.pageSize); 
  const countBesoin = useSelector((state: RootState) => state.groupedBesoinSlice.data.totalItems);
  const indexOfLastItemBesoin = currentPageBesoin * itemsPerPageBesoin;
  const indexOfFirstItemBesoin = (currentPageBesoin - 1) * itemsPerPageBesoin;
  
  const pageNumbersBesoin: number[] = [];
  for (let i = 1; i <= Math.ceil(countBesoin / itemsPerPageBesoin); i++) {
    pageNumbersBesoin.push(i);
  }

  const hasPreviousBesoin = currentPageBesoin > 1;
  const hasNextBesoin = currentPageBesoin < Math.ceil(countBesoin / itemsPerPageBesoin);
  const startItemBesoin = indexOfFirstItemBesoin + 1;
  const endItemBesoin = Math.min(countBesoin, indexOfLastItemBesoin);

  // Pagination pour auto evaluation des compétences
  const itemsPerPageCompetence = useSelector((state: RootState) => state.groupedCompetenceSlice.data.pageSize); 
  const countCompetence = useSelector((state: RootState) => state.groupedCompetenceSlice.data.totalItems);
  const indexOfLastItemCompetence = currentPageCompetence * itemsPerPageCompetence;
  const indexOfFirstItemCompetence = (currentPageCompetence - 1) * itemsPerPageCompetence;
  
  const pageNumbersCompetence: number[] = [];
  for (let i = 1; i <= Math.ceil(countCompetence / itemsPerPageCompetence); i++) {
    pageNumbersCompetence.push(i);
  }

  const hasPreviousCompetence = currentPageCompetence > 1;
  const hasNextCompetence = currentPageCompetence < Math.ceil(countCompetence / itemsPerPageCompetence);
  const startItemCompetence = indexOfFirstItemCompetence + 1;
  const endItemCompetence = Math.min(countCompetence, indexOfLastItemCompetence);

  // États pour la recherche
  const [searchTextBesoin, setSearchTextBesoin] = useState<string>('');
  const [isSearchBesoin, setIsSearchBesoin] = useState<boolean>(false);
  const [filteredDataBesoin, setFilteredDataBesoin] = useState<GroupedBesoin[]>(groupedBesoins);
  const latestQuerygroupedBesoin = useRef('');

  const [searchTextCompetence, setSearchTextCompetence] = useState<string>('');
  const [isSearchCompetence, setIsSearchCompetence] = useState<boolean>(false);
  const [filteredDataCompetence, setFilteredDataCompetence] = useState<GroupedCompetence[]>(groupedCompetences);
  const latestQuerygroupedCompetence = useRef('');
  
  // Initialisation de la famille métier
  useEffect(() => {
    if (familleMetiers && familleMetiers.length > 0) {
      setCurrentFamilleMetier(familleMetiers[0]);
    }
  }, [familleMetiers]);

  // Récupération des postes de travail basés sur la famille métier
  useEffect(() => {
    if (!currentFamilleMetier || !currentFamilleMetier._id) return;
    
    fetchData({
      apiFunction: getPosteDeTravailForDropDown,
      params: { lang, familleMetierId: currentFamilleMetier._id },
      onSuccess: (data) => {
        dispatch(setPosteDeTravails(data));
        if (data.posteDeTravails?.length > 0) {
          setCurrentPoste(data.posteDeTravails[0]);
        } else {
          setCurrentPoste(undefined);
        }
      },
      onError: () => {
        dispatch(setErrorPagePosteDeTravail(t('message.erreur')));
      },
    });
  }, [currentFamilleMetier, lang, fetchData, dispatch, t]);

  // Récupération des données groupées de besoins
  useEffect(() => {
    const fetchGroupedBesoins = async () => {
      try {
        const result = await getGroupedAutoEvaluations({ page: currentPageBesoin, lang });
        dispatch(setGroupedBesoins(result));
      } catch (error) {
        dispatch(setErrorPageGroupedBesoin(t('message.erreur')));
      }
    };
    fetchGroupedBesoins();
  }, [currentPageBesoin, dispatch, lang, t]);

  // Gestion de la recherche pour les besoins
  useEffect(() => {
    setIsSearchBesoin(searchTextBesoin !== '');
  }, [searchTextBesoin]);

  useEffect(() => {
    dispatch(setGroupedBesoinLoading(true));
    latestQuerygroupedBesoin.current = searchTextBesoin;
    
    const filtergroupedBesoinByContent = async () => {
      if (searchTextBesoin === '') {
        setFilteredDataBesoin(groupedBesoins);
      } else {
        try {
          const result = await getGroupedAutoEvaluations({ search: searchTextBesoin, lang });
          if (latestQuerygroupedBesoin.current === searchTextBesoin && result) {
            setFilteredDataBesoin(result.groupedBesoins || []);
          }
        } catch (error) {
          dispatch(setErrorPageGroupedBesoin(t('message.erreur')));
        }
      }
      
      if (latestQuerygroupedBesoin.current === searchTextBesoin) {
        dispatch(setGroupedBesoinLoading(false));
      }
    };

    filtergroupedBesoinByContent();
  }, [searchTextBesoin, groupedBesoins, lang, dispatch, t]);

  // Récupération des données groupées de compétences
  useEffect(() => {
    const fetchGroupedCompetences = async () => {
      try {
        const result = await getGroupedBesoinsAjoutes({ page: 1, lang });
        dispatch(setGroupedCompetences(result));
      } catch (error) {
        dispatch(setErrorPageGroupedCompetence(t('message.erreur')));
      }
    };
    fetchGroupedCompetences();
  }, [currentPageCompetence, dispatch, lang, t]);

  // Gestion de la recherche pour les compétences
  useEffect(() => {
    setIsSearchCompetence(searchTextCompetence !== '');
  }, [searchTextCompetence]);

  useEffect(() => {
    dispatch(setGroupedCompetenceLoading(true));
    latestQuerygroupedCompetence.current = searchTextCompetence;
    
    const filtergroupedCompetenceByContent = async () => {
      if (searchTextCompetence === '') {
        setFilteredDataCompetence(groupedCompetences);
      } else {
        try {
          const result = await getGroupedBesoinsAjoutes({ search: searchTextCompetence, lang });
          if (latestQuerygroupedCompetence.current === searchTextCompetence && result) {
            setFilteredDataCompetence(result.groupedCompetences || []);
          }
        } catch (error) {
          dispatch(setErrorPageGroupedCompetence(t('message.erreur')));
        }
      }
      
      if (latestQuerygroupedCompetence.current === searchTextCompetence) {
        dispatch(setGroupedCompetenceLoading(false));
      }
    };

    filtergroupedCompetenceByContent();
  }, [searchTextCompetence, groupedCompetences, lang, dispatch, t]);

  const { data, error, loading } = useStatsAnalyses({ lang, posteId: currentPoste?._id });

  const toggleDropdownVisibility = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handlePosteSelect = (selected: PosteDeTravail | undefined) => {
    if (selected) {
      setCurrentPoste(selected);
    }
  };

  const handleFamilleMetierSelect = (selected: FamilleMetier | undefined) => {
    if (selected) {
      setCurrentFamilleMetier(selected);
    }
  };

  interface TabButtonProps {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    active: boolean;
    onClick: (id: string) => void;
  }

  const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        active
          ? 'bg-[#3b82f6] text-white shadow-md'
          : 'text-gray-600 hover:text-[#3b82f6] hover:bg-[#dbeafe]'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );
  
  const formatDataForChart = () => {
    if (!data?.repartitionBesoinNiveauPoste || !Array.isArray(data.repartitionBesoinNiveauPoste)) {
      return [];
    }
    
    return data.repartitionBesoinNiveauPoste.map((item: any) => ({
      ...item,
      titre: lang === 'en' ? item.titreEn : item.titreFr
    }));
  };

  const formatDataForChartBesoin = () => {
    if (!data?.repartitionBesoinPoste || !Array.isArray(data.repartitionBesoinPoste)) {
      return [];
    }
    
    return data.repartitionBesoinPoste.map((item: any) => ({
      ...item,
      nom: lang === 'en' ? item.nomEn : item.nomFr
    }));
  };

  const formatDataForChartCompetence = () => {
    if (!data?.repartitionCompetencePoste || !Array.isArray(data.repartitionCompetencePoste)) {
      return [];
    }
    
    return data.repartitionCompetencePoste.map((item: any) => ({
      ...item,
      nom: lang === 'en' ? item.nomEn : item.nomFr
    }));
  };

  const toggleExpand = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleExpandCompetence = (cardId: string): void => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const getStatusConfig = (statut: string) => {
    switch (statut) {
      case 'VALIDE':
        return {
          color: "bg-[#dcfce7] text-[#166534] border border-[#86efac] shadow-sm hover:bg-[#bbf7d0]",
          icon: CheckCircle,
          label: lang === 'fr' ? statuts.find(s => s.key === statut)?.nomFr || '' : statuts.find(s => s.key === statut)?.nomEn || ''
        };
      case 'REJETE':
        return {
          color: 'bg-[#fef2f2] text-[#991b1b] border border-[#fca5a5] shadow-sm hover:bg-[#fee2e2]',
          icon: XCircle,
          label: lang === 'fr' ? statuts.find(s => s.key === statut)?.nomFr || '' : statuts.find(s => s.key === statut)?.nomEn || ''
        };
      default:
        return {
          color: 'bg-[#fefce8] text-[#a16207] border border-[#fde047] shadow-sm hover:bg-[#fef3c7]',
          icon: Clock,
          label: lang === 'fr' ? statuts.find(s => s.key === statut)?.nomFr || '' : statuts.find(s => s.key === statut)?.nomEn || ''
        };
    }
  };

  const formatPoints = (points: string): string[] => {
    if (!points) return [];
    return points.split(/[,;/-]/).map(point => point.trim()).filter(point => point.length > 0);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOpenEvaluationModal = (userId: string, groupedBesoin: GroupedBesoin) => {
    setSelectedUserId(userId);
    setSelectedGroupeBesoin(groupedBesoin);
    dispatch(setShowModalEvaluation());
  };

  const handleOpenCompetenceModal = (besoinId: string, groupedCompetence: GroupedCompetence) => {
    setSelectedBesoinId(besoinId);
    setSelectedGroupeCompetence(groupedCompetence);
    dispatch(setShowModalCompetence());
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <BreadcrumbPageDescription 
          pageDescription={t('page_description.besoins_formation_rapport')} 
          titleColor="text-[#1e3a8a]" 
          pageName={t('sub_menu.besoins_formation_rapport')} 
        />

        <div className="p-6">
          <div className="flex space-x-2 mb-8 overflow-x-auto">
            <TabButton id="overview" label={t('label.vue_ensemble')} icon={BarChart3} active={activeTab === 'overview'} onClick={setActiveTab} />
            <TabButton id="evaluations" label={t('label.evaluations')} icon={Target} active={activeTab === 'evaluations'} onClick={setActiveTab} />
            <TabButton id="users" label={t('label.poste_de_travail')} icon={Users} active={activeTab === 'users'} onClick={setActiveTab} />
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardStat
                  title={t('label.taux_validation')}
                  value={`${data?.tauxValidation?.tauxValidation || 0}%`}
                  icon={<Target className="w-8 h-8 text-[#3b82f6]" />}
                  color="bg-[#f0fdf4] dark:bg-[#14532d]/20"
                  footer={`${data?.tauxValidation?.valides || 0}/${data?.tauxValidation?.total || 0} évaluations`}
                  isLoading={loading}
                />
                <CardStat
                  title={t('label.valides')}
                  value={`${data?.tauxValidation?.valides || 0}`}
                  icon={<CheckCircle className="w-8 h-8 text-[#16a34a]" />}
                  color="bg-[#f0fdf4] dark:bg-[#16653433]"
                  isLoading={loading}
                />
                <CardStat
                  title={t('label.rejetees')}
                  value={`${data?.tauxValidation?.rejetees || 0}`}
                  icon={<XCircle className="w-8 h-8 text-[#dc2626]" />}
                  color="bg-[#fef2f2] dark:bg-[#7f1d1d33]"
                  isLoading={loading}
                />
                <CardStat
                  title={t('label.en_attentes')}
                  value={`${data?.tauxValidation?.enAttente || 0}`}
                  icon={<Clock className="w-8 h-8 text-[#ca8a04]" />}
                  color="bg-[#fefce8] dark:bg-[#78350f33]"
                  isLoading={loading}
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-stroke p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('label.evolution_mensuelle')}
                </h3>
                {loading ? (
                  <Skeleton height={300}/>
                ) : (
                  (!data?.parMois?.data || data.parMois.data.length === 0) ? (
                    <NoData/>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={data.parMois.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="_id.month" 
                          tick={{ fontSize: 12 }}
                          interval="preserveStartEnd"
                          tickFormatter={(value) => {
                            return `${lang === 'fr' ? monthsFullFr[value - 1] : monthsFullEn[value - 1]}` || value;
                          }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          labelFormatter={(value) => {
                            return `${lang === 'fr' ? monthsFullFr[value - 1] : monthsFullEn[value - 1]}` || value;
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="total" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.3} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-stroke p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('label.besoin_prioritaire')}</h3>
                {loading ? (
                  <Skeleton height={200}/>
                ) : (
                  (!data?.faibles?.data || data.faibles.data.length === 0) ? (
                    <NoData/>
                  ) : (
                    <div className="space-y-3">
                      {data.faibles.data.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-[#fef2f2] rounded-lg border border-[#fecaca]"
                        >
                          <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-[#ef4444] mr-3 shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.titre}</p>
                              <p className="text-sm text-gray-600">{t('label.niveau')}: {item?.niveau}</p>
                              <p className="text-sm text-gray-600">
                                {t('label.nombre_utilisateurs')}: {item?.count}
                              </p>
                              {item?.postes?.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-xs text-gray-500">{t('label.postes_concernes')}:</p>
                                  <ul className="list-disc list-inside text-xs text-gray-700">
                                    {item.postes.map((poste: any, idx: number) => (
                                      <li key={idx}>{poste.nom}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === 'evaluations' && (
            <div className="space-y-8">
              <div className="grid gap-6">
                <div className="bg-[#ffffff] rounded-2xl shadow-lg border border-[#f1f5f9] p-8 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] rounded-full"></div>
                    <h3 className="text-xl font-bold text-[#1e293b] tracking-tight">
                      {t("label.resultat_auto_evaluation")}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                    <InputSearch hintText={t('label.recherche')} value={searchTextBesoin} onSubmit={(text) => setSearchTextBesoin(text)} />
                  </div>
                  {loading ? (
                    <Skeleton height={300}/>
                  ) : (
                    filteredDataBesoin.length === 0 ? (
                      <NoData/>
                    ) : (
                      <div className="space-y-3">
                        {filteredDataBesoin.map((group, index) => (
                          <div 
                            key={index} 
                            className="group border border-[#e2e8f0] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#cbd5e1]"
                          >
                            <button
                              onClick={() => toggleExpand(index)}
                              className="w-full flex justify-between items-center p-5 text-left bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] hover:from-[#f1f5f9] hover:to-[#e2e8f0] transition-all duration-200"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-bold text-[#0f172a] text-lg">
                                    {lang === "fr" ? group.titreFr : group.titreEn}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#dbeafe] text-[#1e40af] border border-[#93c5fd]">
                                      {group.count} {t('label.evaluation')}{group.count > 1 ? 's' : ''}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fcd34d]">
                                      {t('label.niveau')} {group.niveau}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4 transition-transform duration-200 group-hover:scale-110">
                                {expanded[index] ? (
                                  <ChevronUp className="w-6 h-6 text-[#64748b]" />
                                ) : (
                                  <ChevronDown className="w-6 h-6 text-[#64748b]" />
                                )}
                              </div>
                            </button>

                            {expanded[index] && (
                              <div className="bg-[#ffffff] border-t border-[#f1f5f9]">
                                <div className="p-6 space-y-4">
                                  {group.evaluations.map((evalItem, i) => (
                                    <div 
                                      key={i} 
                                      className="flex justify-between items-center p-4 rounded-xl bg-[#fafbfc] border border-[#f1f5f9] hover:bg-[#f8fafc] hover:border-[#e2e8f0] transition-all duration-200"
                                    >
                                      <div className="flex flex-col gap-1">
                                        <div className="font-semibold text-[#1e293b]">
                                          {evalItem.utilisateurNom} {evalItem.utilisateurPrenom}
                                        </div>
                                        <div className="text-sm text-[#64748b] flex items-center gap-1">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                          {formatDate(evalItem.createdAt)}
                                        </div>
                                      </div>

                                      <div className="flex items-center">
                                        <button
                                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                                            evalItem.statut === "valide"
                                              ? "bg-[#dcfce7] text-[#166534] border border-[#86efac] shadow-sm"
                                              : evalItem.statut === "rejete"
                                              ? "bg-[#fef2f2] text-[#991b1b] border border-[#fca5a5] shadow-sm"
                                              : "bg-[#fefce8] text-[#a16207] border border-[#fde047] shadow-sm"
                                          }`}
                                          onClick={() => handleOpenEvaluationModal(evalItem.utilisateurId, group)}
                                        >
                                          <div className={`w-2 h-2 rounded-full mr-2 ${
                                            evalItem.statut === "valide"
                                              ? "bg-[#22c55e]"
                                              : evalItem.statut === "rejete"
                                              ? "bg-[#ef4444]"
                                              : "bg-[#f59e0b]"
                                          }`}></div>
                                          {lang === 'fr' ? statuts.find(s => s.key === evalItem.statut)?.nomFr || '' : statuts.find(s => s.key === evalItem.statut)?.nomEn || ''}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                  {filteredDataBesoin && filteredDataBesoin.length > 0 && (
                    <Pagination
                      count={countBesoin}
                      itemsPerPage={itemsPerPageBesoin}
                      startItem={startItemBesoin}
                      endItem={endItemBesoin}
                      hasPrevious={hasPreviousBesoin}
                      hasNext={hasNextBesoin}
                      currentPage={currentPageBesoin}
                      pageNumbers={pageNumbersBesoin}
                      handlePageClick={setCurrentPageBesoin}
                    />
                  )}
                </div>

                <div className="bg-[#ffffff] rounded-2xl shadow-lg border border-[#f1f5f9] p-8 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] rounded-full"></div>
                    <h3 className="text-xl font-bold text-[#1e293b] tracking-tight">
                      {t('label.competence_utilisateur')}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                    <InputSearch hintText={t('label.recherche')} value={searchTextCompetence} onSubmit={(text) => setSearchTextCompetence(text)} />
                  </div>
                  {loading ? (
                    <Skeleton height={300}/>
                  ) : (
                    filteredDataCompetence.length === 0 ? (
                      <NoData/>
                    ) : (
                      <div className="space-y-3">
                        {filteredDataCompetence.map((user: GroupedCompetence) => {
                          const userExpanded = expandedCards[`user-${user.utilisateurId}`];
                          
                          return (
                            <div key={user.utilisateurId} className="space-y-3">
                              <div className="group border border-[#e2e8f0] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#cbd5e1]">
                                <button
                                  onClick={() => toggleExpandCompetence(`user-${user.utilisateurId}`)}
                                  className="w-full flex justify-between items-center p-5 text-left bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] hover:from-[#f1f5f9] hover:to-[#e2e8f0] transition-all duration-200"
                                >
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-2xl flex items-center justify-center">
                                      <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-1">
                                        <h2 className="font-bold text-[#0f172a] text-lg">
                                          {user.prenom} {user.nom}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#dbeafe] text-[#1e40af] border border-[#93c5fd]">
                                            {user.count} {user.count > 1 ? 'besoins' : 'besoin'}
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-sm text-[#64748b]">{user.email}</p>
                                    </div>
                                  </div>
                                  <div className="ml-4 transition-transform duration-200 group-hover:scale-110">
                                    {userExpanded ? (
                                      <ChevronUp className="w-6 h-6 text-[#64748b]" />
                                    ) : (
                                      <ChevronDown className="w-6 h-6 text-[#64748b]" />
                                    )}
                                  </div>
                                </button>

                                {userExpanded && (
                                  <div className="bg-[#ffffff] border-t border-[#f1f5f9]">
                                    <div className="p-6 space-y-4">
                                      {user.besoins.map((besoin: BesoinUtilisateur, besoinIndex: number) => {
                                        const titleCardId = `title-${user.utilisateurId}-${besoinIndex}`;
                                        const statusConfig = getStatusConfig(besoin.statut);
                                        const StatusIcon = statusConfig.icon;
                                        const titleExpanded = expandedCards[titleCardId];
                                        const points = formatPoints(besoin.pointsAAmeliorer || "");

                                        return (
                                          <div key={titleCardId} className="space-y-0">
                                            <div className="group border border-[#e2e8f0] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#cbd5e1]">
                                              <button
                                                onClick={() => toggleExpandCompetence(titleCardId)}
                                                className="w-full flex justify-between items-center p-5 text-left bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] hover:from-[#f1f5f9] hover:to-[#e2e8f0] transition-all duration-200"
                                              >
                                                <div className="flex-1">
                                                  <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-bold text-[#0f172a] text-lg line-clamp-2">
                                                      {besoin.titre}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                      {points.length > 0 && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fcd34d]">
                                                          {points.length} {t('label.point')}{points.length > 1 ? 's' : ''}
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className="text-sm text-[#64748b] flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(besoin.createdAt)}
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                  <button 
                                                    className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 ${statusConfig.color}`}
                                                    onClick={() => handleOpenCompetenceModal(besoin.besoinId || "", user)}
                                                  >
                                                    <StatusIcon className="w-3 h-3 mr-1" />
                                                    {statusConfig.label}
                                                  </button>
                                                  {points.length > 0 && (
                                                    <div className="transition-transform duration-200 group-hover:scale-110">
                                                      {titleExpanded ? (
                                                        <ChevronUp className="w-6 h-6 text-[#64748b]" />
                                                      ) : (
                                                        <ChevronDown className="w-6 h-6 text-[#64748b]" />
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              </button>

                                              {titleExpanded && points.length > 0 && (
                                                <div className="bg-[#ffffff] border-t border-[#f1f5f9]">
                                                  <div className="p-6 space-y-4">
                                                    <h4 className="text-sm font-semibold text-[#374151] mb-3 flex items-center gap-2">
                                                      <div className="w-2 h-2 bg-[#f59e0b] rounded-full"></div>
                                                      {t('label.point_a_ameliorer')}
                                                    </h4>
                                                    {points.map((point: string, pointIndex: number) => (
                                                      <div 
                                                        key={pointIndex}
                                                        className="flex justify-between items-center p-4 rounded-xl bg-[#fafbfc] border border-[#f1f5f9] hover:bg-[#f8fafc] hover:border-[#e2e8f0] transition-all duration-200"
                                                      >
                                                        <div className="flex items-start gap-3">
                                                          <div className="w-1.5 h-1.5 bg-[#64748b] rounded-full mt-2 flex-shrink-0"></div>
                                                          <p className="text-sm text-[#374151] leading-relaxed">{point}</p>
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}

                                              {titleExpanded && points.length === 0 && (
                                                <div className="bg-[#ffffff] border-t border-[#f1f5f9]">
                                                  <div className="p-6">
                                                    <p className="text-sm text-[#64748b] italic text-center py-2">
                                                      {t('label.aucun_point')}
                                                    </p>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                  {filteredDataCompetence && filteredDataCompetence.length > 0 && (
                    <Pagination
                      count={countCompetence}
                      itemsPerPage={itemsPerPageCompetence}
                      startItem={startItemCompetence}
                      endItem={endItemCompetence}
                      hasPrevious={hasPreviousCompetence}
                      hasNext={hasNextCompetence}
                      currentPage={currentPageCompetence}
                      pageNumbers={pageNumbersCompetence}
                      handlePageClick={setCurrentPageCompetence}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg border border-stroke p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('label.repartition_besoin_niveau')}
                    </h3>
                  </div>
                </div>
          
                <div className="mb-6">
                  <div className="block lg:hidden">
                    <button className="px-2.5 py-1 border border-gray text-[12px] mb-2 flex justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}>
                      <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort />
                    </button>
                    {isDropdownVisible && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4 max-h-80 overflow-y-auto">
                        <CustomDropDown2<FamilleMetier>
                          title={t('label.famille_metier')}
                          selectedItem={currentFamilleMetier}
                          items={familleMetiers}
                          defaultValue={undefined}
                          displayProperty={(familleMetier: FamilleMetier) => `${lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn}`}
                          onSelect={handleFamilleMetierSelect}
                        />
                        
                        <CustomDropDown2<PosteDeTravail>
                          title={t('label.poste_de_travail')}
                          selectedItem={currentPoste}
                          items={posteDeTravails}
                          defaultValue={undefined}
                          displayProperty={(poste: PosteDeTravail) => `${lang === 'fr' ? poste.nomFr : poste.nomEn}`}
                          onSelect={handlePosteSelect}
                        />
                      </div>
                    )}
                  </div>
                
                  <div className="hidden lg:block">
                    <div className="flex gap-4">
                      <div className="min-w-[300px]">
                        <CustomDropDown2<FamilleMetier>
                          title={t('label.famille_metier')}
                          selectedItem={currentFamilleMetier}
                          items={familleMetiers}
                          defaultValue={undefined}
                          displayProperty={(familleMetier: FamilleMetier) =>
                            `${lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn}`
                          }
                          onSelect={handleFamilleMetierSelect}
                        />
                      </div>

                      <div className="min-w-[300px]">
                        <CustomDropDown2<PosteDeTravail>
                          title={t('label.poste_de_travail')}
                          selectedItem={currentPoste}
                          items={posteDeTravails}
                          defaultValue={undefined}
                          displayProperty={(poste: PosteDeTravail) =>
                            `${lang === 'fr' ? poste.nomFr : poste.nomEn}`
                          }
                          onSelect={handlePosteSelect}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                        
                {loading ? (
                  <Skeleton height={300}/>
                ) : (
                  formatDataForChart().length === 0 ? (
                    <NoData/>
                  ) : (
                    <div className="h-80 sm:h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={formatDataForChart()}
                          margin={{ 
                            top: 20, 
                            right: 20, 
                            left: 10, 
                            bottom: typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 40 
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          
                          <XAxis 
                            dataKey="titre"
                            height={60}
                            interval={0}
                            fontSize={11}
                            stroke="#6b7280"
                            tickFormatter={(value) => truncateText(value, 15)}
                          />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip content={<CustomChartTooltip />} />
                          <Legend 
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="rect"
                          />
                          
                          <Bar 
                            dataKey="niveau1" 
                            stackId="a" 
                            fill="#fde68a" 
                            name={t('label.niveau_1')}
                            radius={[0, 0, 0, 0]}
                          />
                          <Bar 
                            dataKey="niveau2" 
                            stackId="a" 
                            fill="#fcd34d" 
                            name={t('label.niveau_2')}
                            radius={[0, 0, 0, 0]}
                          />
                          <Bar 
                            dataKey="niveau3" 
                            stackId="a" 
                            fill="#fbbf24" 
                            name={t('label.niveau_3')}
                            radius={[0, 0, 0, 0]}
                          />
                          <Bar 
                            dataKey="niveau4" 
                            stackId="a" 
                            fill="#f59e0b" 
                            name={t('label.niveau_4')}
                            radius={[2, 2, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-stroke p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('label.repartition_besoin_poste')}
                </h3>
                {loading ? (
                  <Skeleton height={300}/>
                ) : (
                  formatDataForChartBesoin().length === 0 ? (
                    <NoData/>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={formatDataForChartBesoin()} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="nom" 
                          height={60}
                          interval={0}
                          fontSize={11}
                          stroke="#6b7280"
                          tickFormatter={(value) => truncateText(value, 15)}
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value, name, props) => [
                            value,
                            t('label.nombre_besoin')
                          ]}
                        />
                        <Bar 
                          dataKey="nombreBesoins" 
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-stroke p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('label.repartition_competence_poste')}
                </h3>
                {loading ? (
                  <Skeleton height={300}/>
                ) : (
                  formatDataForChartCompetence().length === 0 ? (
                    <NoData/>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={formatDataForChartCompetence()} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="nom" 
                          height={60}
                          interval={0}
                          fontSize={11}
                          stroke="#6b7280"
                          tickFormatter={(value) => truncateText(value, 15)}
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value, name, props) => [
                            value,
                            t('label.nombre_competence')
                          ]}
                        />
                        <Bar 
                          dataKey="nombreBesoins" 
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <FormCreateUpdateEvaluation groupedBesoin={selectedGroupeBesoin} userId={selectedUserId} />
      <FormCreateUpdate groupedCompetence={selectedGroupeCompetence} besoinId={selectedBesoinId} />
    </>
  );
};

export default RapportAutoEvaluation;