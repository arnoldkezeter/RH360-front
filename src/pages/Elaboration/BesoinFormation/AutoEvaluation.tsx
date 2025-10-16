import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useHeader } from "../../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../../_redux/features/setting";
import { useFetchData } from "../../../hooks/fechDataOptions";
import { getBesoinsPredefinisAvecAutoEvaluation } from "../../../services/elaborations/autoEvaluationBesoinAPI";
import { setAutoEvaluationBesoinLoading, setAutoEvaluationBesoins, setErrorPageAutoEvaluationBesoin } from "../../../_redux/features/elaborations/autoEvaluationBesoinSlice";
import Table from "../../../components/Tables/Elaboration/Besoin/TableAutoEvaluationBesoin/Table";
import FormCreateUpdate from "../../../components/Modals/Elaboration/BesoinFormation/ModalBesoinFormation/FormCreateUpdate";
import FormDelete from "../../../components/Modals/Elaboration/BesoinFormation/ModalBesoinFormation/FormDelete";
import { useNavigate } from "react-router-dom";


const AutoEvaluationBesoins = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();

    const lang = useSelector((state: RootState) => state.setting.language);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { data: { autoEvaluationBesoins } } = useSelector((state: RootState) => state.autoEvalualtionBesoinSlice);
    const [selectedAutoEvaluationBesoin, setSelectedAutoEvaluationBesoin] = useState<AutoEvaluationBesoin | null>(null);
    const user = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
    const navigate = useNavigate()
    const { setHeaderConfig } = useHeader();

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title:t('button.nouvelles_competences'),
            showAddButton: true,
            exportOptions: [],
            onAdd: () => {navigate('/elaboration-programme/besoins-formation/exprimer/nouvelle-competence')},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des autoevaluationbesoins en ${format}`);
        // Implémentez ici la logique d'export
    };


    const handlePageChange = (page: number) => setCurrentPage(page);
    // Charge les autoevaluationbesoins en fonction des filtres
    useEffect(() => {
        // Cas : filtre sur service demandé explicitement mais service = undefined
        
       
        if(!user || user._id==="") return;
        fetchData({
            
            apiFunction: getBesoinsPredefinisAvecAutoEvaluation,
            params: {
                page: currentPage,
                lang,
                userId:user._id
            },
            onSuccess: (data) => {
                dispatch(setAutoEvaluationBesoins(data || {
                    autoEvaluationBesoins: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageAutoEvaluationBesoin(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setAutoEvaluationBesoinLoading(isLoading));
            },
        });
    }, [currentPage, user, lang, dispatch]);



    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.auto_evaluation_besoin')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.besoins_formation_exprimer')} 
            />
            <Table
                data={autoEvaluationBesoins}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                user={user}
                onEdit={setSelectedAutoEvaluationBesoin}             
            />
            <FormCreateUpdate autoEvaluation={selectedAutoEvaluationBesoin} user={user}/>
            <FormDelete autoEvaluation={selectedAutoEvaluationBesoin}/>
            
        </>
    );
};

export default AutoEvaluationBesoins;
