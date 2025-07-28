import React, { useEffect, useRef, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useFetchData } from '../../hooks/fechDataOptions';
import { getGroupedEchelleReponseByType } from '../../services/evaluations/echelleReponseAPI';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../_redux/store';
import { setEchelleReponseLoading, setErrorPageEchelleReponse } from '../../_redux/features/evaluations/echelleReponseSlice';
import { createEvaluationChaudSlice, setErrorPageEvaluationChaud, setEvaluationChaudLoading, setEvaluationChauds, updateEvaluationChaudSlice } from '../../_redux/features/evaluations/evaluationChaudSlice';
import { createEvaluationAChaud, getFilteredEvaluations, updateEvaluationAChaud } from '../../services/evaluations/evaluationChaudAPI';
import InputSearch from '../../components/Tables/common/SearchTable';
import { FaFilter, FaSort } from 'react-icons/fa';
import Pagination from '../../components/Pagination/Pagination';
import createToast from '../../hooks/toastify';
import FilterList from '../../components/ui/AutoComplete';
import { getFilteredThemeFormations } from '../../services/elaborations/themeFormationAPI';
import { truncateText } from '../../fonctions/fonction';
import { NoData } from '../../components/NoData';
import BreadcrumbPageDescription from '../../components/BreadcrumbPageDescription';
import FormDelete from '../../components/Modals/Evaluation/ModalEvaluationAChaud/FormDelete';
import { setShowModalDelete } from '../../_redux/features/setting';
import Skeleton from 'react-loading-skeleton';

const EvaluationManager = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const lang = useSelector((state: RootState) => state.setting.language);
  const { data: { evaluationChauds } } = useSelector((state: RootState) => state.evaluationChaudSlice);
 
  const [echellesReponses, setEchelleReponses] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('list');
  const [editingEvaluation, setEditingEvaluation] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [isSearch, setIsSearch] = useState(false);
  const [themeFormation, setThemeFormation] = useState<ThemeFormation>();
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationChaud|undefined>(undefined)
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const toggleDropdownVisibility = () => {
      setIsDropdownVisible(!isDropdownVisible);
  };
  const loading =  useSelector((state: RootState) => state.evaluationChaudSlice.pageIsLoading);

// variable pour la pagination
  const itemsPerPage =  useSelector((state: RootState) => state.evaluationChaudSlice.data.pageSize); // nombre d'éléments maximum par page
  const count = useSelector((state: RootState) => state.evaluationChaudSlice.data.totalItems);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  // Render page numbers
  const pageNumbers :number[]= [];
  for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
      pageNumbers.push(i);
  }

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < Math.ceil(count / itemsPerPage);

  const startItem = indexOfFirstItem + 1;
  const endItem = Math.min(count, indexOfLastItem);
      
  // CORRECTION 1: Utiliser directement les données du Redux au lieu d'un état local
  // const [evaluations, setEvaluations] = useState<EvaluationChaud[]>(evaluationChauds);
  const evaluations = evaluationChauds; // Utiliser directement Redux
  
  const fetchData = useFetchData();

  useEffect(() => {
    fetchData({
      apiFunction: getGroupedEchelleReponseByType,
      params: {
        lang,
      },
      onSuccess: (data) => {
        setEchelleReponses(data || []);
      },
      onError: () => {
        dispatch(setErrorPageEchelleReponse(t('message.erreur')));
      },
      onLoading: (isLoading) => {
        dispatch(setEchelleReponseLoading(isLoading));
      },
    });
  }, [lang]);

  // CORRECTION 2: Améliorer la gestion du chargement des évaluations
  useEffect(() => {
    dispatch(setEvaluationChaudLoading(true));      
    
    const filterEvaluationChaudByContent = async () => {
      try {                
        fetchData({
          apiFunction: getFilteredEvaluations,
          params: {
            lang,
            page: currentPage
          },
          onSuccess: (data) => {
            dispatch(setEvaluationChauds(data || {
              evaluationChauds:[],
              currentPage: 0,
              totalItems: 0,
              totalPages: 0,
              pageSize: 0,
            }));
          },
          onError: () => {
            dispatch(setErrorPageEvaluationChaud(t('message.erreur')));
          },
          onLoading: (isLoading) => {
            dispatch(setEvaluationChaudLoading(isLoading));
          },
        });
      } catch(e) {
        dispatch(setErrorPageEvaluationChaud(t('message.erreur')));
      }
    };
    
    filterEvaluationChaudByContent();
  }, [currentPage, lang, dispatch]);
  
  const latestQueryEvaluationChaud = useRef('');
  
  // CORRECTION 3: Améliorer la gestion de la recherche
  useEffect(() => {
    if(!isSearch) return;
    
    dispatch(setEvaluationChaudLoading(true));
    latestQueryEvaluationChaud.current = searchText;
    
    const filterEvaluationChaudByContent = async () => {
      try {
        if (searchText === '') {    
          // Recharger les données depuis l'API au lieu d'utiliser l'ancien état local
          fetchData({
            apiFunction: getFilteredEvaluations,
            params: {
              lang,
              page: 1
            },
            onSuccess: (data) => {
              dispatch(setEvaluationChauds(data || {
                evaluationChauds:[],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
              }));
            },
            onError: () => {
              dispatch(setErrorPageEvaluationChaud(t('message.erreur')));
            },
            onLoading: (isLoading) => {
              if (latestQueryEvaluationChaud.current === searchText) {
                dispatch(setEvaluationChaudLoading(isLoading));
              }
            },
          });
        } else {                      
          fetchData({
            apiFunction: getFilteredEvaluations,
            params: {
              lang,
              page: 1,
              search: searchText
            },
            onSuccess: (data) => {
              dispatch(setEvaluationChauds(data || {
                evaluationChauds:[],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
              }));
            },
            onError: () => {
              dispatch(setErrorPageEvaluationChaud(t('message.erreur')));
            },
            onLoading: (isLoading) => {
              if (latestQueryEvaluationChaud.current === searchText) {
                dispatch(setEvaluationChaudLoading(isLoading));
              }
            },
          });
        }
      } catch(e) {
        dispatch(setErrorPageEvaluationChaud(t('message.erreur')));
      } finally {
        if (latestQueryEvaluationChaud.current === searchText) {
          dispatch(setEvaluationChaudLoading(false));
        }
      }
    };
    
    filterEvaluationChaudByContent();
  }, [searchText, isSearch, lang, dispatch]);

  const [newEvaluation, setNewEvaluation] = useState<Partial<EvaluationChaud>>({
    titreFr: '',
    titreEn: '',
    theme: undefined,
    descriptionFr: '',
    descriptionEn: '',
    rubriques: [],
    actif: true
  });

  const [expandedRubrique, setExpandedRubrique] = useState<number | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // CORRECTION 4: Supprimer cette fonction car nous utilisons Redux maintenant
  // const toggleEvaluationStatus = (id: string) => {
  //   setEvaluations(prev => prev.map(evaluation => 
  //     evaluation._id === id ? { ...evaluation, actif: !evaluation.actif, updatedAt: new Date() } : evaluation
  //   ));
  // };

  // NOUVELLE FONCTION: Toggle avec mise à jour Redux
  const toggleEvaluationStatus = async (id: string) => {
    const evaluation = evaluations.find(e => e._id === id);
    if (!evaluation) return;

    const updatedEvaluation = { 
      ...evaluation, 
      actif: !evaluation.actif, 
      updatedAt: new Date() 
    };

    try {
      const response = await updateEvaluationAChaud(id, updatedEvaluation, lang);
      if (response.success) {
        dispatch(updateEvaluationChaudSlice({
          id: id,
          evaluationChaudData: response.data
        }));
        createToast(response.message, '', 0);
      } else {
        createToast(response.message, '', 2);
      }
    } catch (error) {
      console.error(error);
      createToast(t('message.erreur'), '', 2);
    }
  };

  // Fonction pour éditer une évaluation
  const editerEvaluation = (evaluation: EvaluationChaud) => {
    setEditingEvaluation(evaluation._id || null);
    setThemeFormation(evaluation.theme)
    setNewEvaluation({
      _id: evaluation._id,
      titreFr: evaluation.titreFr,
      titreEn: evaluation.titreEn,
      theme: evaluation.theme,
      descriptionFr: evaluation.descriptionFr,
      descriptionEn: evaluation.descriptionEn,
      rubriques: evaluation.rubriques,
      actif: evaluation.actif
    });
    setActiveTab('create');
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setNewEvaluation({
      titreFr: '',
      titreEn: '',
      theme: undefined,
      descriptionFr: '',
      descriptionEn: '',
      rubriques: [],
      actif: true
    });
    setEditingEvaluation(null);
    setExpandedRubrique(null);
    setExpandedQuestion(null);
    setThemeFormation(undefined); // CORRECTION 5: Réinitialiser aussi themeFormation
  };

  const ajouterRubrique = () => {
    const nouvelleRubrique: Rubrique = {
      titreFr: '',
      titreEn: '',
      ordre: (newEvaluation.rubriques?.length || 0) + 1,
      questions: []
    };
    
    setNewEvaluation(prev => ({
      ...prev,
      rubriques: [...(prev.rubriques || []), nouvelleRubrique]
    }));
  };

  const supprimerRubrique = (rubriqueIndex: number) => {
    const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
    nouvelles_rubriques.splice(rubriqueIndex, 1);
    // Réorganiser les ordres
    nouvelles_rubriques.forEach((rubrique, index) => {
      rubrique.ordre = index + 1;
    });
    
    setNewEvaluation(prev => ({
      ...prev,
      rubriques: nouvelles_rubriques
    }));
  };

  const ajouterQuestion = (rubriqueIndex: number) => {
    const nouvelleQuestion: Question = {
      libelleFr: '',
      libelleEn: '',
      echelles: [],
      sousQuestions: [],
      commentaireGlobal: false,
      ordre: (newEvaluation.rubriques?.[rubriqueIndex]?.questions?.length || 0) + 1
    };

    const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
    nouvelles_rubriques[rubriqueIndex].questions.push(nouvelleQuestion);
    
    setNewEvaluation(prev => ({
      ...prev,
      rubriques: nouvelles_rubriques
    }));
  };

  const supprimerQuestion = (rubriqueIndex: number, questionIndex: number) => {
    const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
    nouvelles_rubriques[rubriqueIndex].questions.splice(questionIndex, 1);
    // Réorganiser les ordres
    nouvelles_rubriques[rubriqueIndex].questions.forEach((question, index) => {
      question.ordre = index + 1;
    });
    
    setNewEvaluation(prev => ({
      ...prev,
      rubriques: nouvelles_rubriques
    }));
  };

  const ajouterSousQuestion = (rubriqueIndex: number, questionIndex: number) => {
    const nouvelleSousQuestion: SousQuestion = {
      libelleFr: '',
      libelleEn: '',
      commentaireObligatoire: false,
      ordre: (newEvaluation.rubriques?.[rubriqueIndex]?.questions?.[questionIndex]?.sousQuestions?.length || 0) + 1
    };

    const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
    nouvelles_rubriques[rubriqueIndex].questions[questionIndex].sousQuestions.push(nouvelleSousQuestion);
    
    setNewEvaluation(prev => ({
      ...prev,
      rubriques: nouvelles_rubriques
    }));
  };

  const supprimerSousQuestion = (rubriqueIndex: number, questionIndex: number, sousQuestionIndex: number) => {
    const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
    nouvelles_rubriques[rubriqueIndex].questions[questionIndex].sousQuestions.splice(sousQuestionIndex, 1);
    // Réorganiser les ordres
    nouvelles_rubriques[rubriqueIndex].questions[questionIndex].sousQuestions.forEach((sousQuestion, index) => {
      sousQuestion.ordre = index + 1;
    });
    
    setNewEvaluation(prev => ({
      ...prev,
      rubriques: nouvelles_rubriques
    }));
  };

  const changerEchelleQuestion = (rubriqueIndex: number, questionIndex: number, typeEchelleIndex: number) => {
    const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
    
    // Transformation des données de l'API vers le modèle EchelleReponse
    const typeEchelleSelectionne = echellesReponses[typeEchelleIndex];
    const nouvellesEchelles = typeEchelleSelectionne.echelles.map((echelle: { idEchelle: any; nomEchelle: any; }) => ({
      _id: echelle.idEchelle,
      nomFr: lang === 'fr' ? echelle.nomEchelle : '',
      nomEn: lang === 'en' ? echelle.nomEchelle : '',
      typeEchelle: {
        _id: typeEchelleSelectionne.idType,
        nomFr: lang === 'fr' ? typeEchelleSelectionne.nomType : '',
        nomEn: lang === 'en' ? typeEchelleSelectionne.nomType : ''
      }
    }));
    
    nouvelles_rubriques[rubriqueIndex].questions[questionIndex].echelles = nouvellesEchelles;
    
    setNewEvaluation(prev => ({
      ...prev,
      rubriques: nouvelles_rubriques
    }));
  };

  // CORRECTION 6: Améliorer la sauvegarde avec gestion d'erreurs et recharge des données
  const sauvegarderEvaluation = async () => {
    try {
      if (editingEvaluation) {
        // Mode édition
        const evaluation = newEvaluation as EvaluationChaud;
        const response = await updateEvaluationAChaud(editingEvaluation, evaluation, lang);
        
        if (response.success) {
          createToast(response.message, '', 0);
          dispatch(updateEvaluationChaudSlice({
            id: response.data._id,
            evaluationChaudData: {
              _id: response.data._id,
              titreFr: response.data.titreFr,
              titreEn: response.data.titreEn,
              theme: response.data.theme,
              descriptionFr: response.data.descriptionFr,
              descriptionEn: response.data.descriptionEn,
              rubriques: response.data.rubriques,
              actif: response.data.actif,
              createdAt: response.data.createdAt,
              updatedAt: response.data.updatedAt
            }
          }));
        } else {
          createToast(response.message, '', 2);
          return; // Ne pas continuer si erreur
        }
      } else {
        // Mode création
        const evaluationComplete: EvaluationChaud = {
          ...newEvaluation as EvaluationChaud,
          _id: Date.now().toString(), // Temporaire, sera remplacé par l'ID de l'API
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const response = await createEvaluationAChaud(evaluationComplete, lang);
        
        if (response.success) {
          createToast(response.message, '', 0);
          dispatch(createEvaluationChaudSlice({
            evaluationChaud: {
              _id: response.data._id,
              titreFr: response.data.titreFr,
              titreEn: response.data.titreEn,
              theme: response.data.theme,
              descriptionFr: response.data.descriptionFr,
              descriptionEn: response.data.descriptionEn,
              rubriques: response.data.rubriques,
              actif: response.data.actif,
              createdAt: response.data.createdAt,
              updatedAt: response.data.updatedAt
            }
          }));
        } else {
          createToast(response.message, '', 2);
          return; // Ne pas continuer si erreur
        }
      }
      
      resetForm();
      setActiveTab('list');
    } catch (error: any) {
      console.error(error);
      createToast(error.response?.data?.message || t('message.erreur'), '', 2);
    }
  };

  // CORRECTION 7: Supprimer cette fonction car nous ne manipulons plus l'état local
  // const supprimerEvaluation = (id: string) => {
  //   setEvaluations(prev => prev.filter(evaluation => evaluation._id !== id));
  // };

  const annulerEdition = () => {
    resetForm();
    setActiveTab('list');
  };

  const handleThemeFormationSelect = (selected: ThemeFormation | string) => {
    if (typeof selected === "string") return
    if(selected){
        setThemeFormation(selected)
        setNewEvaluation(prev => ({ ...prev, theme: selected }))
    }
  };

  const onSearchThemeFormation = async (value: string) => {
      const data = await getFilteredThemeFormations({page:1, lang:lang, search:value});
      return data?.themeFormations || [];
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
    <>
      <BreadcrumbPageDescription 
          pageDescription={t('page_description.evaluation_a_chaud')} 
          titleColor="text-[#1e3a8a]" 
          pageName={t('sub_menu.cree_evaluation')} 
      />
      <div className="min-h-screen bg-[#f8fafc] p-4 mt-3">
        <div className="max-w-7xl mx-auto">
          
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] mb-6">
            <div className="flex border-b border-[#e2e8f0]">
              <button
                onClick={() => {
                  if (activeTab !== 'list') {
                    resetForm();
                  }
                  setActiveTab('list');
                }}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'list'
                    ? 'text-[#2563eb] border-b-2 border-[#2563eb] bg-[#eff6ff]'
                    : 'text-[#64748b] hover:text-[#334155]'
                }`}
              >
                {t('label.liste_evaluations')}
              </button>
              <button
                onClick={() => {
                  if (activeTab !== 'create') {
                    resetForm();
                  }
                  setActiveTab('create');
                }}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'create'
                    ? 'text-[#2563eb] border-b-2 border-[#2563eb] bg-[#eff6ff]'
                    : 'text-[#64748b] hover:text-[#334155]'
                }`}
              >
                {editingEvaluation ? t('label.modifier_evaluation') : t('label.cree_evaluation')}
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'list' ? (
            /* Liste des évaluations */
            <div className="space-y-4">
              {/* version mobile */}
              <div className="block lg:hidden">
                  <button className="px-2.5 py-1 border border-gray text-[12px] mb-2 flex justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}>
                      <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort />
                  </button>
                  {isDropdownVisible && (
                      <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 gap-y-3">

                          {/* InputSearch pour mobile */}
                          <div className="w-full">
                              <InputSearch 
                                  hintText={t('recherche.rechercher')+t('recherche.evaluation_a_chaud')} 
                                  value={searchText} 
                                  onSubmit={(text) => {setIsSearch(true); setSearchText(text)}} 
                              />
                          </div>
                      </div>
                  )}
              </div>

              {/* version desktop */}
              <div className="hidden lg:block">
                  
                  <div className="w-full mb-4 mt-4">
                      <InputSearch 
                          hintText={t('recherche.rechercher')+t('recherche.evaluation_a_chaud')} 
                          value={searchText} 
                          onSubmit={(text) => {setIsSearch(true); setSearchText(text)}} 
                      />
                  </div>
              </div>
              {evaluations.length === 0 ? (
                <NoData/>
              ) : (
                
                loading?<Skeleton height={300}/>:(evaluations.map((evaluation, index) => (
                  <div key={evaluation._id || index} className="bg-white rounded-lg border border-[#e2e8f0] p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#1e293b]">{evaluation.titreFr}</h3>
                          
                          {/* Toggle pour actif/inactif */}
                          <div className="flex items-center gap-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={evaluation.actif}
                                onChange={() => evaluation._id && toggleEvaluationStatus(evaluation._id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              evaluation.actif 
                                ? 'bg-[#dcfce7] text-[#166534]' 
                                : 'bg-[#fee2e2] text-[#991b1b]'
                            }`}>
                              {evaluation.actif ? t('label.actif') : t('label.inactif')}
                            </span>
                          </div>
                        </div>
                      
                        {lang==='fr'? evaluation.descriptionFr && (
                          <p className="text-sm text-[#64748b] mb-3">{evaluation.descriptionFr}</p>
                        ):evaluation.descriptionEn && (
                          <p className="text-sm text-[#64748b] mb-3">{evaluation.descriptionEn}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-[#64748b]">
                          <span>{t('label.rubriques')}: {evaluation.rubriques?.length || 0}</span>
                          <span>{t('label.creee_le')}: {formatDate(evaluation.createdAt?.toString() || '')}</span>
                          <span>{t('label.modifiee_le')}: {formatDate(evaluation.updatedAt?.toString() || '')}</span>
                          <span>{t('label.theme')} : {lang==='fr'?truncateText(evaluation.theme?.titreFr || '', 80):truncateText(evaluation.theme?.titreEn || '', 80)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-2 text-[#64748b] hover:text-[#2563eb] hover:bg-[#eff6ff] rounded-lg transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => editerEvaluation(evaluation)}
                          className="p-2 text-[#64748b] hover:text-[#059669] hover:bg-[#ecfdf5] rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {setSelectedEvaluation(evaluation); dispatch(setShowModalDelete())}}
                          className="p-2 text-[#64748b] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )))
              )}
              {searchText==='' && evaluations && evaluations.length>0 && <Pagination
                  count={count}
                  itemsPerPage={itemsPerPage}
                  startItem={startItem}
                  endItem={endItem}
                  hasPrevious={hasPrevious}
                  hasNext={hasNext}
                  currentPage={currentPage}
                  pageNumbers={pageNumbers}
                  handlePageClick={setCurrentPage}
              />}
            </div>
          ) : (
            /* Formulaire de création/édition */
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <div className="space-y-6">
                {/* Informations générales */}
                <div>
                  <h2 className="text-xl font-semibold text-[#1e293b] mb-4">
                    {editingEvaluation ? 'Modifier l\'évaluation' : 'Informations générales'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-2">{t('label.titre_fr')}</label>
                      <input
                        type="text"
                        value={newEvaluation.titreFr || ''}
                        onChange={(e) => setNewEvaluation(prev => ({ ...prev, titreFr: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                        placeholder={t('label.titre_evaluation_fr')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-2"> {t('label.titre_en')} </label>
                      <input
                        type="text"
                        value={newEvaluation.titreEn || ''}
                        onChange={(e) => setNewEvaluation(prev => ({ ...prev, titreEn: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                        placeholder={t('label.titre_evaluation_en')}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#374151] mb-2">{t('label.theme')}</label>
                    <FilterList
                        items={[]}
                        placeholder={t('recherche.rechercher')+t('recherche.theme_formation')}
                        displayProperty={(item) => `${lang==='fr'?item.titreFr:item.titreEn}`}
                        onSelect={handleThemeFormationSelect}
                        enableBackendSearch={true}
                        onSearch={onSearchThemeFormation}
                        searchDelay={300}
                        minSearchLength={2}
                        defaultValue={themeFormation}
                        noResultsMessage={t('label.aucun_theme_formation')}
                        loadingMessage={t('label.recherche_theme_formation')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-2"> {t('label.descrip_fr')} </label>
                      <textarea
                        value={newEvaluation.descriptionFr || ''}
                        onChange={(e) => setNewEvaluation(prev => ({ ...prev, descriptionFr: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                        placeholder={t('label.description_evaluation_fr')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-2">{t('label.descrip_en')}</label>
                      <textarea
                        value={newEvaluation.descriptionEn || ''}
                        onChange={(e) => setNewEvaluation(prev => ({ ...prev, descriptionEn: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                        placeholder={t('label.description_evaluation_en')}
                      />
                    </div>
                  </div>

                  {/* Toggle pour actif/inactif dans le formulaire */}
                  <div className="mb-4">
                    <label className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#374151]">{t('label.etat_evaluation')}:</span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newEvaluation.actif || false}
                          onChange={(e) => setNewEvaluation(prev => ({ ...prev, actif: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        newEvaluation.actif 
                          ? 'bg-[#dcfce7] text-[#166534]' 
                          : 'bg-[#fee2e2] text-[#991b1b]'
                      }`}>
                        {newEvaluation.actif ? t('label.actif') : t('label.inactif')}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Rubriques */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#1e293b]">{t('label.rubriques')}</h2>
                    <button
                      onClick={ajouterRubrique}
                      className="flex items-center gap-2 bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {t('button.ajouter_rubrique')}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newEvaluation.rubriques?.map((rubrique, rubriqueIndex) => (
                      <div key={rubriqueIndex} className="border border-[#e2e8f0] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="bg-[#2563eb] text-white px-2 py-1 rounded-full text-xs font-medium">
                              {rubrique.ordre}
                            </span>
                            <h3 className="font-medium text-[#1e293b]">{t('label.rubrique')} {rubriqueIndex + 1}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedRubrique(expandedRubrique === rubriqueIndex ? null : rubriqueIndex)}
                              className="p-1 text-[#64748b] hover:text-[#334155]"
                            >
                              {expandedRubrique === rubriqueIndex ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => supprimerRubrique(rubriqueIndex)}
                              className="p-1 text-[#64748b] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {expandedRubrique === rubriqueIndex && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#374151] mb-2">{t('label.titre_fr')}</label>
                                <input
                                  type="text"
                                  value={rubrique.titreFr}
                                  onChange={(e) => {
                                    const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
                                    nouvelles_rubriques[rubriqueIndex].titreFr = e.target.value;
                                    setNewEvaluation(prev => ({ ...prev, rubriques: nouvelles_rubriques }));
                                  }}
                                  className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                                  placeholder={t('label.titre_rubrique_fr')}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#374151] mb-2">{t('label.titre_en')}</label>
                                <input
                                  type="text"
                                  value={rubrique.titreEn}
                                  onChange={(e) => {
                                    const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
                                    nouvelles_rubriques[rubriqueIndex].titreEn = e.target.value;
                                    setNewEvaluation(prev => ({ ...prev, rubriques: nouvelles_rubriques }));
                                  }}
                                  className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                                  placeholder={t('label.titre_rubrique_en')}
                                />
                              </div>
                            </div>

                            {/* Questions */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-[#374151]">Questions</h4>
                                <button
                                  onClick={() => ajouterQuestion(rubriqueIndex)}
                                  className="flex items-center gap-2 bg-[#059669] text-white px-3 py-1 rounded-md hover:bg-[#047857] transition-colors text-sm"
                                >
                                  <Plus className="w-3 h-3" />
                                  {t('button.ajouter_question')}
                                </button>
                              </div>

                              <div className="space-y-3">
                                {rubrique.questions.map((question, questionIndex) => (
                                  <div key={questionIndex} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-2">
                                        <span className="bg-[#059669] text-white px-2 py-1 rounded-full text-xs font-medium">
                                          {question.ordre}
                                        </span>
                                        <span className="text-sm font-medium text-[#374151]">{t('label.question')} {questionIndex + 1}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => setExpandedQuestion(expandedQuestion === questionIndex ? null : questionIndex)}
                                          className="p-1 text-[#64748b] hover:text-[#334155]"
                                        >
                                          {expandedQuestion === questionIndex ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                        <button
                                          onClick={() => supprimerQuestion(rubriqueIndex, questionIndex)}
                                          className="p-1 text-[#64748b] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded transition-colors"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>

                                    {expandedQuestion === questionIndex && (
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-xs font-medium text-[#374151] mb-1">{t('label.libelle_fr')}</label>
                                            <input
                                              type="text"
                                              value={question.libelleFr}
                                              onChange={(e) => {
                                                const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
                                                nouvelles_rubriques[rubriqueIndex].questions[questionIndex].libelleFr = e.target.value;
                                                setNewEvaluation(prev => ({ ...prev, rubriques: nouvelles_rubriques }));
                                              }}
                                              className="w-full px-2 py-1 border border-[#d1d5db] rounded text-sm focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                                              placeholder={t('label.question_francais')}
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-[#374151] mb-1">{t('label.libelle_en')}</label>
                                            <input
                                              type="text"
                                              value={question.libelleEn}
                                              onChange={(e) => {
                                                const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
                                                nouvelles_rubriques[rubriqueIndex].questions[questionIndex].libelleEn = e.target.value;
                                                setNewEvaluation(prev => ({ ...prev, rubriques: nouvelles_rubriques }));
                                              }}
                                              className="w-full px-2 py-1 border border-[#d1d5db] rounded text-sm focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                                              placeholder={t('label.question_anglais')}
                                            />
                                          </div>
                                        </div>

                                        {/* Echelle de réponse */}
                                        <div>
                                          <label className="block text-xs font-medium text-[#374151] mb-2">
                                            {t('label.echelle_reponse')}
                                          </label>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {echellesReponses.map((typeEchelle, typeIndex) => (
                                              <div key={typeEchelle.idType}>
                                                <label className="flex items-center gap-2 p-2 border border-[#d1d5db] rounded cursor-pointer hover:bg-[#f8fafc]">
                                                  <input
                                                    type="radio"
                                                    name={`echelle-${rubriqueIndex}-${questionIndex}`}
                                                    checked={question.echelles.length > 0 && question.echelles[0].typeEchelle?._id === typeEchelle.idType}
                                                    onChange={() => changerEchelleQuestion(rubriqueIndex, questionIndex, typeIndex)}
                                                    className="text-[#2563eb] focus:ring-[#2563eb]"
                                                  />
                                                  <div className="text-xs">
                                                    <div className="font-medium">{typeEchelle.nomType}</div>
                                                    <div className="text-[#64748b]">
                                                      {typeEchelle.echelles[typeEchelle.echelles.length - 1]?.nomEchelle} → {typeEchelle.echelles[0]?.nomEchelle}
                                                    </div>
                                                  </div>
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                          
                                          {/* Aperçu de l'échelle sélectionnée */}
                                          {question.echelles && question.echelles.length > 0 && (
                                            <div className="mt-2 p-2 bg-[#f1f5f9] rounded text-xs">
                                              <div className="font-medium text-[#374151] mb-1">{t('label.apercu_echelle')} :</div>
                                              <div className="flex flex-wrap gap-1">
                                                {question.echelles.map((item, index) => (
                                                  <span key={item._id} className="bg-white px-2 py-1 rounded border text-[#64748b]">
                                                    {index + 1}. {lang === 'fr' ? item.nomFr : item.nomEn}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                          <label className="flex items-center gap-2">
                                            <input
                                              type="checkbox"
                                              checked={question.commentaireGlobal}
                                              onChange={(e) => {
                                                const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
                                                nouvelles_rubriques[rubriqueIndex].questions[questionIndex].commentaireGlobal = e.target.checked;
                                                setNewEvaluation(prev => ({ ...prev, rubriques: nouvelles_rubriques }));
                                              }}
                                              className="rounded border-[#d1d5db] text-[#2563eb] focus:ring-[#2563eb]"
                                            />
                                            <span className="text-xs text-[#374151]">{t('label.commentaire_global')}</span>
                                          </label>
                                          
                                          <button
                                            onClick={() => ajouterSousQuestion(rubriqueIndex, questionIndex)}
                                            className="flex items-center gap-1 bg-[#7c3aed] text-white px-2 py-1 rounded text-xs hover:bg-[#6d28d9] transition-colors"
                                          >
                                            <Plus className="w-3 h-3" />
                                            {t('button.ajouter_sous_question')}
                                          </button>
                                        </div>

                                        {/* Sous-questions */}
                                        {question.sousQuestions.length > 0 && (
                                          <div className="mt-3 space-y-2">
                                            <h5 className="text-xs font-medium text-[#374151]">{t('label.sous_questions')}</h5>
                                            {question.sousQuestions.map((sousQuestion, sousQuestionIndex) => (
                                              <div key={sousQuestionIndex} className="bg-white border border-[#e2e8f0] rounded p-2">
                                                <div className="flex items-center justify-between mb-2">
                                                  <div className="flex items-center gap-2">
                                                    <span className="bg-[#7c3aed] text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
                                                      {sousQuestion.ordre}
                                                    </span>
                                                    <span className="text-xs font-medium text-[#374151]">{t('label.sous_question')} {sousQuestionIndex + 1}</span>
                                                  </div>
                                                  <button
                                                    onClick={() => supprimerSousQuestion(rubriqueIndex, questionIndex, sousQuestionIndex)}
                                                    className="p-1 text-[#64748b] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded transition-colors"
                                                  >
                                                    <Trash2 className="w-3 h-3" />
                                                  </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                                  <input
                                                    type="text"
                                                    value={sousQuestion.libelleFr}
                                                    onChange={(e) => {
                                                      const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
                                                      nouvelles_rubriques[rubriqueIndex].questions[questionIndex].sousQuestions[sousQuestionIndex].libelleFr = e.target.value;
                                                      setNewEvaluation(prev => ({ ...prev, rubriques: nouvelles_rubriques }));
                                                    }}
                                                    className="w-full px-2 py-1 border border-[#d1d5db] rounded text-xs focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                                                    placeholder={t('label.sous_question_fr')}
                                                  />
                                                  <input
                                                    type="text"
                                                    value={sousQuestion.libelleEn}
                                                    onChange={(e) => {
                                                      const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
                                                      nouvelles_rubriques[rubriqueIndex].questions[questionIndex].sousQuestions[sousQuestionIndex].libelleEn = e.target.value;
                                                      setNewEvaluation(prev => ({ ...prev, rubriques: nouvelles_rubriques }));
                                                    }}
                                                    className="w-full px-2 py-1 border border-[#d1d5db] rounded text-xs focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                                                    placeholder={t('label.sous_question_en')}
                                                  />
                                                </div>
                                                <label className="flex items-center gap-2">
                                                  <input
                                                    type="checkbox"
                                                    checked={sousQuestion.commentaireObligatoire}
                                                    onChange={(e) => {
                                                      const nouvelles_rubriques = [...(newEvaluation.rubriques || [])];
                                                      nouvelles_rubriques[rubriqueIndex].questions[questionIndex].sousQuestions[sousQuestionIndex].commentaireObligatoire = e.target.checked;
                                                      setNewEvaluation(prev => ({ ...prev, rubriques: nouvelles_rubriques }));
                                                    }}
                                                    className="rounded border-[#d1d5db] text-[#2563eb] focus:ring-[#2563eb]"
                                                  />
                                                  <span className="text-xs text-[#374151]">{t('label.commentaire_obligatoire')}</span>
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#e2e8f0]">
                  <button
                    onClick={annulerEdition}
                    className="flex items-center gap-2 px-4 py-2 text-[#64748b] hover:text-[#334155] border border-[#d1d5db] rounded-lg hover:bg-[#f8fafc] transition-colors"
                  >
                    <X className="w-4 h-4" />
                    {t('button.annuler')}
                  </button>
                  <button
                    onClick={sauvegarderEvaluation}
                    className="flex items-center gap-2 bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {editingEvaluation ? t('button.mettre_a_jour') : t('button.sauvegarder')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <FormDelete evaluationChaud={selectedEvaluation} />
    </>
    
  );
};

export default EvaluationManager;