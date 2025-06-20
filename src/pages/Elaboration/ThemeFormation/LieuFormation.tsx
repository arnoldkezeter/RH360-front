import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useHeader } from "../../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../../_redux/features/setting";
import { useFetchData } from "../../../hooks/fechDataOptions";
import FormDelete from "../../../components/Modals/Elaboration/Formation/ModalLieuFormation/FormDelete";
import FormCreateUpdate from "../../../components/Modals/Elaboration/Formation/ModalLieuFormation/FormCreateUpdate";
import Table from "../../../components/Tables/Elaboration/ThemeFormation/TableLieuFormation/Table";
import { getFilteredLieuFormations } from "../../../services/elaborations/lieuFormationAPI";
import { setErrorPageLieuFormation, setLieuFormationLoading, setLieuFormations } from "../../../_redux/features/elaborations/lieuFormationSlice";
import { useNavigate } from "react-router-dom";

const LieuFormations = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();
    const navigate = useNavigate()

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { lieuFormations } } = useSelector((state: RootState) => state.lieuFormationSlice);
    const selectedTheme = useSelector((state: RootState) => state.themeFormationSlice.selectedTheme);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedLieuFormation, setSelectedLieuFormation] = useState<LieuFormation | null>(null);
    
    const { setHeaderConfig } = useHeader();

    useEffect(()=>{
        if(!selectedTheme){
            navigate("/elaboration-programme/formation/themes-formation")
        }
    },[])

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_lieu_formation'),
            showAddButton: true,
            exportOptions: ['PDF', 'Excel'],
            onAdd: () => {setSelectedLieuFormation(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des lieuFormations en ${format}`);
        // Implémentez ici la logique d'export
    };

    useEffect(() => {

        if(!selectedTheme) return;
        fetchData({
            apiFunction: getFilteredLieuFormations,
            params: {
                page: currentPage,
                themeId:selectedTheme?._id || "",
                lang,
            },
            onSuccess: (data) => {
                dispatch(setLieuFormations(data || {
                    lieuFormations: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageLieuFormation(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setLieuFormationLoading(isLoading));
            },
        });
    }, [currentPage, lang, selectedTheme?._id, dispatch]);


    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    
    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.lieu_formation')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.lieux_formation')} 
                breadcrumbItems={[{
                    isActive: false,
                    name: t('sub_menu.themes_formations'),
                    path: "/elaboration-programme/formation/themes-formation"
                },{
                    isActive: true,
                    name: t('sub_menu.lieux_formation'),
                    path: "#"
                }]}
            />
            <Table
                data={lieuFormations}
                selectedTheme={selectedTheme}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onEdit={setSelectedLieuFormation} 
            />
            <FormCreateUpdate lieuFormation={selectedLieuFormation} themeId={selectedTheme?._id || ""} />
            <FormDelete lieuFormation={selectedLieuFormation} themeId={selectedTheme?._id || ""} />
        </>
    );
};

export default LieuFormations;
