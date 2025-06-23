import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useHeader } from "../../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../../_redux/features/setting";
import { useFetchData } from "../../../hooks/fechDataOptions";
import { getFormationForDropDown } from "../../../services/elaborations/formationAPI";
import { setErrorPageTacheThemeFormation, setTacheThemeFormationLoading, setTacheThemeFormations } from "../../../_redux/features/elaborations/tacheThemeFormationSlice";
import { getFilteredTacheThemeFormations } from "../../../services/elaborations/tacheThemeFormationAPI";
import FormCreateUpdate from "../../../components/Modals/Elaboration/Formation/ModalTacheThemeFormation/FormCreateUpdate";
import FormDelete from "../../../components/Modals/Elaboration/Formation/ModalTacheThemeFormation/FormDelete";
import Table from "../../../components/Tables/Elaboration/ThemeFormation/TableTacheFormation/Table";
import { ETAT_TACHE } from "../../../config";
import { useNavigate } from "react-router-dom";

const TacheThemeFormations = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { tachesThemeFormation } } = useSelector((state: RootState) => state.tacheThemeFormationSlice);
    const fetchData = useFetchData()
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentEtatTache, setCurrentEtatTache] = useState<EtatTache | undefined>();
    const [resetFilters, setResetFilters] = useState<boolean>(true);
    const [selectedTacheThemeFormation, setSelectedTacheThemeFormation] = useState<TacheThemeFormation | null>(null);
    const [startDate, setStartDate] = useState<Date |null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    

    const { setHeaderConfig } = useHeader();

    const selectedTheme = useSelector((state: RootState) => state.themeFormationSlice.selectedTheme);
    
    useEffect(()=>{
        if(!selectedTheme){
            navigate("/elaboration-programme/formation/themes-formation")
        }
    },[])

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_tache_formation'),
            showAddButton: true,
            exportOptions: ['PDF', 'Excel'],
            onAdd: () => {setSelectedTacheThemeFormation(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des tacheThemeFormations en ${format}`);
        // Implémentez ici la logique d'export
    };


    // Charge les tacheThemeFormations en fonction des filtres
    useEffect(() => {
        // Cas : filtre sur formation demandé explicitement mais formation = undefined
        // => on vide la liste sans appel API
       if(!selectedTheme) return;
        if (!resetFilters && !endDate && !startDate && !currentEtatTache) {
            dispatch(setTacheThemeFormations({
                tachesThemeFormation: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
            }));
            return;
        }
        // Cas où on ne filtre pas (pas de formation, pas de etatTache, pas resetFilters)
        if (
            ((!endDate && !startDate) && !currentEtatTache && !resetFilters) 
            
        ) return;


        fetchData({
            apiFunction: getFilteredTacheThemeFormations,
            params: {
                page: currentPage,
                themeId:selectedTheme?._id||"",
                executee:currentEtatTache?.key === ETAT_TACHE.EXECUTEE.key?true:false,
                dateDebut:startDate?.toString(),
                dateFin:endDate?.toString(),
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
    }, [currentPage, currentEtatTache, startDate, endDate, resetFilters, lang, dispatch]);



    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDateChange = (startDate: Date | null, endDate:Date | null) => {
        setStartDate(startDate);
        setEndDate(endDate)
        setCurrentEtatTache(undefined);
      
        setResetFilters(false);
    };


    const handleEtatTacheChange = (etatTache: EtatTache) => {
        
        setCurrentEtatTache(etatTache);
        setStartDate(null);
        setEndDate(null)
        setResetFilters(false);
    };

    const handleResetFilters = () => {
        setResetFilters(true);
        setCurrentEtatTache(undefined);
        setStartDate(null);
        setEndDate(null)
    };

    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.tache_formation')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.taches_formations')} 
                breadcrumbItems={[{
                    isActive: false,
                    name: t('sub_menu.themes_formations'),
                    path: "/elaboration-programme/formation/themes-formation"
                },{
                    isActive: true,
                    name: t('sub_menu.taches_formations'),
                    path: "#"
                }]}
            />
            <Table
                data={tachesThemeFormation}
                currentEtatTache={currentEtatTache}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onEtatTacheChange={handleEtatTacheChange}
                onDateChange={handleDateChange}
                onResetFilters={handleResetFilters}
                onEdit={setSelectedTacheThemeFormation} 
            />
            <FormCreateUpdate tacheThemeFormation={selectedTacheThemeFormation} />
            <FormDelete tacheThemeFormation={selectedTacheThemeFormation} />
        </>
    );
};

export default TacheThemeFormations;
