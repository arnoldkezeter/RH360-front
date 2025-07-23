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
import RapportBody from "../../components/Tables/Execution/Rapport/RapportBody";
import { useFetchRapportFormationData } from "../../hooks/useRapportFormationData";

const RapportFormations = () => {
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
      data,
      error,
      isLoading, 
      
    } = useFetchRapportFormationData({programmeId:currentProgrammeFormation?._id, formationId:currentFormation?._id});
  
  // Charge les formations pour une programmeFormation spécifique
  useEffect(() => {
          if (!currentProgrammeFormation || !currentProgrammeFormation._id) return;
  
          fetchData({
              apiFunction: getFormationForDropDown,
              params: { lang, programmeId: currentProgrammeFormation._id },
              onSuccess: (data) => {
                  dispatch(setFormations(data|| {
                    formations: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
                  
                  
              },
               onError: () => {
                  dispatch(setErrorPageFormation(t('message.erreur')));
              },
          });
  }, [fetchData, currentProgrammeFormation, lang, dispatch]);

  
  const handleExportUsers = (format: string) => {
    console.log(`Export des depenses en ${format}`);
  };


  const handleProgrammeFormationChange = (programmeFormation: ProgrammeFormation) => {
      setCurrentProgrammeFormation(programmeFormation);
      setCurrentFormation(undefined)
  };

  const handleFormationChange = (formation: Formation) => {
      setCurrentFormation(formation);
  };


  return (
    <>
      <BreadcrumbPageDescription
        pageDescription={t('page_description.rapport_formation')}
        titleColor="text-[#1e3a8a]"
        pageName={t('sub_menu.rapport_formation')}
      />

      <RapportBody
        programmeFormations={programmeFormations}
        formations={formations}
        currentFormation={currentFormation}
        currentProgrammeFormation={currentProgrammeFormation}
        pourcentageExecution={data.tauxExecution} 
        coutFormations={data.coutsFormationOuTheme} 
        statPersonnesFormes={data.statsParticipants} 
        formateurs={data.statsFormateurs} 
        onFormationChange={handleFormationChange}
        onProgrammeFormationChange={handleProgrammeFormationChange}
       
        isLoading={isLoading}
      />
    </>
  );
};



export default RapportFormations;
