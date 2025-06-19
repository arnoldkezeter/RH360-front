import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";
import Table from "../../components/Tables/Chercheur/TableChercheur/Table";

import { 
    setErrorPageChercheur, 
    setChercheurs, 
    setChercheursLoading 
} from "../../_redux/features/chercheurSlice";
import { setShowModal } from "../../_redux/features/setting";
import { useFetchData } from "../../hooks/fechDataOptions";
import FormCreateUpdate from "../../components/Modals/Chercheur/ModalChercheur/FormCreateUpdate";
import { STATUTS } from "../../config";
import FormDelete from "../../components/Modals/Chercheur/ModalChercheur/FormDelete";
import { setErrorPageEtablissement, setEtablissements } from "../../_redux/features/parametres/etablissementSlice";
import { getEtablissementsForDropDown } from "../../services/settings/etablissementAPI";
import { getChercheursByFiltres } from "../../services/chercheurs/chercheurAPI";

const Chercheurs = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { chercheurs } } = useSelector((state: RootState) => state.chercheurSlice);
    const { data: { etablissements } } = useSelector((state: RootState) => state.etablissementSlice);
    const statuts = Object.values(STATUTS)

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentEtablissement, setCurrentEtablissement] = useState<Etablissement | undefined>();
    const [currentStatut, setCurrentStatut] = useState<Statut | undefined>();
    const [resetFilters, setResetFilters] = useState<boolean>(true);
    const [selectedChercheur, setSelectedChercheur] = useState<Chercheur | null>(null);
    const [startDate, setStartDate] = useState<Date |null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    

    const { setHeaderConfig } = useHeader();

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_chercheur'),
            showAddButton: true,
            exportOptions: ['PDF', 'Excel'],
            onAdd: () => {setSelectedChercheur(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des chercheurs en ${format}`);
        // Implémentez ici la logique d'export
    };



    // Charge les chercheurs en fonction des filtres
    useEffect(() => {
        // Cas : filtre sur etablissement demandé explicitement mais etablissement = undefined
        // => on vide la liste sans appel API
       
        if (!resetFilters && !currentStatut && currentEtablissement === undefined) {
            dispatch(setChercheurs({
                chercheurs: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
            }));
            return;
        }
        // Cas où on ne filtre pas (pas de etablissement, pas de statut, pas resetFilters)
        if (
            (!currentEtablissement && !currentStatut && !resetFilters) ||
            (etablissements.length === 0 && statuts.length === 0 && !resetFilters)
        ) return;


        fetchData({
            apiFunction: getChercheursByFiltres,
            params: {
                page: currentPage,
                etablissement: currentEtablissement?._id,
                statut:currentStatut?.key,
                lang,
            },
            onSuccess: (data) => {
                
                dispatch(setChercheurs(data || {
                    chercheurs: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageChercheur(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setChercheursLoading(isLoading));
            },
        });
    }, [currentPage, currentEtablissement, currentStatut, resetFilters, lang, dispatch]);



    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);


    const handleEtablissementChange = (etablissement: Etablissement) => {
        setCurrentEtablissement(etablissement);
        setCurrentStatut(undefined);
        setResetFilters(false);
    };

    const handleStatutChange = (statut: Statut) => {
        setCurrentStatut(statut);
        setCurrentEtablissement(undefined);
        setResetFilters(false);
    };

    const handleResetFilters = () => {
        setResetFilters(true);
        setCurrentEtablissement(undefined);
        setCurrentStatut(undefined);
       
    };

    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.chercheur')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.gerer_chercheurs')} 
            />
            <Table
                data={chercheurs}
                etablissements={etablissements}
                currentEtablissement={currentEtablissement}
                currentStatut={currentStatut}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onEtablissementChange={handleEtablissementChange}
                onStatutChange={handleStatutChange}
                onResetFilters={handleResetFilters}
                onEdit={setSelectedChercheur} 
            />
            <FormCreateUpdate chercheur={selectedChercheur} />
            <FormDelete chercheur={selectedChercheur} />
        </>
    );
};

export default Chercheurs;
