import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../_redux/features/setting";
import Table from "../../components/Tables/Elaboration/TableProgrammeFormation/Table";
import { useFetchProgrammesData } from "../../hooks/useFetchProgrammesData";
import FormCreateUpdate from "../../components/Modals/Elaboration/ModalProgrammeFormation/FormCreateUpdate";
import FormDelete from "../../components/Modals/Elaboration/ModalProgrammeFormation/FormDelete";

const ProgrammeFormations = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const lang = useSelector((state: RootState) => state.setting.language);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProgrammeFormation, setSelectedProgrammeFormation] = useState<ProgrammeFormation | null>(null);
  const { 
    isLoading, 
    programmes, 
    repartitionFormations, 
    totalProgrammesActifs, 
    pourcentageExecution, 
    error, 
    addProgramme, 
    updateProgramme,
    deleteProgramme 
  } = useFetchProgrammesData(currentPage, lang);

  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: t('button.ajouter_programme_formation'),
      showAddButton: true,
      exportOptions: ['PDF', 'Excel'],
      onAdd: () => { setSelectedProgrammeFormation(null); dispatch(setShowModal()) },
      onExport: handleExportUsers,
    });
  }, [t]);

  const handleExportUsers = (format: string) => {
    console.log(`Export des programmeFormations en ${format}`);
  };

  const handleAddProgramme = (programme: ProgrammeFormation) => {
    addProgramme(programme);
  };

  const handleUpdateProgramme = (programme: ProgrammeFormation) => {
    updateProgramme(programme);
  };

  const handleDeleteProgramme = (programmeId: string) => {
        deleteProgramme(programmeId);
  };

  return (
    <>
      <BreadcrumbPageDescription
        pageDescription={t('page_description.programme_formation')}
        titleColor="text-[#1e3a8a]"
        pageName={t('sub_menu.programmes_formation')}
      />

      <Table
        data={programmes?.programmeFormations || []}
        repartitions={repartitionFormations || []}
        programmeActif={totalProgrammesActifs || 0}
        pourcentageExecution={pourcentageExecution || 0}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onCreate={() => setSelectedProgrammeFormation(null)}
        onEdit={setSelectedProgrammeFormation}
        isLoading={isLoading}
      />
      <FormCreateUpdate 
        programmeFormation={selectedProgrammeFormation} 
        onAdd={handleAddProgramme} 
        onUpdate={handleUpdateProgramme} 
      />
      <FormDelete 
        programmeFormation={selectedProgrammeFormation} 
        onDelete={handleDeleteProgramme} 
        />
    </>
  );
};



export default ProgrammeFormations;
