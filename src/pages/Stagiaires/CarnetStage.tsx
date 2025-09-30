import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { STATUT_TACHE_STAGIAIRE } from "../../config";
import { useFetchData } from "../../hooks/fechDataOptions";
import { RootState } from "../../_redux/store";
import { useHeader } from "../../components/Context/HeaderConfig";
import { setShowModal } from "../../_redux/features/setting";
import { setTachesStagiaire } from "../../_redux/features/stagiaire/tacheStagiaireSlice";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";
import Table from "../../components/Tables/Stagiaire/BodyTacheStagiaire/Table";
import { useTachesStagiaires } from "../../hooks/useFetchTachesStagiaireData";
import { useNavigate } from "react-router-dom";
import CardSection from "../../components/Tables/Stagiaire/BodyTacheStagiaire/StatCard";
import WeeklySection from "../../components/Tables/Stagiaire/BodyTacheStagiaire/WeeklySection";
import GenerateSection from "../../components/Tables/Stagiaire/BodyTacheStagiaire/GenerateSection";
import FormCreateUpdate from "../../components/Modals/Stagiaire/ModalTacheStagiaire/FormCreateUpdate";
import FormDelete from "../../components/Modals/Stagiaire/ModalTacheStagiaire/FormDelete";

const CarnetsStage = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { tachesStagiaire } } = useSelector((state: RootState) => state.tacheStagiaireSlice);
    const selectedStagiaire = useSelector((state: RootState) => state.stagiaireSlice.selectedStagiaire);
    const statuts = Object.values(STATUT_TACHE_STAGIAIRE)

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentStatut, setCurrentStatut] = useState<Statut | undefined>();
    const [resetFilters, setResetFilters] = useState<boolean>(true);
    const [selectedTacheStagiaire, setSelectedTacheStagiaire] = useState<TacheStagiaire | null>(null);
    const [startDate, setStartDate] = useState<Date |null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const navigate = useNavigate()
    
     useEffect(()=>{
        if(!selectedStagiaire){
            navigate("/stagiaires/gestion-stagiaire")
        }
    },[])
    const { setHeaderConfig } = useHeader();

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_tache_stagiaire'),
            showAddButton: true,
            exportOptions: [],
            onAdd: () => {setSelectedTacheStagiaire(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des tacheStagiaires en ${format}`);
        // Implémentez ici la logique d'export
    };

    const { 
        isLoading,
        taches,
        stats,
        error,
        refresh,
        addTache,
        updateTache,
        deleteTache,
      } = useTachesStagiaires({page:currentPage, lang:lang, stagiaireId:selectedStagiaire?._id, dateDebut:startDate?.toString(), dateFin:endDate?.toString(), statut:currentStatut?.key});
      
    
    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDateChange = (startDate: Date | null, endDate:Date | null) => {
        setStartDate(startDate);
        setEndDate(endDate)
        setCurrentStatut(undefined);
        setCurrentStatut(undefined);
        setResetFilters(false);
    };

    const handleStatutChange = (statut: Statut) => {
        console.log(statut)
        setCurrentStatut(statut);
        setStartDate(null);
        setEndDate(null)
        setResetFilters(false);
    };

   

    const handleResetFilters = () => {
        setResetFilters(true);
        setCurrentStatut(undefined);
        setStartDate(null);
        setEndDate(null)
    };
    const progressionPercent = Math.round((stats?.progression || 0) * 100);
    return (
        <>
            
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.carnet_stage')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.carnet_stage')} 
                breadcrumbItems={[{
                    isActive: false,
                    name: t('sub_menu.gerer_stagiaires'),
                    path: "/stagiaires/gestion-stagiaire"
                },{
                    isActive: true,
                    name: t('sub_menu.carnet_stage'),
                    path: "#"
                }]}
            />
            <CardSection stats={stats} progressionPercent={progressionPercent} isLoading={isLoading}/>
            <Table
                data={tachesStagiaire}
                statuts={statuts}
                currentStatut={currentStatut}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onStatutChange={handleStatutChange}
                onDateChange={handleDateChange}
                onResetFilters={handleResetFilters}
                onEdit={setSelectedTacheStagiaire} 
                isLoading={isLoading}
            />
            {/* Weekly View Section */}
            <WeeklySection stats={stats} progressionPercent={progressionPercent} isLoading={isLoading}/>
                    
            {/* Generate Report Section */}
            {/* <GenerateSection dateDebut={startDate} dateFin={endDate} /> */}
            <FormCreateUpdate tacheStagiaire={selectedTacheStagiaire} onAdd={addTache} onUpdate={updateTache}/>
            <FormDelete tacheStagiaire={selectedTacheStagiaire} onDelete={deleteTache}/>
            
        </>
    );
};

export default CarnetsStage;
