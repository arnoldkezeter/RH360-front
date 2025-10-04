import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { useTranslation } from 'react-i18next';
import { useFetchData } from '../../hooks/fechDataOptions';
import { getFormationForDropDown } from '../../services/elaborations/formationAPI';
import { setErrorPageFormation, setFormations } from '../../_redux/features/elaborations/formationSlice';
import { getThemeFormationForDropDown } from '../../services/elaborations/themeFormationAPI';
import { setErrorPageThemeFormation, setThemeFormations } from '../../_redux/features/elaborations/themeFormationSlice';
import { getFilteredTacheThemeFormations, getTacheProgressionByTheme } from '../../services/elaborations/tacheThemeFormationAPI';
import { setErrorPageTacheThemeFormation, setTacheThemeFormationLoading, setTacheThemeFormations } from '../../_redux/features/elaborations/tacheThemeFormationSlice';
import { ETAT_TACHE } from '../../config';
import BreadcrumbPageDescription from '../../components/BreadcrumbPageDescription';
import RendererTacheExecutee from '../../components/Tables/Execution/TachesExecutees/RendererTacheExecutee';
import { useHeader } from '../../components/Context/HeaderConfig';


const TachesExecutees = () => {
  
  
  const [progressionExecuter, setProgressionExecuter] = useState<number>(0);
  const [progressionEnAttente, setProgressionEnAttente] = useState<number>(0);
  const dispatch = useDispatch();
  const fetchData = useFetchData();
  const { t } = useTranslation();
  const lang = useSelector((state: RootState) => state.setting.language);
  const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
  
  const { data: { themeFormations } } = useSelector((state: RootState) => state.themeFormationSlice);
  const { data: { programmeFormations } } = useSelector((state: RootState) => state.programmeFormationSlice);
  const { data: { formations } } = useSelector((state: RootState) => state.formationSlice);
  const { data: { tachesThemeFormation } } = useSelector((state: RootState) => state.tacheThemeFormationSlice);
  const [currentProgrammeFormation, setCurrentProgrammeFormation] = useState<ProgrammeFormation|undefined>(undefined);
  const [currentFormation, setCurrentFormation] = useState<Formation|undefined>(undefined);
  const [currentTheme, setCurrentTheme] = useState<ThemeFormation|undefined>(undefined);
  const [selectedTacheThemeFormation, setSelectedTacheThemeFormation] = useState<TacheThemeFormation | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentEtatTache, setCurrentEtatTache] = useState<EtatTache | undefined>();
  const etats = Object.values(ETAT_TACHE)
  const { setHeaderConfig } = useHeader();
  
  useEffect(() => {
    setHeaderConfig({
      title: undefined,
      showAddButton: false,
      exportOptions: ['PDF', 'Excel'],
      onAdd: () => {},
      onExport: handleExportUsers,
    });
  }, [t]);

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
      params: { lang, programmeId: currentProgrammeFormation._id, userId:currentUser._id },
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
        userId:currentUser._id,
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

  useEffect(() => {
          // Cas : filtre sur formation demandé explicitement mais formation = undefined
          // => on vide la liste sans appel API
         if(!currentTheme) return;
         
          // Cas où on ne filtre pas (pas de formation, pas de etatTache, pas resetFilters)  
  
          fetchData({
              apiFunction: getTacheProgressionByTheme,
              params: {
                  themeId:currentTheme?._id||"",
                  lang,
              },
              onSuccess: (data) => {
                  // console.log(data)
                  if(data.length===0){
                    setProgressionExecuter(0)
                    setProgressionEnAttente(0)
                  }else{
                    setProgressionExecuter(data.progressionExecutee)
                    setProgressionEnAttente(data.progressionEnAttente)
                  }
              },
              onError: () => {
                  dispatch(setErrorPageTacheThemeFormation(t('message.erreur')));
              },
              onLoading: (isLoading) => {
                  dispatch(setTacheThemeFormationLoading(isLoading));
              },
          });
  }, [currentTheme, lang, dispatch]);

  // Charge les Taches en fonction des filtres
  useEffect(() => {
          // Cas : filtre sur formation demandé explicitement mais formation = undefined
          // => on vide la liste sans appel API
         if(!currentTheme) return;
         
          // Cas où on ne filtre pas (pas de formation, pas de etatTache, pas resetFilters)  
  
          fetchData({
              apiFunction: getFilteredTacheThemeFormations,
              params: {
                  page: currentPage,
                  themeId:currentTheme?._id||"",
                  executee:currentEtatTache?currentEtatTache?.key === ETAT_TACHE.EXECUTEE.key?true:false:undefined,
                  lang,
              },
              onSuccess: (data) => {
                  
                  dispatch(setTacheThemeFormations(data || {
                      tacheThemeFormations: [],
                      currentPage: 0,
                      totalItems: 0,
                      totalPages: 0,
                      pageSize: 0,
                  }));
              },
              onError: () => {
                  dispatch(setErrorPageTacheThemeFormation(t('message.erreur')));
              },
              onLoading: (isLoading) => {
                  dispatch(setTacheThemeFormationLoading(isLoading));
              },
          });
  }, [currentPage, currentTheme, currentEtatTache, lang, dispatch]);



  const handleExportUsers = (format: string) => {
    console.log(`Export des depenses en ${format}`);
  };

  // Handlers pour les dropdowns
  const handlePageChange = (page: number) => setCurrentPage(page);
  
  const handleProgrammeFormationSelect = (selected: any) => {
    if (selected) setCurrentProgrammeFormation(selected);
  };

  const handleFormationSelect = (selected: any) => {
    if (selected) setCurrentFormation(selected);
  };

  const handleThemeFormationSelect = (selected: any) => {
    if (selected) setCurrentTheme(selected);
  };

  const handleEtatSelect = (selected: any) => {
    if (selected) setCurrentEtatTache(selected);
  };

  const handleTacheSelect = (selected: any) => {
    if (selected) setSelectedTacheThemeFormation(selected);
  };

  return (
    <>
      <BreadcrumbPageDescription 
          pageDescription={t('page_description.tache_executee')} 
          titleColor="text-[#1e3a8a]" 
          pageName={t('sub_menu.tache_executee')} 
      />
      <RendererTacheExecutee
        data={tachesThemeFormation}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onEdit={handleTacheSelect} 
        onFormationChange={handleFormationSelect} 
        onProgrammeFormationChange={handleProgrammeFormationSelect} 
        onThemeChange={handleThemeFormationSelect} 
        onEtatTacheChange={handleEtatSelect} 
        programmeFormations={programmeFormations} 
        formations={formations} 
        themes={themeFormations} 
        etats={etats} 
        currentProgrammeFormation={currentProgrammeFormation} 
        currentFormation={currentFormation} 
        currentTheme={currentTheme} 
        currentEtat={currentEtatTache} 
        progressionExecuter={progressionExecuter}  
        progressionEnAttente={progressionEnAttente}      
      />
      
  </>
  );
};

export default TachesExecutees;
