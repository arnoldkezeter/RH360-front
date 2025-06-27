import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../_redux/features/setting";

import { useFetchDepensesData } from "../../hooks/useFetchSuiviBudgetData";
import FormDelete from "../../components/Modals/Execution/ModalBudgetDepense/FormDelete";
import FormCreateUpdate from "../../components/Modals/Execution/ModalBudgetDepense/FormCreateUpdate";
import { useFetchData } from "../../hooks/fechDataOptions";
import { getFormationForDropDown } from "../../services/elaborations/formationAPI";
import { setErrorPageFormation, setFormations } from "../../_redux/features/elaborations/formationSlice";
import { getFilteredThemeFormations, getThemeFormationForDropDown } from "../../services/elaborations/themeFormationAPI";
import { setErrorPageThemeFormation, setThemeFormationLoading, setThemeFormations } from "../../_redux/features/elaborations/themeFormationSlice";
import { getBudgetFormationForDropDown } from "../../services/elaborations/budgetFormationAPI";
import { setBudgetFormationLoading, setBudgetFormations, setBudgetFormationSelected, setErrorPageBudgetFormation } from "../../_redux/features/elaborations/budgetFormationSlice";
import { TYPE_DEPENSE } from "../../config";
import Table from "../../components/Tables/Execution/TableBudgetFormation/Table";

const SuiviBudgetaires = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const fetchData = useFetchData();
  const lang = useSelector((state: RootState) => state.setting.language);
  const { data: { budgetFormations } } = useSelector((state: RootState) => state.budgetFormationSlice);
  const { data: { themeFormations } } = useSelector((state: RootState) => state.themeFormationSlice);
  const { data: { programmeFormations } } = useSelector((state: RootState) => state.programmeFormationSlice);
  const { data: { formations } } = useSelector((state: RootState) => state.formationSlice);
  const typesDepenses = Object.values(TYPE_DEPENSE)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedDepense, setSelectedDepense] = useState<Depense | null>(null);
  const [currentProgrammeFormation, setCurrentProgrammeFormation] = useState<ProgrammeFormation | undefined>(undefined);
  const [currentFormation, setCurrentFormation] = useState<Formation | undefined>(undefined);
  const [currentTheme, setCurrentTheme] = useState<ThemeFormation | undefined>(undefined);
  const [currentBudget, setCurrentBudget] = useState<BudgetFormation | undefined>(undefined);
  const [currentType, setCurrentType] = useState<TypeDepense>();


  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: t('button.ajouter_depense_formation'),
      showAddButton: false,
      exportOptions: ['PDF', 'Excel'],
      onAdd: () => { setSelectedDepense(null); dispatch(setShowModal()) },
      onExport: handleExportUsers,
    });
  }, [t]);

  useEffect(() => {
          if (!currentProgrammeFormation && programmeFormations.length > 0) {
              setCurrentProgrammeFormation(programmeFormations[0]);
          }
      }, [programmeFormations, currentProgrammeFormation]);

  const { 
    isLoading, 
    depenses,
    histogramme,
    totaux,
    error,
    addDepense,
    updateDepense,
    deleteDepense
  } = useFetchDepensesData({page:currentPage, lang:lang, budgetId:currentBudget?._id||undefined, formationId:currentFormation?._id, themeId:currentTheme?._id, type:currentType?.key});
  
  
  // Charge les formations pour une programmeFormation spécifique
  useEffect(() => {
          if (!currentProgrammeFormation || !currentProgrammeFormation._id) return;
  
          fetchData({
              apiFunction: getFormationForDropDown,
              params: { lang, programmeId: currentProgrammeFormation._id },
              onSuccess: (data) => {
                  dispatch(setFormations(data));
                  // Définir le premier formation comme formation courant
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
          },
          onLoading: (isLoading) => {
              dispatch(setThemeFormationLoading(isLoading));
          },
      });
  }, [currentFormation, lang, dispatch]);


  // Charge les budget en fonction des filtres
  useEffect(() => {          
      // Cas où on ne filtre pas (pas de formation, pas de familleMetier, pas resetFilters)
      if (
          !currentTheme || themeFormations.length === 0 
      ) return;


      fetchData({
          apiFunction: getBudgetFormationForDropDown,
          params: {
              themeId: currentTheme?._id || "",
              lang,
          },
          onSuccess: (data) => {
              // Définir le premier theme formation comme formation courant
              if (data.budgetFormations?.length > 0) {
                  setCurrentBudget(data.budgetFormations[0]);
              } else {
                  setCurrentBudget(undefined);
              }
              dispatch(setBudgetFormations(data || {
                  budgetFormations: [],
                  currentPage: 0,
                  totalItems: 0,
                  totalPages: 0,
                  pageSize: 0,
              }));
          },
          onError: () => {
              dispatch(setErrorPageBudgetFormation(t('message.erreur')));
          },
          onLoading: (isLoading) => {
              dispatch(setBudgetFormationLoading(isLoading));
          },
      });
  }, [currentTheme, lang, dispatch]);
  
  
  
  const handleExportUsers = (format: string) => {
    console.log(`Export des depenses en ${format}`);
  };

  const handleAddDepense = (depense: Depense) => {
    addDepense(depense);
  };

  const handleUpdateDepense = (depense: Depense) => {
    updateDepense(depense);
  };

  const handleDeleteDepense = (depenseId: string) => {
        deleteDepense(depenseId);
  };

  const handleProgrammeFormationChange = (programmeFormation: ProgrammeFormation) => {
      setCurrentProgrammeFormation(programmeFormation);
  };

  const handleFormationChange = (formation: Formation) => {
      setCurrentFormation(formation);
  };

  const handleThemeChange = (theme: ThemeFormation) => {
      setCurrentTheme(theme);
  };

  const handleBudgetChange = (budget: BudgetFormation) => {
      setCurrentBudget(budget);
      dispatch(setBudgetFormationSelected(budget))
  };

  const handleTypeChange = (type: TypeDepense) => {
      setCurrentType(type);
  };

  return (
    <>
      <BreadcrumbPageDescription
        pageDescription={t('page_description.suivi_budgetaire')}
        titleColor="text-[#1e3a8a]"
        pageName={t('sub_menu.suivi_budgetaire')}
      />

      <Table
        typesDepenses={typesDepenses}
        programmeFormations={programmeFormations}
        formations={formations}
        themes={themeFormations}
        budgets={budgetFormations}
        currentFormation={currentFormation}
        currentProgrammeFormation={currentProgrammeFormation}
        currentTheme={currentTheme}
        currentBudget={currentBudget}
        currentType={currentType}
        data={depenses?.depenses || []}
        histogramme={histogramme|| []}
        totaux={totaux || 0}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onFormationChange={handleFormationChange}
        onProgrammeFormationChange={handleProgrammeFormationChange}
        onThemeChange={handleThemeChange}
        onBudgetChange={handleBudgetChange}
        onTypeChange={handleTypeChange}
        onCreate={() => setSelectedDepense(null)}
        onEdit={setSelectedDepense}
        isLoading={isLoading}
      />
      <FormCreateUpdate 
        depense={selectedDepense} 
        onAdd={handleAddDepense} 
        onUpdate={handleUpdateDepense} 
      />
      <FormDelete 
        depense={selectedDepense} 
        onDelete={handleDeleteDepense} 
        />
    </>
  );
};



export default SuiviBudgetaires;
