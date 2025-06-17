import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { setErrorPageFamilleMetier, setFamilleMetierLoading, setFamilleMetiers } from "../../_redux/features/familleMetierSlice";
import { getFamilleMetiers } from "../../services/familleMetierAPI";
import Table from "../../components/Tables/Elaboration/TableFamilleMetier/Table";
import FormCreateUpdate from "../../components/Modals/Elaboration/ModalFamilleMetier/FormCreateUpdate";
import FormDelete from "../../components/Modals/Elaboration/ModalFamilleMetier/FormDelete";




const FamilleMetiers = () => {
    const [selectedFamilleMetier, setSelectedFamilleMetier] = useState<FamilleMetier | null>(null);

    const { data: { familleMetiers } } = useSelector((state: RootState) => state.familleMetierSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);

   
    const {t}=useTranslation();
    
    
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchFamilleMetiers = async () => {
            dispatch(setFamilleMetierLoading(true));
            try {
                const fetchedFamilleMetiers = await getFamilleMetiers({ page: currentPage, lang });
                console.log(fetchedFamilleMetiers)
                if (fetchedFamilleMetiers) {
                    dispatch(setFamilleMetiers(fetchedFamilleMetiers));
                } else {
                    dispatch(setFamilleMetiers({
                        familleMetiers: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            } catch (error) {
                dispatch(setErrorPageFamilleMetier(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setFamilleMetierLoading(false));
            }
        };
        fetchFamilleMetiers();
    }, [currentPage, lang, dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.familles_metier')}/>
            <Table
                data={familleMetiers}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCreate={() => setSelectedFamilleMetier(null)}
                onEdit={setSelectedFamilleMetier}
            />

            <FormCreateUpdate familleMetier={selectedFamilleMetier} />
            <FormDelete familleMetier={selectedFamilleMetier} />

        </>
    );
};


export default FamilleMetiers;
