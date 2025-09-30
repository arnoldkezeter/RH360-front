import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useHeader } from "../../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../../_redux/features/setting";
import { useFetchData } from "../../../hooks/fechDataOptions";
import { getFormationForDropDown } from "../../../services/elaborations/formationAPI";
import { setErrorPageThemeFormation, setThemeFormationLoading, setThemeFormations, setThemeFormationSelected } from "../../../_redux/features/elaborations/themeFormationSlice";
import { getFilteredThemeFormations } from "../../../services/elaborations/themeFormationAPI";
import Table from "../../../components/Tables/Elaboration/ThemeFormation/TableThemeFormation/Table";
import { setErrorPageFormation, setFormations } from "../../../_redux/features/elaborations/formationSlice";
import FormDelete from "../../../components/Modals/Elaboration/Formation/ModalThemeFormation/FormDelete";
import FormCreateUpdate from "../../../components/Modals/Elaboration/Formation/ModalThemeFormation/FormCreateUpdate";

const ThemeFormations = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { themeFormations } } = useSelector((state: RootState) => state.themeFormationSlice);
    const { data: { programmeFormations } } = useSelector((state: RootState) => state.programmeFormationSlice);
    const { data: { formations } } = useSelector((state: RootState) => state.formationSlice);
    const { data: { familleMetiers } } = useSelector((state: RootState) => state.familleMetierSlice);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentProgrammeFormation, setCurrentProgrammeFormation] = useState<ProgrammeFormation | undefined>();
    const [currentFormation, setCurrentFormation] = useState<Formation | undefined>();
    const [currentFamilleMetier, setCurrentFamilleMetier] = useState<FamilleMetier | undefined>();
    const [resetFilters, setResetFilters] = useState<boolean>(true);
    const [selectedThemeFormation, setSelectedThemeFormation] = useState<ThemeFormation | null>(null);
    const [startDate, setStartDate] = useState<Date |null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    

    const { setHeaderConfig } = useHeader();

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_theme_formation'),
            showAddButton: true,
            exportOptions: [],
            onAdd: () => {setSelectedThemeFormation(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des themeFormations en ${format}`);
        // Implémentez ici la logique d'export
    };

    useEffect(()=>{
        dispatch(setThemeFormationSelected(undefined));
    },[])

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
        // Cas : filtre sur formation demandé explicitement mais formation = undefined
        // => on vide la liste sans appel API
       
        if (!resetFilters && !endDate && !startDate && !currentFamilleMetier && currentFormation === undefined) {
            dispatch(setThemeFormations({
                themeFormations: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
            }));
            return;
        }
        // Cas où on ne filtre pas (pas de formation, pas de familleMetier, pas resetFilters)
        if (
            (!currentFormation && (!endDate && !startDate) && !currentFamilleMetier && !resetFilters) ||
            (formations.length === 0 && familleMetiers.length === 0 && !resetFilters)
        ) return;


        fetchData({
            apiFunction: getFilteredThemeFormations,
            params: {
                page: currentPage,
                formation: currentFormation?._id,
                familleMetier:currentFamilleMetier?._id,
                dateDebut:startDate?.toString(),
                dateFin:endDate?.toString(),
                lang,
            },
            onSuccess: (data) => {
                
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
    }, [currentPage, currentFormation, currentFamilleMetier, startDate, endDate, resetFilters, lang, dispatch]);



    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDateChange = (startDate: Date | null, endDate:Date | null) => {
        setStartDate(startDate);
        setEndDate(endDate)
        setCurrentFamilleMetier(undefined);
        setCurrentProgrammeFormation(undefined);
        setCurrentFormation(undefined);
        setResetFilters(false);
    };

    const handleProgrammeFormationChange = (programmeFormation: ProgrammeFormation) => {
        setCurrentProgrammeFormation(programmeFormation);
        setCurrentFormation(undefined);
        setCurrentFamilleMetier(undefined);
        setStartDate(null);
        setEndDate(null)
        setResetFilters(false);
    };

    const handleFormationChange = (formation: Formation) => {
        setCurrentFormation(formation);
        setCurrentFamilleMetier(undefined);
        setStartDate(null);
        setEndDate(null)
        setResetFilters(false);
    };

    const handleFamilleMetierChange = (familleMetier: FamilleMetier) => {
        
        setCurrentFamilleMetier(familleMetier);
        setStartDate(null);
        setEndDate(null)
        setCurrentProgrammeFormation(undefined);
        setCurrentFormation(undefined);
        setResetFilters(false);
    };

    const handleResetFilters = () => {
        setResetFilters(true);
        setCurrentProgrammeFormation(undefined);
        setCurrentFamilleMetier(undefined);
        setCurrentFormation(undefined);
        setStartDate(null);
        setEndDate(null)
    };

    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.theme_formation')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.themes_formations')} 
            />
            <Table
                data={themeFormations}
                programmeFormations={programmeFormations}
                formations={formations}
                currentFormation={currentFormation}
                currentProgrammeFormation={currentProgrammeFormation}
                currentFamilleMetier={currentFamilleMetier}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onFormationChange={handleFormationChange}
                onProgrammeFormationChange={handleProgrammeFormationChange}
                onFamilleMetierChange={handleFamilleMetierChange}
                onDateChange={handleDateChange}
                onResetFilters={handleResetFilters}
                onEdit={setSelectedThemeFormation} 
            />
            <FormCreateUpdate themeFormation={selectedThemeFormation} />
            <FormDelete themeFormation={selectedThemeFormation} />
        </>
    );
};

export default ThemeFormations;
