import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useFetchData } from "../../hooks/fechDataOptions";
import { useHeader } from "../../components/Context/HeaderConfig";
import { setShowModal } from "../../_redux/features/setting";
import { setErrorPageTypeEchelleReponse, setTypeEchelleReponseLoading, setTypeEchelleReponses, setTypeEchelleReponseSelected } from "../../_redux/features/evaluations/typeEchelleResponseSlice";
import { getFilteredTypeEchelleReponses } from "../../services/evaluations/typeEchelleReponseAPI";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";
import Table from "../../components/Tables/Evaluation/TableTypeEchelleReponse/Table";
import FormCreateUpdate from "../../components/Modals/Evaluation/ModalTypeEchelleReponse/FormCreateUpdate";
import FormDelete from "../../components/Modals/Evaluation/ModalTypeEchelleReponse/FormDelete";


const TypeEchelleReponses = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { typeEchelleReponses } } = useSelector((state: RootState) => state.typeEchelleReponseSlice);
   

    const [currentPage, setCurrentPage] = useState<number>(1);
   
    const [selectedTypeEchelleReponse, setSelectedTypeEchelleReponse] = useState<TypeEchelleReponse | null>(null);
    

    const { setHeaderConfig } = useHeader();

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_type_echelle_reponse'),
            showAddButton: true,
            exportOptions: ['PDF', 'Excel'],
            onAdd: () => {setSelectedTypeEchelleReponse(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des typeEchelleReponses en ${format}`);
        // Implémentez ici la logique d'export
    };

    useEffect(()=>{
        dispatch(setTypeEchelleReponseSelected(undefined));
    },[])

   
    // Charge les typeEchelleReponses en fonction des filtres
    useEffect(() => {
        // Cas : filtre sur formation demandé explicitement mais formation = undefined
        // => on vide la liste sans appel API


        fetchData({
            apiFunction: getFilteredTypeEchelleReponses,
            params: {
                page: currentPage,
                lang,
            },
            onSuccess: (data) => {
                
                dispatch(setTypeEchelleReponses(data || {
                    typeEchelleReponses: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageTypeEchelleReponse(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setTypeEchelleReponseLoading(isLoading));
            },
        });
    }, [currentPage, lang, dispatch]);



    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

   
    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.type_echelle_reponse')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.types_echelles_reponses')} 
            />
            <Table
                data={typeEchelleReponses}
                
                currentPage={currentPage}
                onPageChange={handlePageChange}
                
                onEdit={setSelectedTypeEchelleReponse} 
            />
            <FormCreateUpdate typeEchelleReponse={selectedTypeEchelleReponse} />
            <FormDelete typeEchelleReponse={selectedTypeEchelleReponse} />
        </>
    );
};

export default TypeEchelleReponses;
