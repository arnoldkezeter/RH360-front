import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { getTacheGeneriques } from "../../services/settings/tacheGeneriqueAPI";
import { useHeader } from "../../components/Context/HeaderConfig";
import { setErrorPageTacheGenerique, setTacheGeneriqueLoading, setTacheGeneriques } from "../../_redux/features/parametres/tacheGeneriqueSlice";
import Table from "../../components/Tables/Parametres/TableTacheGenerique/Table.tsx";
import FormCreateUpdate from "../../components/Modals/Parametres/ModalTacheGenerique/FormCreateUpdate.tsx";
import FormDelete from "../../components/Modals/Parametres/ModalTacheGenerique/FormDelete.tsx";




const TachesGeneriques = () => {
    const [selectedTacheGenerique, setSelectedTacheGenerique] = useState<TacheGenerique | null>(null);

    const { data: { tacheGeneriques } } = useSelector((state: RootState) => state.tacheGeneriqueSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);

   
    const {t}=useTranslation();
    const { setHeaderConfig } = useHeader();
    useEffect(() => {
        setHeaderConfig({
        title: undefined,
        showAddButton: false,
        exportOptions: [],
        importOptions: [],
        });
    }, []);
    
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchTacheGeneriques = async () => {
            dispatch(setTacheGeneriqueLoading(true));
            try {
                const fetchedTacheGeneriques = await getTacheGeneriques({ page: currentPage, lang });
                if (fetchedTacheGeneriques) {
                    dispatch(setTacheGeneriques(fetchedTacheGeneriques));
                } else {
                    dispatch(setTacheGeneriques({
                        tacheGeneriques: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            } catch (error) {
                dispatch(setErrorPageTacheGenerique(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setTacheGeneriqueLoading(false));
            }
        };
        fetchTacheGeneriques();
    }, [currentPage, lang, dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.taches_formations')}/>
            <Table
                data={tacheGeneriques}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCreate={() => setSelectedTacheGenerique(null)}
                onEdit={setSelectedTacheGenerique}
            />

            <FormCreateUpdate tacheGenerique={selectedTacheGenerique} />
            <FormDelete tacheGenerique={selectedTacheGenerique} />

        </>
    );
};


export default TachesGeneriques;
