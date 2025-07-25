import React, { useState, useEffect } from 'react';
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

const RapportAutoEvaluation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBesoin, setSelectedBesoin] = useState('');
  const lang = useSelector((state: RootState) => state.setting.language);
  const { data: { familleMetiers } } = useSelector((state: RootState) => state.familleMetierSlice); 
  const { data: { posteDeTravails } } = useSelector((state: RootState) => state.posteDeTavailSlice);  
  const [currentFamilleMetier, setCurrentFamilleMetier] = useState<FamilleMetier | undefined>();
  const [currentPoste, setCurrentPoste] = useState<PosteDeTravail | undefined>();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [dataAuto, setDataAuto] = useState<GroupedBesoin[]>([]);
  const [dataCompetence, setDataCompetence] = useState<GroupedCompetence[]>([]);
  const {t}=useTranslation();
  const dispatch = useDispatch();
  const fetchData = useFetchData();
  const statuts = Object.values(STATUT_BESOIN)
  
  useEffect(()=>{
    if(familleMetiers && familleMetiers.length>0)
      setCurrentFamilleMetier(familleMetiers[0]);
  },[familleMetiers])

  useEffect(()=>{
    if (!currentFamilleMetier || !currentFamilleMetier._id) return;
    
        fetchData({
            apiFunction: getPosteDeTravailForDropDown,
            params: { lang,familleMetierId:currentFamilleMetier._id },
            onSuccess: (data) => {
                dispatch(setPosteDeTravails(data));
                // Définir le premier formation comme formation courant
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
  },[currentFamilleMetier, lang])

 

  useEffect(() => {
    const fetch = async () => {
      const result = await getGroupedAutoEvaluations({ page:1, lang });
      setDataAuto(result)
    };
    fetch();
    
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const result = await getGroupedBesoinsAjoutes({ page:1, lang });
      console.log(result)
      setDataCompetence(result)
    };
    fetch();
    
  }, []);


  const { 
      data,
      error,
      loading, 
  } = useStatsAnalyses({lang, posteId:currentPoste?._id});

  const toggleDropdownVisibility = () => {
          setIsDropdownVisible(!isDropdownVisible);
      };
      const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handlePosteSelect = (selected: PosteDeTravail | undefined) => {
      if (selected) {
           setCurrentPoste(selected);
          
      }
  };

  const handleFamilleMetierSelect = (selected: FamilleMetier| undefined) => {

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
    if (!data) {
      console.warn('Données non disponibles');
      return [];
    }
    
    if (!data.repartitionBesoinNiveauPoste) {
      console.warn('repartitionBesoinPoste non disponible dans les données');
      return [];
    }
    
    if (!Array.isArray(data.repartitionBesoinNiveauPoste)) {
      console.error('repartitionBesoinPoste n\'est pas un tableau:', typeof data.repartitionBesoinNiveauPoste);
      return [];
    }
    return data.repartitionBesoinNiveauPoste.map(item => ({
      ...item,
      titre: lang === 'en' ? item.titreEn : item.titreFr
    }));
  };
  const formatDataForChartBesoin = () => {
    // Vérifications multiples
    if (!data) {
      console.warn('Données non disponibles');
      return [];
    }
    
    if (!data.repartitionBesoinPoste) {
      console.warn('repartitionBesoinPoste non disponible dans les données');
      return [];
    }
    
    if (!Array.isArray(data.repartitionBesoinPoste)) {
      console.error('repartitionBesoinPoste n\'est pas un tableau:', typeof data.repartitionBesoinPoste);
      return [];
    }
    
    return data.repartitionBesoinPoste.map((item: { nomEn: any; nomFr: any; }) => ({
      ...item,
      nom: lang === 'en' ? item.nomEn : item.nomFr
    }));
  };
  const formatDataForChartCompetence = () => {
    // Vérifications multiples
    if (!data) {
      console.warn('Données non disponibles');
      return [];
    }
    
    if (!data.repartitionCompetencePoste) {
      console.warn('repartitionCompetencePoste non disponible dans les données');
      return [];
    }
    
    if (!Array.isArray(data.repartitionCompetencePoste)) {
      console.error('repartitionCompetencePoste n\'est pas un tableau:', typeof data.repartitionCompetencePoste);
      return [];
    }
    
    return data.repartitionCompetencePoste.map((item: { nomEn: any; nomFr: any; }) => ({
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
          color: 'bg-[#dcfce7] text-[#166534] border-[#86efac] hover:bg-[#bbf7d0]',
          icon: CheckCircle,
          label: lang==='fr'?statuts.find(s=>s.key===statut)?.nomFr||'':statuts.find(s=>s.key===statut)?.nomEn||''
        };
      case 'REJETE':
        return {
          color: 'bg-[#fef2f2] text-[#991b1b] border-[#fca5a5] hover:bg-[#fee2e2]',
          icon: XCircle,
          label: lang==='fr'?statuts.find(s=>s.key===statut)?.nomFr||'':statuts.find(s=>s.key===statut)?.nomEn||''
        };
      default:
        return {
          color: 'bg-[#fefce8] text-[#a16207] border-[#fde047] hover:bg-[#fef3c7]',
          icon: Clock,
          label: lang==='fr'?statuts.find(s=>s.key===statut)?.nomFr||'':statuts.find(s=>s.key===statut)?.nomEn||''
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
  return (
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
          {/* <TabButton id="trends" label="Tendances" icon={TrendingUp} active={activeTab === 'trends'} onClick={setActiveTab} />
          <TabButton id="analysis" label="Analyses" icon={Activity} active={activeTab === 'analysis'} onClick={setActiveTab} /> */}
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
                  icon={<CheckCircle className="w-8 h-8 text-[#16a34a]" />} // Vert
                  color="bg-[#f0fdf4] dark:bg-[#16653433]" // Fond clair + sombre avec opacité 20%
                  isLoading={loading}
              />

              <CardStat
                  title={t('label.rejetees')}
                  value={`${data?.tauxValidation?.rejetees || 0}`}
                  icon={<XCircle className="w-8 h-8 text-[#dc2626]" />} // Rouge
                  color="bg-[#fef2f2] dark:bg-[#7f1d1d33]" // Fond clair + sombre
                  isLoading={loading}
              />

              <CardStat
                  title={t('label.en_attentes')}
                  value={`${data?.tauxValidation?.enAttente || 0}`}
                  icon={<Clock className="w-8 h-8 text-[#ca8a04]" />} // Jaune
                  color="bg-[#fefce8] dark:bg-[#78350f33]" // Fond clair + sombre
                  isLoading={loading}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stroke p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('label.evolution_mensuelle')}
              </h3>
              {loading?<Skeleton height={300}/>:
                  (data.parMois && data.parMois.data && data.parMois.data.length===0)?<NoData/>:(<ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data?.parMois?.data || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="_id.month" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                      return `${lang==='fr'?monthsFullFr[value - 1] : monthsFullEn[value - 1]}` || value;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => {
                     
                      return `${lang==='fr'?monthsFullFr[value - 1] : monthsFullEn[value - 1]}` || value;
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
              </ResponsiveContainer>)}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-stroke p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('label.besoin_prioritaire')}</h3>
              {loading?<Skeleton height={200}/>:
                (data.faibles && data.faibles.data && data.faibles.data.length===0)?<NoData/>:(<div className="space-y-3">
                {(data?.faibles?.data || []).map((item: any, index: number) => (
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
              </div>)}
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

                {loading?<Skeleton height={300}/>:
                  dataAuto.length===0?<NoData/>:(<div className="space-y-3">
                  {dataAuto.map((group, index) => (
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
                                {group.count} {group.count > 1 ? 'évaluations' : 'évaluation'}
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
                                    {/* {new Date(evalItem.createdAt).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })} */}
                                  </div>
                                </div>

                                <div className="flex items-center">
                                  <span
                                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                                      evalItem.statut === "valide"
                                        ? "bg-[#dcfce7] text-[#166534] border border-[#86efac] shadow-sm"
                                        : evalItem.statut === "rejete"
                                        ? "bg-[#fef2f2] text-[#991b1b] border border-[#fca5a5] shadow-sm"
                                        : "bg-[#fefce8] text-[#a16207] border border-[#fde047] shadow-sm"
                                    }`}
                                  >
                                    <div className={`w-2 h-2 rounded-full mr-2 ${
                                      evalItem.statut === "valide"
                                        ? "bg-[#22c55e]"
                                        : evalItem.statut === "rejete"
                                        ? "bg-[#ef4444]"
                                        : "bg-[#f59e0b]"
                                    }`}></div>
                                    {t(`${lang==='fr'?statuts.find(s=>s.key===evalItem.statut)?.nomFr||'':statuts.find(s=>s.key===evalItem.statut)?.nomEn||''}`)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>)}
              </div>

              <div className="bg-[#ffffff] rounded-2xl shadow-lg border border-[#f1f5f9] p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] rounded-full"></div>
                  <h3 className="text-xl font-bold text-[#1e293b] tracking-tight">
                    {t('label.competence_utilisateur')}
                  </h3>
                </div>

                {loading?<Skeleton height={300}/>:
                  dataCompetence.length===0?<NoData/>:(<div className="space-y-3">
                  {dataCompetence.map((user: GroupedCompetence) => {
                    const userExpanded = expandedCards[`user-${user.utilisateurId}`];
                    
                    return (
                      <div key={user.utilisateurId} className="space-y-3">
                        {/* En-tête utilisateur - toujours visible et cliquable */}
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

                          {/* Liste des besoins - visible uniquement si l'utilisateur est étendu */}
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
                                      {/* En-tête du titre dans le style du modèle */}
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
                                            
                                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 ${statusConfig.color}`}>
                                              <StatusIcon className="w-3 h-3 mr-1" />
                                              {statusConfig.label}
                                            </span>
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

                                        {/* Points à améliorer - visible uniquement si le titre est étendu */}
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

                                        {/* Indicateur s'il n'y a pas de points à améliorer */}
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
                </div>)}
              </div>

              {/* <div className="bg-white rounded-xl shadow-sm border border-stroke p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Moyenne par besoin</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.moyenneParBesoin || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={lang==='fr'?'titreFr':'titreEn'} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="moyenneNiveau" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div> */}
            </div>

            
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg border border-stroke p-4 sm:p-6">
                  {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('label.repartition_besoin_niveau')}
                  </h3>
                </div>

              </div>
        
              {/* Filtres */}
              <div className="mb-6">
                {/* Version Mobile */}
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
               
        
                {/* Version Desktop */}
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
                      
        
              {/* Graphique */}
              {loading?<Skeleton height={300}/>:
                formatDataForChart().length===0?<NoData/>: (<div className="h-80 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formatDataForChart()}
                    margin={{ 
                      top: 20, 
                      right: 20, 
                      left: 10, 
                      bottom: window.innerWidth < 768 ? 60 : 40 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    
                    <XAxis 
                      dataKey={lang==='fr'?'titreFr':'titreEn'} 
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
              </div>)}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-stroke p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('label.repartition_besoin_poste')}
                </h3>
                {loading?<Skeleton height={300}/>:
                  formatDataForChartBesoin().length===0?<NoData/>:(<ResponsiveContainer width="100%" height={400}>
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
                </ResponsiveContainer>)}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-stroke p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('label.repartition_competence_poste')}
                </h3>
                {(loading?<Skeleton height={300}/>:
                  formatDataForChartCompetence().length===0?<NoData/>:<ResponsiveContainer width="100%" height={400}>
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
                </ResponsiveContainer>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RapportAutoEvaluation;
