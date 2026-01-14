import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";

import { setShowModal, setShowModalGenerateDoc } from "../../_redux/features/setting";

import { useFetchDepensesData } from "../../hooks/useFetchSuiviBudgetData";
import FormDelete from "../../components/Modals/Execution/ModalBudgetDepense/FormDelete";
import FormCreateUpdate from "../../components/Modals/Execution/ModalBudgetDepense/FormCreateUpdate";
import { useFetchData } from "../../hooks/fechDataOptions";
import { getFormationForDropDown } from "../../services/elaborations/formationAPI";
import { setErrorPageFormation, setFormations } from "../../_redux/features/elaborations/formationSlice";
import { getBudgetFormationForDropDown } from "../../services/elaborations/budgetFormationAPI";
import { setBudgetFormationLoading, setBudgetFormations, setBudgetFormationSelected, setErrorPageBudgetFormation } from "../../_redux/features/elaborations/budgetFormationSlice";
import { TYPE_DEPENSE } from "../../config";
import Table from "../../components/Tables/Execution/TableBudgetFormation/Table";
import { generateDepense } from "../../services/executions/depenseAPI";
import { getThemeFormationForDropDown } from "../../services/elaborations/themeFormationAPI";
import { setErrorPageThemeFormation, setThemeFormations } from "../../_redux/features/elaborations/themeFormationSlice";
import FormCreateUpdateNoteBudget from "../../components/Modals/Notes/ModalNoteService/FormCreateUpdateNoteBudget";

const SuiviBudgetaires = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const fetchData = useFetchData();
  const lang = useSelector((state: RootState) => state.setting.language);
  const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
  const { data: { programmeFormations } } = useSelector((state: RootState) => state.programmeFormationSlice);
  const { data: { formations } } = useSelector((state: RootState) => state.formationSlice);
  const { data: { themeFormations } } = useSelector((state: RootState) => state.themeFormationSlice);
  const typesDepenses = Object.values(TYPE_DEPENSE)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedDepense, setSelectedDepense] = useState<Depense | null>(null);
  const [currentProgrammeFormation, setCurrentProgrammeFormation] = useState<ProgrammeFormation | undefined>(undefined);
  const [currentFormation, setCurrentFormation] = useState<Formation | undefined>(undefined);
  const [isExporting, setIsExporting]=useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeFormation | undefined>(undefined);
  const [currentType, setCurrentType] = useState<TypeDepense>();


  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: t('button.ajouter_depense_formation'),
      showAddButton: false,
      exportOptions: ['PDF'],
      onAdd: () => { setSelectedDepense(null); dispatch(setShowModal()) },
      onExport: handleExport,
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
  } = useFetchDepensesData({page:currentPage, lang:lang, themeId:currentTheme?._id||undefined, type:currentType?.key});
  
  
  // Charge les formations pour un programmeFormation spécifique
  useEffect(() => {
          if (!currentProgrammeFormation || !currentProgrammeFormation._id) return;
  
          fetchData({
              apiFunction: getFormationForDropDown,
              params: { 
                lang, 
                programmeId: currentProgrammeFormation._id, 
                userId:currentUser._id
              },
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

  // Charge les themes pour une formation spécifique
  useEffect(() => {
          if (!currentFormation || !currentFormation._id) return;
  
          fetchData({
              apiFunction: getThemeFormationForDropDown,
              params: { 
                lang, 
                formation: currentFormation._id, 
                userId:currentUser._id
              },
              onSuccess: (data) => {
                  dispatch(setThemeFormations(data));
                  // Définir le premier formation comme formation courant
                  if (data.themeFormations?.length > 0) {
                      setCurrentTheme(data.themeFormations[0]);
                  } else {
                      setCurrentTheme(undefined);
                  }
                  
              },
               onError: () => {
                  dispatch(setErrorPageThemeFormation(t('message.erreur')));
              },
          });
  }, [fetchData, currentFormation, lang, dispatch]);
  
  const handleExport = async () => {
    dispatch(setShowModalGenerateDoc());
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

  const handleThemeFormationChange = (theme: ThemeFormation) => {
      setCurrentTheme(theme);
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
        currentFormation={currentFormation}
        currentTheme={currentTheme}
        currentProgrammeFormation={currentProgrammeFormation}
        currentType={currentType}
        data={depenses?.depenses || []}
        histogramme={histogramme|| []}
        totaux={totaux || 0}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onFormationChange={handleFormationChange}
        onThemeChange={handleThemeFormationChange}
        onProgrammeFormationChange={handleProgrammeFormationChange}
        onTypeChange={handleTypeChange}
        onCreate={() => setSelectedDepense(null)}
        onEdit={setSelectedDepense}
        isLoading={isLoading}
      />
      <FormCreateUpdate 
        depense={selectedDepense} 
        themeId={currentTheme?._id!}
        onAdd={handleAddDepense} 
        onUpdate={handleUpdateDepense} 
      />
      <FormDelete 
        depense={selectedDepense} 
        onDelete={handleDeleteDepense} 
      />
      <FormCreateUpdateNoteBudget 
        note={undefined} 
        themeId={currentTheme?._id!}
      />
    </>
  );
};



export default SuiviBudgetaires;
