import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChevronDown, ChevronUp, MessageSquare, Users, TrendingUp, Star, Filter, Download, Calendar, MessageCircle, BarChart3 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../_redux/store';
import { CardStat } from '../../components/ui/Card';
import { getFormationForDropDown } from '../../services/elaborations/formationAPI';
import { setErrorPageFormation, setFormations } from '../../_redux/features/elaborations/formationSlice';
import { getThemeFormationForDropDown } from '../../services/elaborations/themeFormationAPI';
import { setErrorPageThemeFormation, setThemeFormations } from '../../_redux/features/elaborations/themeFormationSlice';
import { setEvaluationChauds } from '../../_redux/features/evaluations/evaluationChaudSlice';
import { useFetchData } from '../../hooks/fechDataOptions';
import { getEvaluationChaudForDropDown } from '../../services/evaluations/evaluationChaudAPI';
import BreadcrumbPageDescription from '../../components/BreadcrumbPageDescription';
import CustomDropDown2 from '../../components/DropDown/CustomDropDown2';
import { useFetchRapportEvaluationData } from '../../hooks/useFecthRapportEvaluationAChaud';
import { truncateText } from '../../fonctions/fonction';
import Skeleton from 'react-loading-skeleton';
import { NoData } from '../../components/NoData';

const EvaluationResults = () => {
  const QuestionDetail: React.FC<{ question: any; lang: string }> = ({ question, lang }) => (
    <div className="bg-[#F9FAFB] p-4 rounded-lg mb-4">
      <h4 className="font-medium text-[#111827] mb-3">
        {lang === 'fr' ? question.libelleFr : question.libelleEn}
      </h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en barres */}
        <div>
          <h5 className="text-sm font-medium text-[#374151] mb-2">{t('label.repartition_reponse')}</h5>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={question.repartition} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="echelle"
                textAnchor="end" 
                height={80} 
                fontSize={12} 
                angle={-45}
                tickFormatter={(value) => truncateText(value, 10)}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="valeur" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique circulaire */}
        {/* <div>
          <h5 className="text-sm font-medium text-[#374151] mb-2">{t('label.distribution')}</h5>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={question.repartition}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#3B82F6"
                dataKey="valeur"
                label={({ valeur }: { valeur: number }) => `${valeur}`}
              >
                {question.repartition.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.couleur} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div> */}
      </div>

      {/* Sous-questions */}
      {question.sousQuestions && question.sousQuestions.length > 0 && (
        <div className="mt-8">
          <h5 className="text-lg font-semibold text-[#111827] mb-4">{t('label.detail_aspect')}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {question.sousQuestions.map((sq: any, index: number) => (
              <div key={index} className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-[#6B7280] mb-2">{sq.libelle}</p>
                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 text-[#FACC15] mr-1" fill="#FACC15" />
                  <span className="font-bold text-lg text-[#111827]">
                    {sq.moyenne}
                  </span>
                  <span className="text-[#6B7280] text-sm ml-1">/{sq.max || 5}</span>
                </div>
                
                {/* Graphique de répartition de la sous-question */}
                {sq.repartition && sq.repartition.length > 0 && (
                  <div>
                    <h6 className="text-xs font-semibold text-[#6B7280] mb-2">{t('label.repartition_reponse')}</h6>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={sq.repartition} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="echelle"
                          textAnchor="end" 
                          height={80} 
                          fontSize={12} 
                          angle={-45}
                          tickFormatter={(value) => truncateText(value, 10)}
                        />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#FFFFFF', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}
                        />
                        <Bar dataKey="valeur" fill="#3B82F6" radius={[0, 3, 3, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const [selectedRubrique, setSelectedRubrique] = useState<number | null>(null);
  const [showComments, setShowComments] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchData = useFetchData();
  const { t } = useTranslation();
  const lang = useSelector((state: RootState) => state.setting.language);
  
  const { data: { themeFormations } } = useSelector((state: RootState) => state.themeFormationSlice);
  const { data: { programmeFormations } } = useSelector((state: RootState) => state.programmeFormationSlice);
  const { data: { formations } } = useSelector((state: RootState) => state.formationSlice);
  const { data: { evaluationChauds } } = useSelector((state: RootState) => state.evaluationChaudSlice);

  const [currentProgrammeFormation, setCurrentProgrammeFormation] = useState<any>(undefined);
  const [currentFormation, setCurrentFormation] = useState<any>(undefined);
  const [currentTheme, setCurrentTheme] = useState<any>(undefined);
  const [currentEvaluation, setCurrentEvaluation] = useState<any>(undefined);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [limit, setLimit] = useState<number | undefined>(10);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const toggleShowAll = () => {
    if (showAll) {
      setExpandedQuestions(new Set());
    } else {
      setExpandedQuestions(new Set(data && data.commentaires && data.commentaires.map((c: any) => c.questionId)));
    }
    setShowAll(!showAll);
  };

  const getTotalCommentaires = () => {
    let total = 0;
    if (data && data.commentaires) {
      total = data.commentaires.reduce((total: any, q: { commentaires: string | any[]; }) => total + q.commentaires.length, 0);
    }
    return total;
  };

  const { 
    data,
    error,
    isLoading, 
    isLoadingCommentaires
  } = useFetchRapportEvaluationData({ evaluationId: currentEvaluation?._id, lang, limit });

  useEffect(() => {
    if (!currentProgrammeFormation && programmeFormations.length > 0) {
      setCurrentProgrammeFormation(programmeFormations[0]);
    }
  }, [programmeFormations, currentProgrammeFormation]);

  // Charge les formations pour un programmeFormation spécifique
  useEffect(() => {
    if (!currentProgrammeFormation || !currentProgrammeFormation._id) return;

    fetchData({
      apiFunction: getFormationForDropDown,
      params: { lang, programmeId: currentProgrammeFormation._id },
      onSuccess: (data) => {
        dispatch(setFormations(data));
        if (data.formations?.length > 0) {
          setCurrentFormation(data.formations[0]);
        } else {
          setCurrentFormation(undefined);
        }
      },
      onError: () => {
        dispatch(setErrorPageFormation(t('message.erreur')));
      },
    });
  }, [fetchData, currentProgrammeFormation, lang, dispatch]);

  // Charge les themes en fonction des filtres
  useEffect(() => {
    if (!currentFormation || formations.length === 0) return;

    fetchData({
      apiFunction: getThemeFormationForDropDown,
      params: {
        formation: currentFormation?._id || "",
        lang,
      },
      onSuccess: (data) => {
        if (data.themeFormations?.length > 0) {
          setCurrentTheme(data.themeFormations[0]);
        } else {
          setCurrentTheme(undefined);
        }
        dispatch(setThemeFormations(data || {
          themeFormations: [],
          currentPage: 0,
          totalItems: 0,
          totalPages: 0,
          pageSize: 0,
        }));
      },
      onError: () => {
        dispatch(setErrorPageThemeFormation(t('message.erreur')));
      }
    });
  }, [currentFormation, lang, dispatch]);

  // Charge les evaluations en fonction des filtres
  useEffect(() => {
    if (!currentTheme || themeFormations.length === 0) {
      setCurrentEvaluation(undefined);
      return;
    }

    fetchData({
      apiFunction: getEvaluationChaudForDropDown,
      params: {
        themeId: currentTheme?._id || "",
        lang,
      },
      onSuccess: (data) => {
        if (data.evaluationChauds?.length > 0) {
          setCurrentEvaluation(data.evaluationChauds[0]);
        } else {
          setCurrentEvaluation(undefined);
        }
        dispatch(setEvaluationChauds(data || {
          evaluationChauds: [],
          currentPage: 0,
          totalItems: 0,
          totalPages: 0,
          pageSize: 0,
        }));
      },
      onError: () => {
        dispatch(setErrorPageThemeFormation(t('message.erreur')));
      }
    });
  }, [currentTheme, lang, dispatch]);

  // Handlers pour les dropdowns
  const handleProgrammeFormationSelect = (selected: any) => {
    if (selected) setCurrentProgrammeFormation(selected);
  };

  const handleFormationSelect = (selected: any) => {
    if (selected) setCurrentFormation(selected);
  };

  const handleThemeFormationSelect = (selected: any) => {
    if (selected) setCurrentTheme(selected);
  };

  const handleEvaluationSelect = (selected: any) => {
    if (selected) setCurrentEvaluation(selected);
  };

  return (
    <>
      {/* Header */}
      <BreadcrumbPageDescription
        pageDescription={""}
        titleColor="text-[#1E3A8A]"
        pageName={t('sub_menu.rapport_evaluation_a_chaud')}
      />
      <div className="min-h-screen bg-[#F9FAFB] mt-3">
        
        <div className="block md:hidden mb-4 mt-3">
          <button
            onClick={toggleFilters}
            className="w-full flex items-center justify-between p-4 bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#2563EB]" />
              <span className="font-medium text-[#1E40AF]">
                {t('filtre.filtrer')}
              </span>
            </div>
            {isFiltersVisible ? (
              <ChevronUp className="w-5 h-5 text-[#2563EB]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#2563EB]" />
            )}
          </button>
        </div>

        {/* Conteneur des filtres */}
        <div className={`
          transition-all duration-300 ease-in-out md:overflow-visible
          md:block md:opacity-100 md:max-h-none relative z-50 lg:px-8 mt-3
          ${isFiltersVisible 
            ? 'block opacity-100 max-h-96 overflow-visible' 
            : 'hidden md:block opacity-0 md:opacity-100 max-h-0 md:max-h-none overflow-hidden'
          }
        `}>
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4 mb-3 mt-3">
            {/* Programme Formation */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                {t('label.programme_formation')}
              </label>
              <CustomDropDown2
                title=""
                selectedItem={currentProgrammeFormation}
                items={programmeFormations}
                defaultValue={currentProgrammeFormation}
                displayProperty={(item: any) => `${item.annee}`}
                onSelect={handleProgrammeFormationSelect}
              />
            </div>

            {/* Formation */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                {t('label.formation')}
              </label>
              <CustomDropDown2
                title=""
                selectedItem={currentFormation}
                items={formations}
                defaultValue={currentFormation}
                displayProperty={(item: any) => `${lang === 'fr' ? item.titreFr : item.titreEn}`}
                onSelect={handleFormationSelect}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                {t('label.theme')}
              </label>
              <CustomDropDown2
                title=""
                selectedItem={currentTheme}
                items={themeFormations}
                defaultValue={currentTheme}
                displayProperty={(item: any) => `${lang === 'fr' ? item.titreFr : item.titreEn}`}
                onSelect={handleThemeFormationSelect}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                {t('label.evaluation')}
              </label>
              <CustomDropDown2
                title=""
                selectedItem={currentEvaluation}
                items={evaluationChauds}
                defaultValue={currentEvaluation}
                displayProperty={(item: any) => `${lang === 'fr' ? item.titreFr : item.titreEn}`}
                onSelect={handleEvaluationSelect}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <CardStat
              icon={<Users className="text-[#2563EB]" />}
              title={t('label.participants')}
              value={data.statsGenerals?.statistiques?.nombreParticipants || 0}
              color="text-[#2563EB]"
              footer={`${data.statsGenerals?.statistiques?.tauxReponse || 0}% ${t('label.de_taux_reponse')}`}
              isLoading={isLoading}
            />
            <CardStat
              icon={<Star className="text-[#059669]" />}
              title={t('label.moyenne_globale')}
              value={data.statsGenerals?.statistiques?.nombreParticipants ? `${data.statsGenerals?.statistiques?.moyenneGlobale}/${data.statsGenerals?.statistiques?.maximum}`:0}
              color="text-[#059669]"
              isLoading={isLoading}
            />
            <CardStat
              icon={<TrendingUp className="text-[#059669]" />}
              title={t('label.reponses')}
              value={`${data.statsGenerals?.statistiques?.nombreReponsesQuestions || 0}`}
              color="text-[#059669]"
              isLoading={isLoading}
            />
            <CardStat
              icon={<MessageSquare className="text-[#7C3AED]" />}
              title={t('label.commentaires')}
              value={data.statsGenerals?.statistiques?.nombreCommentaires || 0}
              color="text-[#7C3AED]"
              isLoading={isLoading}
            />
          </div>

          {/* Résultats par rubrique */}
          {isLoading ? (
            <Skeleton height={300} />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <BarChart3 className="h-6 w-6 text-[#3B82F6] mr-2" />
                <h2 className="text-2xl font-bold text-[#1F2937]">{t('label.rubriques')}</h2>
              </div>
              {data && data.rubriques ? (
                data.rubriques.map((rubrique: any) => (
                  <div key={rubrique.id} className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#E5E7EB]">
                    <div 
                      className="p-6 cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                      onClick={() => setSelectedRubrique(selectedRubrique === rubrique.id ? null : rubrique.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-semibold text-[#111827]">
                            {lang === 'fr' ? rubrique.titreFr : rubrique.titreEn}
                          </h3>
                          <div className="flex items-center bg-[#DCFCE7] px-3 py-1 rounded-full">
                            <Star className="h-4 w-4 text-[#16A34A] mr-1" fill="#16A34A" />
                            <span className="font-semibold text-[#15803D]">{rubrique.moyenne}</span>
                          </div>
                        </div>
                        {selectedRubrique === rubrique.id ? 
                          <ChevronUp className="h-5 w-5 text-[#6B7280]" /> : 
                          <ChevronDown className="h-5 w-5 text-[#6B7280]" />
                        }
                      </div>
                    </div>

                    {selectedRubrique === rubrique.id && (
                      <div className="px-6 pb-6 border-t border-[#E5E7EB]">
                        <div className="pt-6">
                          {rubrique.questions.map((question: any) => (
                            <QuestionDetail key={question.id} question={question} lang={lang} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <NoData />
              )}
            </div>
          )}

          {/* Commentaires */}
          <div className="mb-3 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div className="flex items-center">
                <MessageCircle className="h-6 w-6 text-[#3B82F6] mr-2" />
                <h2 className="text-2xl font-bold text-[#1F2937]">{t('label.commentaires')}</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-sm text-[#6B7280]">
                  {getTotalCommentaires()} {t('label.commentaire')}{getTotalCommentaires() > 1 ? 's' : ''} 
                  {limit && ` (${t('label.limite_a')} ${limit})`}
                </span>
                
                {/* Composant pour modifier la limite */}
                <div className="flex items-center gap-2">
                  <label htmlFor="limit-select" className="text-sm text-[#6B7280]">
                    {t('label.limite')}:
                  </label>
                  <select
                    id="limit-select"
                    value={limit || ''}
                    onChange={(e) => setLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="px-2 py-1 text-sm border border-[#D1D5DB] rounded-md bg-[#FFFFFF] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  >
                    <option value="">{t('label.tous')}</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
                
                <button
                  onClick={toggleShowAll}
                  className="px-3 py-1 text-sm bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] rounded-md transition-colors"
                >
                  {showAll ? t('label.reduire_tout') : t('label.developper_tout')}
                </button>
              </div>
            </div>
          </div>

          {/* Questions et commentaires */}
          {isLoading || isLoadingCommentaires ? (
            <Skeleton height={300} />
          ) : (
            <>
              <div className="space-y-4">
                {data && data.commentaires && data.commentaires.map((item: any, index: number) => {
                  const isExpanded = expandedQuestions.has(item.questionId);
                  
                  return (
                    <div
                      key={item.questionId}
                      className="bg-[#FFFFFF] rounded-lg border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Question header */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                        onClick={() => toggleQuestion(item.questionId)}
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-[#1F2937] pr-4">
                            {item.question}
                          </h3>
                          <span className="text-sm text-[#6B7280] mt-1 block">
                            {item.commentaires.length} {t('label.commentaire')}{item.commentaires.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-[#EFF6FF] text-[#1D4ED8] px-2 py-1 rounded-full text-xs font-medium mr-3">
                            #{index + 1}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-[#6B7280]" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-[#6B7280]" />
                          )}
                        </div>
                      </div>

                      {/* Commentaires */}
                      {isExpanded && (
                        <div className="border-t border-[#E5E7EB] bg-[#FAFBFC]">
                          <div className="p-4 space-y-3">
                            {item.commentaires.map((commentaire: any, commentIndex: any) => (
                              <div
                                key={commentIndex}
                                className="bg-[#FFFFFF] p-3 rounded-md border-l-4 border-[#3B82F6] shadow-sm"
                              >
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 w-6 h-6 bg-[#EFF6FF] rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-xs font-medium text-[#1D4ED8]">
                                      {commentIndex + 1}
                                    </span>
                                  </div>
                                  <p className="text-[#374151] text-sm leading-relaxed flex-1">
                                    {commentaire}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer avec statistiques */}
              <div className="mt-6 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-[#64748B] gap-2">
                  <span>
                    {t('label.total')}: {data.commentaires && data.commentaires.length} {t('label.question')}{data.commentaires && data.commentaires.length > 1 ? 's' : ''} {t('label.avec_commentaires')}
                  </span>
                  <span>
                    {getTotalCommentaires()} {t('label.commentaire')}{getTotalCommentaires() > 1 ? 's' : ''} {t('label.au_total')}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EvaluationResults;