import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { useTranslation } from 'react-i18next';
import { useFetchData } from '../../hooks/fechDataOptions';
import { getFilteredTacheThemeFormations, getTacheProgressionByTheme } from '../../services/elaborations/tacheThemeFormationAPI';
import { setErrorPageTacheThemeFormation, setTacheThemeFormationLoading, setTacheThemeFormations } from '../../_redux/features/elaborations/tacheThemeFormationSlice';
import { ETAT_TACHE, NIVEAUX_EXECUTION } from '../../config';
import BreadcrumbPageDescription from '../../components/BreadcrumbPageDescription';
import { useHeader } from '../../components/Context/HeaderConfig';
import { getQueryParam } from '../../fonctions/fonction';
import RendererTaches from '../../components/Tables/MesFormations/Taches/RendererTaches';


const Taches = () => {
  
  
  const [progressionExecuter, setProgressionExecuter] = useState<number>(0);
  const [progressionEnAttente, setProgressionEnAttente] = useState<number>(0);
  const dispatch = useDispatch();
  const fetchData = useFetchData();
  const { t } = useTranslation();
  const lang = useSelector((state: RootState) => state.setting.language);
  const [selectedTacheThemeFormation, setSelectedTacheThemeFormation] = useState<TacheThemeFormation | undefined>(undefined);
  const { data: { tachesThemeFormation } } = useSelector((state: RootState) => state.tacheThemeFormationSlice);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentEtatTache, setCurrentEtatTache] = useState<EtatTache | undefined>();
  const [currentNiveau, setCurrentNiveau] = useState<NiveauExecution | undefined>();
  const etats = Object.values(ETAT_TACHE)
  const niveaux = Object.values(NIVEAUX_EXECUTION)
  const { setHeaderConfig } = useHeader();
  const themeId=getQueryParam("themeId");
                           
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
          // Cas : filtre sur formation demandé explicitement mais formation = undefined
          // => on vide la liste sans appel API
         if(!themeId) return;
         
          // Cas où on ne filtre pas (pas de formation, pas de etatTache, pas resetFilters)  
  
          fetchData({
              apiFunction: getTacheProgressionByTheme,
              params: {
                  themeId:themeId||"",
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
  }, [themeId, lang, dispatch]);

  // Charge les Taches en fonction des filtres
  useEffect(() => {
          // Cas : filtre sur formation demandé explicitement mais formation = undefined
          // => on vide la liste sans appel API
         if(!themeId) return;
         
          // Cas où on ne filtre pas (pas de formation, pas de etatTache, pas resetFilters)  
  
          fetchData({
              apiFunction: getFilteredTacheThemeFormations,
              params: {
                  page: currentPage,
                  themeId:themeId||"",
                  executee:currentEtatTache?currentEtatTache?.key === ETAT_TACHE.EXECUTEE.key?true:false:undefined,
                  niveau:currentNiveau?.key,
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
  }, [currentPage, themeId, currentEtatTache, currentNiveau, lang, dispatch]);



  const handleExportUsers = (format: string) => {
    console.log(`Export des depenses en ${format}`);
  };

  // Handlers pour les dropdowns
  const handlePageChange = (page: number) => setCurrentPage(page);
  



 const handleTacheSelect = (selected: any) => {
    if (selected) setSelectedTacheThemeFormation(selected);
  };

  const handleEtatSelect = (selected: any) => {
    if (selected) setCurrentEtatTache(selected);
  };

  const handleNiveauSelect = (selected: any) => {
    if (selected) setCurrentNiveau(selected);
  };

 

  return (
    <>
      <BreadcrumbPageDescription 
          pageDescription={t('page_description.tache_executee')} 
          titleColor="text-[#1e3a8a]" 
          pageName={t('sub_menu.tache_executee')} 
      />
      <RendererTaches
        data={tachesThemeFormation}
        themeId={themeId}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onEtatTacheChange={handleEtatSelect}
        etats={etats}
        currentEtat={currentEtatTache}
        currentNiveau={currentNiveau}
        progressionExecuter={progressionExecuter}
        progressionEnAttente={progressionEnAttente}
        onEdit={handleTacheSelect} 
        niveaux={niveaux} 
        onNiveauChange={handleNiveauSelect}  
      />
      
  </>
  );
};

export default Taches;
