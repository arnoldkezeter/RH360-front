import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";

import { useFetchData } from "../../hooks/fechDataOptions";
import { setErrorPageFormation, setFormationLoading, setFormations } from "../../_redux/features/elaborations/formationSlice";
import {getFormationsForGantt } from "../../services/elaborations/formationAPI";
import Table from "../../components/Tables/Execution/TableCalendrier/Table";

const CalendrierFormations = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { formations } } = useSelector((state: RootState) => state.formationSlice);
    const { data: { programmeFormations } } = useSelector((state: RootState) => state.programmeFormationSlice);
    const { data: { axeStrategiques } } = useSelector((state: RootState) => state.axeStrategiqueSlice);
    const { data: { familleMetiers } } = useSelector((state: RootState) => state.familleMetierSlice);


    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentProgramme, setCurrentProgramme] = useState<ProgrammeFormation | undefined>(undefined);
    const [currentAxe, setCurrentAxe] = useState<AxeStrategique | undefined>();
    const [currentFamille, setCurrentFamille] = useState<FamilleMetier | undefined>();
    const [resetFilters, setResetFilters] = useState<boolean>(true);
    const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
    const [startDate, setStartDate] = useState<Date |null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    useEffect(() => {
        if (!currentProgramme && programmeFormations.length > 0) {
            setCurrentProgramme(programmeFormations[0]);
        }
    }, [programmeFormations, currentProgramme]);

   

    const handleExportUsers = (format: string) => {
        console.log(`Export des formations en ${format}`);
        // Implémentez ici la logique d'export
    };



    // Charge les formations en fonction des filtres
    useEffect(() => {
        // Cas : filtre sur service demandé explicitement mais service = undefined
        // => on vide la liste sans appel API
        if(!currentProgramme){
            dispatch(setFormations({
                formations: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
            }));
            return;
        }    
        if (!resetFilters && !endDate && !startDate && currentAxe === undefined && currentFamille === undefined) {
            dispatch(setFormations({
                formations: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
            }));
            return;
        }
        // Cas où on ne filtre pas (pas de service, pas de statut, pas resetFilters)
        if (
            (!currentAxe && !currentFamille && (!endDate && !startDate) && !resetFilters) ||
            (axeStrategiques.length === 0 && !resetFilters)
        ) return;
        
        fetchData({
            
            apiFunction: getFormationsForGantt,
            params: {
                page: currentPage,
                axeStrategique: currentAxe?._id,
                familleMetier:currentFamille?._id,
                dateDebut:startDate?.toString(),
                dateFin:endDate?.toString(),
                programmeFormation:currentProgramme.annee,
                lang,
            },
            onSuccess: (data) => {  
                dispatch(setFormations(data || {
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
            onLoading: (isLoading) => {
                dispatch(setFormationLoading(isLoading));
            },
        });
    }, [currentPage, currentProgramme, currentAxe, currentFamille, startDate, endDate, resetFilters, lang, dispatch]);



    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDateChange = (start: Date | null, end:Date | null) => {
        setStartDate(start);
        setEndDate(end)

        setCurrentFamille(undefined);
        setCurrentAxe(undefined);
        setResetFilters(false);
    };

    const handleProgrammeChange = (programme:ProgrammeFormation) => {
        setCurrentProgramme(programme)
    };

    const handleFamilleChange = (famille: FamilleMetier) => {
        setCurrentFamille(famille);
        setCurrentAxe(undefined);
        setStartDate(null);
        setEndDate(null)
        setResetFilters(false);
    };

    const handleAxeChange = (axe: AxeStrategique) => {
        setCurrentAxe(axe);
        setCurrentFamille(undefined);
        setStartDate(null);
        setEndDate(null)
        setResetFilters(false);
    };


    const handleResetFilters = () => {
        setResetFilters(true);
        setCurrentFamille(undefined);
        setCurrentAxe(undefined);
        setStartDate(null);
        setEndDate(null)
    };

    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.calendrier_formation')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.calendrier_formation')} 
            />
            <Table
                data={formations}
                familles={familleMetiers}
                axeStrategiques={axeStrategiques}
                programmeFormations ={programmeFormations}
                currentProgramme={currentProgramme}
                currentAxe={currentAxe}
                currentFamille={currentFamille}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onProgrammeChange={handleProgrammeChange}
                onFamilleChange={handleFamilleChange}

                onAxeChange={handleAxeChange}
                onDateChange={handleDateChange}
                onResetFilters={handleResetFilters}
                onEdit={setSelectedFormation} 
            />
            {/* <FormCreateUpdate formation={selectedFormation} />
            <FormDelete formation={selectedFormation} /> */}
        </>
    );
};

export default CalendrierFormations;
