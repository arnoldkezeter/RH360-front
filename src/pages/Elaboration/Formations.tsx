import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../_redux/features/setting";
import { useFetchData } from "../../hooks/fechDataOptions";
import { setErrorPageFormation, setFormationLoading, setFormations } from "../../_redux/features/elaborations/formationSlice";
import { getFilteredFormations } from "../../services/elaborations/formationAPI";
import FormDelete from "../../components/Modals/Elaboration/ModalFormation/FormDelete";
import FormCreateUpdate from "../../components/Modals/Elaboration/ModalFormation/FormCreateUpdate";
import Table from "../../components/Tables/Elaboration/TableFormation/Table";

const Formations = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { formations } } = useSelector((state: RootState) => state.formationSlice);
    const { data: { axeStrategiques } } = useSelector((state: RootState) => state.axeStrategiqueSlice);
    const { data: { familleMetiers } } = useSelector((state: RootState) => state.familleMetierSlice);


    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentAxe, setCurrentAxe] = useState<AxeStrategique | undefined>();
    const [currentFamille, setCurrentFamille] = useState<FamilleMetier | undefined>();
    const [resetFilters, setResetFilters] = useState<boolean>(true);
    const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
    const [startDate, setStartDate] = useState<Date |null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    

    const { setHeaderConfig } = useHeader();

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_formation'),
            showAddButton: true,
            exportOptions: ['PDF', 'Excel'],
            onAdd: () => {setSelectedFormation(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des formations en ${format}`);
        // Implémentez ici la logique d'export
    };



    // Charge les formations en fonction des filtres
    useEffect(() => {
        // Cas : filtre sur service demandé explicitement mais service = undefined
        // => on vide la liste sans appel API
       
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
            
            apiFunction: getFilteredFormations,
            params: {
                page: currentPage,
                axeStrategique: currentAxe?._id,
                familleMetier:currentFamille?._id,
                dateDebut:startDate?.toString(),
                dateFin:endDate?.toString(),
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
    }, [currentPage, currentAxe, currentFamille, startDate, endDate, resetFilters, lang, dispatch]);



    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDateChange = (start: Date | null, end:Date | null) => {
        setStartDate(start);
        setEndDate(end)

        setCurrentFamille(undefined);
        setCurrentAxe(undefined);
        setResetFilters(false);
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
                pageDescription={t('page_description.formation')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.formations')} 
            />
            <Table
                data={formations}
                familles={familleMetiers}
                axeStrategiques={axeStrategiques}
                currentAxe={currentAxe}
                currentFamille={currentFamille}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onFamilleChange={handleFamilleChange}
                onAxeChange={handleAxeChange}
                onDateChange={handleDateChange}
                onResetFilters={handleResetFilters}
                onEdit={setSelectedFormation} 
            />
            <FormCreateUpdate formation={selectedFormation} />
            <FormDelete formation={selectedFormation} />
        </>
    );
};

export default Formations;
