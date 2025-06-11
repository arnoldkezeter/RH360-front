import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { setErrorPageAxeStrategique, setAxeStrategiqueLoading, setAxeStrategiques } from "../../_redux/features/axeStrategiqueSlice";
import { getAxeStrategiques } from "../../services/axeStrategiqueAPI";
import Table from "../../components/Tables/TableAxeStrategique/Table";
import FormCreateUpdate from "../../components/Modals/ModalAxeStrategique/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalAxeStrategique/FormDelete";




const AxeStrategiques = () => {
    const [selectedAxeStrategique, setSelectedAxeStrategique] = useState<AxeStrategique | null>(null);

    const { data: { axeStrategiques } } = useSelector((state: RootState) => state.axeStrategiqueSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);

   
    const {t}=useTranslation();
    
    
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAxeStrategiques = async () => {
            dispatch(setAxeStrategiqueLoading(true));
            try {
                const fetchedAxeStrategiques = await getAxeStrategiques({ page: currentPage, lang });
                if (fetchedAxeStrategiques) {
                    dispatch(setAxeStrategiques(fetchedAxeStrategiques));
                } else {
                    dispatch(setAxeStrategiques({
                        axeStrategiques: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            } catch (error) {
                dispatch(setErrorPageAxeStrategique(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setAxeStrategiqueLoading(false));
            }
        };
        fetchAxeStrategiques();
    }, [currentPage, lang, dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.axes_strategique')}/>
            <Table
                data={axeStrategiques}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCreate={() => setSelectedAxeStrategique(null)}
                onEdit={setSelectedAxeStrategique}
            />

            <FormCreateUpdate axeStrategique={selectedAxeStrategique} />
            <FormDelete axeStrategique={selectedAxeStrategique} />

        </>
    );
};


export default AxeStrategiques;
