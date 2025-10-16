import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../_redux/features/setting";

import { useFetchData } from "../../hooks/fechDataOptions";
import { getFormationForDropDown } from "../../services/elaborations/formationAPI";
import { setErrorPageFormation, setFormations } from "../../_redux/features/elaborations/formationSlice";
import { setErrorPageThemeFormation, setThemeFormationLoading, setThemeFormations } from "../../_redux/features/elaborations/themeFormationSlice";
import { getFilteredSupportsFormation } from "../../services/executions/supportFormationAPI";
import { setErrorPageSupportFormation, setSupportFormationLoading, setSupportFormations } from "../../_redux/features/execution/supportFormationSlice";
import { getThemeFormationForDropDown } from "../../services/elaborations/themeFormationAPI";
import SupportFormationBody from "../../components/Tables/Execution/SupportFormations/SupportFormationBody";
import FormCreateUpdate from "../../components/Modals/Execution/SupportFormation/FormCreateUpdate";
import FormDelete from "../../components/Modals/Execution/SupportFormation/FormDelete";


const SupportFormationManager = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const fetchData = useFetchData();
  const lang = useSelector((state: RootState) => state.setting.language);
  const { data: { supportFormations } } = useSelector((state: RootState) => state.supportFormationSlice);
  const pageIsLoading  = useSelector((state: RootState) => state.supportFormationSlice.pageIsLoading);
  const { data: { themeFormations } } = useSelector((state: RootState) => state.themeFormationSlice);
  const { data: { programmeFormations } } = useSelector((state: RootState) => state.programmeFormationSlice);
  const { data: { formations } } = useSelector((state: RootState) => state.formationSlice);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedSupport, setSelectedSupport] = useState<SupportFormation | null>(null);
  const [currentProgrammeFormation, setCurrentProgrammeFormation] = useState<ProgrammeFormation | undefined>(undefined);
  const [currentFormation, setCurrentFormation] = useState<Formation | undefined>(undefined);
  const [currentTheme, setCurrentTheme] = useState<ThemeFormation | undefined>(undefined);
 


  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: t('button.ajouter_support'),
      showAddButton: true,
      exportOptions: [],
      onAdd: () => { setSelectedSupport(null); dispatch(setShowModal()) },
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
              params: { lang, programmeId: currentProgrammeFormation._id },
              onSuccess: (data) => {
                  dispatch(setFormations(data));
                  // Définir le premier formation comme formation courant
                  if (data && data.formations?.length > 0) {
                      setCurrentFormation(data.formations[0]);
                  } else {
                      setCurrentFormation(undefined);
                  }
                  
              },
               onError: () => {
                  dispatch(setErrorPageFormation(t('message.erreur')));
              },
          });
  }, [currentProgrammeFormation, lang, dispatch]);


  // Charge les themeFormations en fonction des filtres
  useEffect(() => {          
      // Cas où on ne filtre pas (pas de formation, pas de familleMetier, pas resetFilters)
      if (
          !currentFormation || formations.length === 0 
      ) return;


      fetchData({
          apiFunction: getThemeFormationForDropDown,
          params: {
              formation: currentFormation?._id || "",
              lang,
          },
          onSuccess: (data) => {
              // Définir le premier theme formation comme formation courant
              if (data && data.themeFormations?.length > 0) {
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
          },
          onLoading: (isLoading) => {
              dispatch(setThemeFormationLoading(isLoading));
          },
      });
  }, [currentFormation, lang, dispatch]);

  
  // Charge les supports en fonction des filtres
    useEffect(() => {
       
        if (currentTheme === undefined) {
            dispatch(setSupportFormations({
                supportFormations: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
            }));
            return;
        }

        fetchData({
            apiFunction: getFilteredSupportsFormation,
            params: {
                page: currentPage,
                themeId: currentTheme?._id,
                lang,
            },
            onSuccess: (data) => {
                
                dispatch(setSupportFormations(data || {
                    supportFormations: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageSupportFormation(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setSupportFormationLoading(isLoading));
            },
        });
    }, [currentPage, currentTheme, lang, dispatch]);
    
  const handleProgrammeFormationChange = (programmeFormation: ProgrammeFormation) => {
      setCurrentProgrammeFormation(programmeFormation);
  };

  const handleFormationChange = (formation: Formation) => {
      setCurrentFormation(formation);
  };

  const handleThemeChange = (theme: ThemeFormation) => {
      setCurrentTheme(theme);
  };

  return (
    <>
      <BreadcrumbPageDescription
        pageDescription={t('page_description.support_formation')}
        titleColor="text-[#1e3a8a]"
        pageName={t('sub_menu.support_formation')}
      />

      <SupportFormationBody
        programmeFormations={programmeFormations}
        formations={formations}
        themes={themeFormations}
        currentFormation={currentFormation}
        currentProgrammeFormation={currentProgrammeFormation}
        currentTheme={currentTheme}
        data={supportFormations}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onFormationChange={handleFormationChange}
        onProgrammeFormationChange={handleProgrammeFormationChange}
        onThemeChange={handleThemeChange}
        onEdit={setSelectedSupport}
        isLoading={pageIsLoading}
      />

      <FormCreateUpdate supportFormation={selectedSupport} theme={currentTheme}/>
      <FormDelete support={selectedSupport}/>
      
    </>
  );
};



export default SupportFormationManager;
