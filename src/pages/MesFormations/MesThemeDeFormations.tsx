import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";

import { useFetchData } from "../../hooks/fechDataOptions";
import { getFormationForDropDown } from "../../services/elaborations/formationAPI";
import { setErrorPageThemeFormation, setThemeFormationLoading, setThemeFormations, setThemeFormationSelected } from "../../_redux/features/elaborations/themeFormationSlice";
import { getFilteredThemeFormations } from "../../services/elaborations/themeFormationAPI";
import { setErrorPageFormation, setFormations } from "../../_redux/features/elaborations/formationSlice";
import Table from "../../components/Tables/MesFormations/Tables/Table";
import { urlContains } from "../../fonctions/fonction";
import { useLocation } from "react-router-dom";

const MesThemeDeFormations = () => {
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
    const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
    const location = useLocation();
    // Configure le header
    const filterType:string|undefined = useMemo(() => {
        if (urlContains("responsable")) {
            return "responsable";
        } else if (urlContains("participant")) {
            return "publicCible";
        }
        return undefined;
    }, [location.pathname]);

    // Un useEffect dédié uniquement à la réinitialisation des filtres
    useEffect(() => {
        setCurrentPage(1);
        setCurrentProgrammeFormation(undefined);
        setCurrentFamilleMetier(undefined);
        setCurrentFormation(undefined);
        setStartDate(null);
        setEndDate(null);
        setResetFilters(true);
    }, [location.pathname]);

    useEffect(()=>{
        dispatch(setThemeFormationSelected(undefined));
    },[])

   
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
                    filterType:filterType,
                    userId:currentUser._id,
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
    }, [currentPage, currentFormation, filterType, currentUser, startDate, endDate, resetFilters, lang]);



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
                pageDescription={filterType==="publicCible"?t('page_description.mes_themes_formation_participant'):t('page_description.mes_themes_formation')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.mes_formations')} 
            />
            <Table
                data={themeFormations}
                programmeFormations={programmeFormations}
                formations={formations}
                isParticipant={filterType==="publicCible"}
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
        </>
    );
};

export default MesThemeDeFormations;
