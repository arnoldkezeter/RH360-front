import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";

import Table from "../../components/Tables/TableBesoinFormationPredefini/Table";
import FormCreateUpdate from "../../components/Modals/ModalBesoinFormationPredefini/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalBesoinFormationPredefini/FormDelete";
import { setBesoinFormationPredefiniLoading, setBesoinFormationPredefinis, setErrorPageBesoinFormationPredefini } from "../../_redux/features/settings/besoinFormationPredefini";
import { getBesoinFormationPredefinis } from "../../services/settings/besoinFormationPredefiniAPI";




const BesoinFormationPredefinis = () => {
    const [selectedBesoinFormationPredefini, setSelectedBesoinFormationPredefini] = useState<BesoinFormationPredefini | null>(null);

    const { data: { besoinFormationPredefinis } } = useSelector((state: RootState) => state.besoinFormationPredefiniSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);

   
    const {t}=useTranslation();
    
    
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchBesoinFormationPredefinis = async () => {
            dispatch(setBesoinFormationPredefiniLoading(true));
            try {
                const fetchedBesoinFormationPredefinis = await getBesoinFormationPredefinis({ page: currentPage, lang });
                if (fetchedBesoinFormationPredefinis) {
                    dispatch(setBesoinFormationPredefinis(fetchedBesoinFormationPredefinis));
                } else {
                    dispatch(setBesoinFormationPredefinis({
                        besoinFormationPredefinis: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            } catch (error) {
                dispatch(setErrorPageBesoinFormationPredefini(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setBesoinFormationPredefiniLoading(false));
            }
        };
        fetchBesoinFormationPredefinis();
    }, [currentPage, lang, dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.cree_besoin_formation')}/>
            <Table
                data={besoinFormationPredefinis}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCreate={() => setSelectedBesoinFormationPredefini(null)}
                onEdit={setSelectedBesoinFormationPredefini}
            />

            <FormCreateUpdate besoinFormationPredefini={selectedBesoinFormationPredefini} />
            <FormDelete besoinFormationPredefini={selectedBesoinFormationPredefini} />

        </>
    );
};


export default BesoinFormationPredefinis;
