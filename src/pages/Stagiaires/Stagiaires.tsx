import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";
import Table from "../../components/Tables/Stagiaire/TableStagiaire/Table";

import { 
    setErrorPageStagiaire, 
    setStagiaires, 
    setStagiairesLoading 
} from "../../_redux/features/stagiaireSlice";
import { setErrorPageService, setServices } from "../../_redux/features/parametres/serviceSlice";
import { setErrorPageStructure, setStructures } from "../../_redux/features/parametres/strucutureSlice";
import { setShowModal } from "../../_redux/features/setting";
import { useFetchData } from "../../hooks/fechDataOptions";
import { getStructuresForDropDown } from "../../services/settings/structureAPI";
import { getServicesForDropDownByStructure } from "../../services/settings/serviceAPI";
import FormCreateUpdate from "../../components/Modals/Stagiaire/ModalStagiaire/FormCreateUpdate";
import { getStagiairesByFiltres } from "../../services/stagiaires/stagiaireAPI";
import { STATUTS } from "../../config";
import FormDelete from "../../components/Modals/Stagiaire/ModalStagiaire/FormDelete";

const Stagiaires = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { stagiaires } } = useSelector((state: RootState) => state.stagiaireSlice);
    const { data: { structures } } = useSelector((state: RootState) => state.structureSlice);
    const { data: { services } } = useSelector((state: RootState) => state.serviceSlice);
    const statuts = Object.values(STATUTS)

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentStructure, setCurrentStructure] = useState<Structure | undefined>();
    const [currentService, setCurrentService] = useState<Service | undefined>();
    const [currentStatut, setCurrentStatut] = useState<Statut | undefined>();
    const [resetFilters, setResetFilters] = useState<boolean>(true);
    const [selectedStagiaire, setSelectedStagiaire] = useState<Stagiaire | null>(null);
    const [startDate, setStartDate] = useState<Date |null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    

    const { setHeaderConfig } = useHeader();

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_stagiaire'),
            showAddButton: true,
            exportOptions: ['PDF', 'Excel'],
            onAdd: () => {setSelectedStagiaire(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des stagiaires en ${format}`);
        // Implémentez ici la logique d'export
    };

    // Charge les structures
    useEffect(() => {
        fetchData({
            apiFunction: getStructuresForDropDown,
            params: { lang },
            onSuccess: (data) => dispatch(setStructures(data)),
            onError: () => {
                dispatch(setErrorPageStructure(t('message.erreur')));
            },
        });
        
    }, [fetchData, lang, dispatch]);

    // Charge les services pour une structure spécifique
    useEffect(() => {
        if (!currentStructure || !currentStructure._id) return;

        fetchData({
            apiFunction: getServicesForDropDownByStructure,
            params: { lang, structureId: currentStructure._id },
            onSuccess: (data) => {
                dispatch(setServices(data));
                // Définir le premier service comme service courant
                if (data.services?.length > 0) {
                    setCurrentService(data.services[0]);
                } else {
                    setCurrentService(undefined);
                }
                
            },
             onError: () => {
                dispatch(setErrorPageService(t('message.erreur')));
            },
        });
    }, [fetchData, currentStructure, lang, dispatch]);


    // Charge les stagiaires en fonction des filtres
    useEffect(() => {
        // Cas : filtre sur service demandé explicitement mais service = undefined
        // => on vide la liste sans appel API
       
        if (!resetFilters && !endDate && !startDate && !currentStatut && currentService === undefined) {
            dispatch(setStagiaires({
                stagiaires: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
            }));
            return;
        }
        // Cas où on ne filtre pas (pas de service, pas de statut, pas resetFilters)
        if (
            (!currentService && (!endDate && !startDate) && !currentStatut && !resetFilters) ||
            (services.length === 0 && statuts.length === 0 && !resetFilters)
        ) return;


        fetchData({
            apiFunction: getStagiairesByFiltres,
            params: {
                page: currentPage,
                service: currentService?._id,
                statut:currentStatut?.key,
                dateDebut:startDate?.toString(),
                endDate:endDate?.toString(),
                lang,
            },
            onSuccess: (data) => {
                
                dispatch(setStagiaires(data || {
                    stagiaires: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageStagiaire(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setStagiairesLoading(isLoading));
            },
        });
    }, [currentPage, currentService, currentStatut, startDate, endDate, resetFilters, lang, dispatch]);



    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDateChange = (startDate: Date | null, endDate:Date | null) => {
        setStartDate(startDate);
        setEndDate(endDate)
        setCurrentStatut(undefined);
        setCurrentStructure(undefined);
        setCurrentService(undefined);
        setResetFilters(false);
    };

    const handleStructureChange = (structure: Structure) => {
        setCurrentStructure(structure);
        setCurrentService(undefined);
        setCurrentStatut(undefined);
        setStartDate(null);
        setEndDate(null)
        setResetFilters(false);
    };

    const handleServiceChange = (service: Service) => {
        setCurrentService(service);
        setCurrentStatut(undefined);
        setStartDate(null);
        setEndDate(null)
        setResetFilters(false);
    };

    const handleStatutChange = (statut: Statut) => {
        
        setCurrentStatut(statut);
        setStartDate(null);
        setEndDate(null)
        setCurrentStructure(undefined);
        setCurrentService(undefined);
        setResetFilters(false);
    };

    const handleResetFilters = () => {
        setResetFilters(true);
        setCurrentStructure(undefined);
        setCurrentStatut(undefined);
        setCurrentService(undefined);
        setStartDate(null);
        setEndDate(null)
    };

    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.stagiaire')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.gerer_stagiaires')} 
            />
            <Table
                data={stagiaires}
                structures={structures}
                services={services}
                currentService={currentService}
                currentStructure={currentStructure}
                currentStatut={currentStatut}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onServiceChange={handleServiceChange}
                onStructureChange={handleStructureChange}
                onStatutChange={handleStatutChange}
                onDateChange={handleDateChange}
                onResetFilters={handleResetFilters}
                onEdit={setSelectedStagiaire} 
            />
            <FormCreateUpdate stagiaire={selectedStagiaire} />
            <FormDelete stagiaire={selectedStagiaire} />
        </>
    );
};

export default Stagiaires;
