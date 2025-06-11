import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { setErrorPageTaxe, setTaxeLoading, setTaxes } from "../../_redux/features/settings/taxeSlice";
import { getTaxes } from "../../services/settings/taxeAPI";
import Table from "../../components/Tables/TableTaxe/Table";
import FormCreateUpdate from "../../components/Modals/ModalTaxe/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalTaxe/FormDelete";




const Taxes = () => {
    const [selectedTaxe, setSelectedTaxe] = useState<Taxe | null>(null);

    const { data: { taxes } } = useSelector((state: RootState) => state.taxeSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);

   
    const {t}=useTranslation();
    
    
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchTaxes = async () => {
            dispatch(setTaxeLoading(true));
            try {
                const fetchedTaxes = await getTaxes({ page: currentPage, lang });
                if (fetchedTaxes) {
                    dispatch(setTaxes(fetchedTaxes));
                } else {
                    dispatch(setTaxes({
                        taxes: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            } catch (error) {
                dispatch(setErrorPageTaxe(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setTaxeLoading(false));
            }
        };
        fetchTaxes();
    }, [currentPage, lang, dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.taxes')}/>
            <Table
                data={taxes}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCreate={() => setSelectedTaxe(null)}
                onEdit={setSelectedTaxe}
            />

            <FormCreateUpdate taxe={selectedTaxe} />
            <FormDelete taxe={selectedTaxe} />

        </>
    );
};


export default Taxes;
