import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";


import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../hooks/fechDataOptions";
import { RootState } from "../../_redux/store";
import { useHeader } from "../../components/Context/HeaderConfig";
import { setShowModal } from "../../_redux/features/setting";
import { getFilteredEchelleReponses } from "../../services/evaluations/echelleReponseAPI";
import { setEchelleReponseLoading, setEchelleReponses, setErrorPageEchelleReponse } from "../../_redux/features/evaluations/echelleReponseSlice";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";
import Table from "../../components/Tables/Evaluation/TableEchelleReponse/Table";
import FormCreateUpdate from "../../components/Modals/Evaluation/ModalEchelleReponse/FormCreateUpdate";
import FormDelete from "../../components/Modals/Evaluation/ModalEchelleReponse/FormDelete";

const EchelleReponses = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();
    const navigate = useNavigate()

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { echelleReponses } } = useSelector((state: RootState) => state.echelleReponseSlice);
    const selectedTypeEchelleReponse = useSelector((state: RootState) => state.typeEchelleReponseSlice.selectedTypeEchelleReponse);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedEchelleReponse, setSelectedEchelleReponse] = useState<EchelleReponse | null>(null);
    
    const { setHeaderConfig } = useHeader();

    useEffect(()=>{
        if(!selectedTypeEchelleReponse){
            navigate("/evaluations/type-echelle-reponse")
        }
    },[])

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_echelle_reponse'),
            showAddButton: true,
            exportOptions: ['PDF', 'Excel'],
            onAdd: () => {setSelectedEchelleReponse(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des echelleReponses en ${format}`);
        // Implémentez ici la logique d'export
    };

    useEffect(() => {

        if(!selectedTypeEchelleReponse) return;
        fetchData({
            apiFunction: getFilteredEchelleReponses,
            params: {
                page: currentPage,
                typeEchelleId:selectedTypeEchelleReponse?._id || "",
                lang,
            },
            onSuccess: (data) => {
                dispatch(setEchelleReponses(data || {
                    echelleReponses: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageEchelleReponse(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setEchelleReponseLoading(isLoading));
            },
        });
    }, [currentPage, lang, selectedTypeEchelleReponse?._id, dispatch]);


    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    
    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.echelle_reponse')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.echelles_reponses')} 
                breadcrumbItems={[{
                    isActive: false,
                    name: t('sub_menu.types_echelles_reponses'),
                    path: "/evaluations/type-echelle-reponse"
                },{
                    isActive: true,
                    name: t('sub_menu.echelles_reponses'),
                    path: "#"
                }]}
            />
            <Table
                data={echelleReponses}
                selectedTypeEchelleReponse={selectedTypeEchelleReponse}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onEdit={setSelectedEchelleReponse} 
            />
            <FormCreateUpdate echelleReponse={selectedEchelleReponse} typeEchelleId={selectedTypeEchelleReponse?._id || ""} />
            <FormDelete echelleReponse={selectedEchelleReponse} />
        </>
    );
};

export default EchelleReponses;
