import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useHeader } from "../../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../../_redux/features/setting";
import { useFetchData } from "../../../hooks/fechDataOptions";
import { useNavigate } from "react-router-dom";
import { getBesoinsByUser } from "../../../services/elaborations/besoinAjouteUtilisateurAPI";
import { setBesoinAjouteUtilisateurLoading, setBesoinAjouteUtilisateurs, setErrorPageBesoinAjouteUtilisateur } from "../../../_redux/features/elaborations/besoinAjouteUtilisateurSlice";
import Table from "../../../components/Tables/Elaboration/Besoin/TableBesoinAjouteUtilisateur/Table";
import FormCreateUpdate from "../../../components/Modals/Elaboration/BesoinFormation/ModalBesoinAjouteUtilisateur/FormCreateUpdate";
import FormDelete from "../../../components/Modals/Elaboration/BesoinFormation/ModalBesoinAjouteUtilisateur/FormDelete";

const BesoinAjouteUtilisateur = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { besoinAjouteUtilisateurs } } = useSelector((state: RootState) => state.besoinAjouteUtilisateurSlice);
    const user = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedBesoinAjouteUtilisateur, setSelectedBesoinAjouteUtilisateur] = useState<BesoinAjouteUtilisateur | null>(null);
    
    const { setHeaderConfig } = useHeader();

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_nouvelle_competence'),
            showAddButton: true,
            exportOptions: ['PDF', 'Excel'],
            onAdd: () => {setSelectedBesoinAjouteUtilisateur(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des besoinAjouteUtilisateur en ${format}`);
        // Implémentez ici la logique d'export
    };

    useEffect(() => {

        if(!user || user._id==="") return;
        fetchData({
            apiFunction: getBesoinsByUser,
            params: {
                page: currentPage,
                utilisateurId:user._id,
                lang,
            },
            onSuccess: (data) => {
                dispatch(setBesoinAjouteUtilisateurs(data || {
                    besoinAjouteUtilisateurs: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageBesoinAjouteUtilisateur(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setBesoinAjouteUtilisateurLoading(isLoading));
            },
        });
    }, [currentPage, lang, user?._id, dispatch]);


    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    
    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.nouvelle_competence')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.nouvelle_competence')} 
                breadcrumbItems={[{
                    isActive: false,
                    name: t('sub_menu.besoins_formation_exprimer'),
                    path: "/elaboration-programme/besoins-formation/exprimer"
                },{
                    isActive: true,
                    name: t('sub_menu.nouvelle_competence'),
                    path: "#"
                }]}
            />
            <Table
                data={besoinAjouteUtilisateurs}
                currentPage={currentPage}
                utilisateur={user}
                onPageChange={handlePageChange}
                onEdit={setSelectedBesoinAjouteUtilisateur} 
            />
            <FormCreateUpdate besoinAjouteUtilisateur={selectedBesoinAjouteUtilisateur} user={user} />
            <FormDelete besoinAjouteUtilisateur={selectedBesoinAjouteUtilisateur} />
        </>
    );
};

export default BesoinAjouteUtilisateur;
