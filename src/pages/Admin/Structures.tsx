import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { setErrorPageStructure, setStructureLoading, setStructures } from "../../_redux/features/strucutureSlice";
import { getStructures } from "../../services/settings/structureAPI";
import Table from "../../components/Tables/TableStructure/Table";
import FormCreateUpdate from "../../components/Modals/ModalStructure/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalStructure/FormDelete";




const Structures = () => {
    const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null);

    const { data: { structures } } = useSelector((state: RootState) => state.structureSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);

   
    const {t}=useTranslation();
    
    
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchStructures = async () => {
            dispatch(setStructureLoading(true));
            try {
                const fetchedStructures = await getStructures({ page: currentPage, lang });
                if (fetchedStructures) {
                    dispatch(setStructures(fetchedStructures));
                } else {
                    dispatch(setStructures({
                        structures: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            } catch (error) {
                dispatch(setErrorPageStructure(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setStructureLoading(false));
            }
        };
        fetchStructures();
    }, [currentPage, lang, dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.structures')}/>
            <Table
                data={structures}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCreate={() => setSelectedStructure(null)}
                onEdit={setSelectedStructure}
            />

            <FormCreateUpdate structure={selectedStructure} />
            <FormDelete structure={selectedStructure} />

        </>
    );
};


export default Structures;
