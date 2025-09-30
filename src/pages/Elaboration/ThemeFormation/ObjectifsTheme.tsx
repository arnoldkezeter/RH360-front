import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useHeader } from "../../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../../_redux/features/setting";
import { useFetchData } from "../../../hooks/fechDataOptions";
import FormDelete from "../../../components/Modals/Elaboration/Formation/ModalObjectifTheme/FormDelete";
import FormCreateUpdate from "../../../components/Modals/Elaboration/Formation/ModalObjectifTheme/FormCreateUpdate";
import Table from "../../../components/Tables/Elaboration/ThemeFormation/TableObjectifTheme/Table";
import { getFilteredObjectifThemes } from "../../../services/elaborations/objectifThemeAPI";
import { setErrorPageObjectifTheme, setObjectifThemeLoading, setObjectifThemes } from "../../../_redux/features/elaborations/objectifThemeSlice";
import { useNavigate } from "react-router-dom";

const ObjectifThemes = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();
    const navigate = useNavigate()

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { objectifThemes } } = useSelector((state: RootState) => state.objectifThemeSlice);
    const selectedTheme = useSelector((state: RootState) => state.themeFormationSlice.selectedTheme);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedObjectifTheme, setSelectedObjectifTheme] = useState<ObjectifTheme | null>(null);
    
    const { setHeaderConfig } = useHeader();

    useEffect(()=>{
        if(!selectedTheme){
            navigate("/elaboration-programme/formation/themes-formation")
        }
    },[])

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_objectif_theme'),
            showAddButton: true,
            exportOptions: [],
            onAdd: () => {setSelectedObjectifTheme(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des objectifThemes en ${format}`);
        // Implémentez ici la logique d'export
    };

    useEffect(() => {

        if(!selectedTheme) return;
        fetchData({
            apiFunction: getFilteredObjectifThemes,
            params: {
                page: currentPage,
                themeId:selectedTheme?._id || "",
                lang,
            },
            onSuccess: (data) => {
                dispatch(setObjectifThemes(data || {
                    objectifThemes: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageObjectifTheme(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setObjectifThemeLoading(isLoading));
            },
        });
    }, [currentPage, lang, selectedTheme?._id, dispatch]);


    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    
    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.objectif_theme')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.objectifs_theme')} 
                breadcrumbItems={[{
                    isActive: false,
                    name: t('sub_menu.themes_formations'),
                    path: "/elaboration-programme/formation/themes-formation"
                },{
                    isActive: true,
                    name: t('sub_menu.objectifs_theme'),
                    path: "#"
                }]}
            />
            <Table
                data={objectifThemes}
                selectedTheme={selectedTheme}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onEdit={setSelectedObjectifTheme} 
            />
            <FormCreateUpdate objectifTheme={selectedObjectifTheme} themeId={selectedTheme?._id || ""} />
            <FormDelete objectifTheme={selectedObjectifTheme} themeId={selectedTheme?._id || ""} />
        </>
    );
};

export default ObjectifThemes;
