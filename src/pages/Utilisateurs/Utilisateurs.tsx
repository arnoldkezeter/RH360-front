import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";
import Table from "../../components/Tables/Utilisateur/TableUtilisateur/Table";

import { 
    setErrorPageUtilisateur, 
    setUtilisateurs, 
    setUtilisateursLoading 
} from "../../_redux/features/utilisateurs/utilisateurSlice";
import { setErrorPageService, setServices } from "../../_redux/features/parametres/serviceSlice";
import FormDelete from "../../components/Modals/Utilisateur/ModalUtilisateur/FormDelete";
import { setShowModal } from "../../_redux/features/setting";
import { useFetchData } from "../../hooks/fechDataOptions";
import { getUtilisateursByFiltres } from "../../services/utilisateurs/utilisateurAPI";
import { getServicesForDropDownByStructure } from "../../services/settings/serviceAPI";
import FormCreateUpdate from "../../components/Modals/Utilisateur/ModalUtilisateur/FormCreateUpdate";
import { ROLES } from "../../config";
import FormRoles from "../../components/Modals/Utilisateur/ModalUtilisateur/RoleModal";

const Utilisateurs = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();
    const roles = Object.values(ROLES)

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { utilisateurs } } = useSelector((state: RootState) => state.utilisateurSlice);
    const { data: { services } } = useSelector((state: RootState) => state.serviceSlice);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentStructure, setCurrentStructure] = useState<Structure | undefined>();
    const [currentService, setCurrentService] = useState<Service | undefined>();
    const [currentRole, setCurrentRole] = useState<Role | undefined>();
    const [resetFilters, setResetFilters] = useState<boolean>(true);
    const [selectedUtilisateur, setSelectedUtilisateur] = useState<Utilisateur | null>(null);

    const { setHeaderConfig } = useHeader();

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_utilisateur'),
            showAddButton: true,
            exportOptions: [],
            onAdd: () => {setSelectedUtilisateur(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des utilisateurs en ${format}`);
        // Implémentez ici la logique d'export
    };

    // Charge les structures
    const {data:{structures}} = useSelector((state: RootState) => state.structureSlice)

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


    // Charge les utilisateurs en fonction des filtres
    useEffect(() => {
    // Cas : filtre sur service demandé explicitement mais service = undefined
    // => on vide la liste sans appel API
    if (!resetFilters && !currentRole && currentService === undefined) {
        dispatch(setUtilisateurs({
            utilisateurs: [],
            currentPage: 0,
            totalItems: 0,
            totalPages: 0,
            pageSize: 0,
        }));
        return;
    }

    // Cas où on ne filtre pas (pas de service, pas de role, pas resetFilters)
    if (
        (!currentService && !currentRole && !resetFilters) ||
        (services.length === 0 && roles.length === 0 && !resetFilters)
    ) return;

    fetchData({
        apiFunction: getUtilisateursByFiltres,
        params: {
            page: currentPage,
            service: currentService?._id,
            role: currentRole?.key,
            lang,
        },
        onSuccess: (data) => {
            dispatch(setUtilisateurs(data || {
                utilisateurs: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
            }));
        },
        onError: () => {
            dispatch(setErrorPageUtilisateur(t('message.erreur')));
        },
        onLoading: (isLoading) => {
            dispatch(setUtilisateursLoading(isLoading));
        },
    });
    }, [currentPage, currentService, currentRole, resetFilters, lang, dispatch, fetchData]);



    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleStructureChange = (structure: Structure) => {
        setCurrentStructure(structure);
        setCurrentService(undefined);
        setCurrentRole(undefined);
        setResetFilters(false);
    };

    const handleServiceChange = (service: Service) => {
        setCurrentService(service);
        setCurrentRole(undefined);
        setResetFilters(false);
    };

    const handleRoleChange = (role: Role) => {
        setCurrentRole(role);
        setCurrentStructure(undefined);
        setCurrentService(undefined);
        setResetFilters(false);
    };

    const handleResetFilters = () => {
        setResetFilters(true);
        setCurrentStructure(undefined);
        setCurrentRole(undefined);
        setCurrentService(undefined);
    };

    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.utilisateur')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.gerer_utilisateurs')} 
            />
            <Table
                data={utilisateurs}
                structures={structures}
                services={services}
                currentService={currentService}
                currentStructure={currentStructure}
                currentRole={currentRole}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onServiceChange={handleServiceChange}
                onStructureChange={handleStructureChange}
                onRoleChange={handleRoleChange}
                onResetFilters={handleResetFilters}
                onEdit={setSelectedUtilisateur} 
            />
            <FormCreateUpdate utilisateur={selectedUtilisateur} />
            <FormDelete utilisateur={selectedUtilisateur} />
            <FormRoles utilisateur={selectedUtilisateur} />
        </>
    );
};

export default Utilisateurs;
