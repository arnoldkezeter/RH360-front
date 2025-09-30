import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useHeader } from "../../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../../_redux/features/setting";
import { useFetchData } from "../../../hooks/fechDataOptions";
import FormDelete from "../../../components/Modals/Elaboration/Formation/ModalBudgetFormation/FormDelete";
import FormCreateUpdate from "../../../components/Modals/Elaboration/Formation/ModalBudgetFormation/FormCreateUpdate";
import { getFilteredBudgetFormations } from "../../../services/elaborations/budgetFormationAPI";
import { setErrorPageBudgetFormation, setBudgetFormationLoading, setBudgetFormations } from "../../../_redux/features/elaborations/budgetFormationSlice";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Tables/Elaboration/Formation/TableBudgetFormation/Table";

const BudgetFormations = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();
    const navigate = useNavigate()

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { budgetFormations } } = useSelector((state: RootState) => state.budgetFormationSlice);
    const selectedFormation = useSelector((state: RootState) => state.formationSlice.selectedFormation);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedBudgetFormation, setSelectedBudgetFormation] = useState<BudgetFormation | null>(null);
    
    const { setHeaderConfig } = useHeader();

    useEffect(()=>{
        if(!selectedFormation){
            navigate("/elaboration-programme/formations")
        }
    },[])

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_budget_theme'),
            showAddButton: true,
            exportOptions: [],
            onAdd: () => {setSelectedBudgetFormation(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des budgetFormations en ${format}`);
        // Implémentez ici la logique d'export
    };

    useEffect(() => {

        if(!selectedFormation) return;
        fetchData({
            apiFunction: getFilteredBudgetFormations,
            params: {
                page: currentPage,
                formationId:selectedFormation?._id || "",
                lang,
            },
            onSuccess: (data) => {
                dispatch(setBudgetFormations(data || {
                    budgetFormations: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageBudgetFormation(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setBudgetFormationLoading(isLoading));
            },
        });
    }, [currentPage, lang, selectedFormation?._id, dispatch]);


    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    
    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.budget_formation')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.budgets_formation')} 
                breadcrumbItems={[{
                    isActive: false,
                    name: t('sub_menu.formations'),
                    path: "/elaboration-programme/formations"
                },{
                    isActive: true,
                    name: t('sub_menu.budgets_formation'),
                    path: "#"
                }]}
            />
            <Table
                data={budgetFormations}
                selectedFormation={selectedFormation}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onEdit={setSelectedBudgetFormation} 
            />
            <FormCreateUpdate budgetFormation={selectedBudgetFormation} formation={selectedFormation} />
            <FormDelete budgetFormation={selectedBudgetFormation} />
        </>
    );
};

export default BudgetFormations;
