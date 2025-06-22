import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useHeader } from "../../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../../_redux/features/setting";
import { useFetchData } from "../../../hooks/fechDataOptions";
import FormDelete from "../../../components/Modals/Elaboration/Formation/ModalFormateur/FormDelete";
import FormCreateUpdate from "../../../components/Modals/Elaboration/Formation/ModalFormateur/FormCreateUpdate";
import Table from "../../../components/Tables/Elaboration/ThemeFormation/TableFormateur/Table";
import { getFilteredFormateurs } from "../../../services/elaborations/formateurAPI";
import { setErrorPageFormateur, setFormateurLoading, setFormateurs } from "../../../_redux/features/elaborations/formateurSlice";
import { useNavigate } from "react-router-dom";

const Formateurs = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();
    const navigate = useNavigate()

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { formateurs } } = useSelector((state: RootState) => state.formateurSlice);
    const selectedTheme = useSelector((state: RootState) => state.themeFormationSlice.selectedTheme);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedFormateur, setSelectedFormateur] = useState<Formateur | null>(null);
    
    const { setHeaderConfig } = useHeader();

    useEffect(()=>{
        if(!selectedTheme){
            navigate("/elaboration-programme/formation/themes-formation")
        }
    },[])

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_formateur'),
            showAddButton: true,
            exportOptions: ['PDF', 'Excel'],
            onAdd: () => {setSelectedFormateur(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des formateurs en ${format}`);
        // Implémentez ici la logique d'export
    };

    useEffect(() => {

        if(!selectedTheme) return;
        fetchData({
            apiFunction: getFilteredFormateurs,
            params: {
                page: currentPage,
                themeId:selectedTheme?._id || "",
                lang,
            },
            onSuccess: (data) => {
                dispatch(setFormateurs(data || {
                    formateurs: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageFormateur(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setFormateurLoading(isLoading));
            },
        });
    }, [currentPage, lang, selectedTheme?._id, dispatch]);


    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    
    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.formateur')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.formateurs')} 
                breadcrumbItems={[{
                    isActive: false,
                    name: t('sub_menu.themes_formations'),
                    path: "/elaboration-programme/formation/themes-formation"
                },{
                    isActive: true,
                    name: t('sub_menu.formateurs'),
                    path: "#"
                }]}
            />
            <Table
                data={formateurs}
                selectedTheme={selectedTheme}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onEdit={setSelectedFormateur} 
            />
            <FormCreateUpdate formateur={selectedFormateur} themeId={selectedTheme?._id || ""} />
            <FormDelete formateur={selectedFormateur} themeId={selectedTheme?._id || ""} />
        </>
    );
};

export default Formateurs;
