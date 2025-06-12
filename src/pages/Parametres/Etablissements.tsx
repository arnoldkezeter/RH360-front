import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { getEtablissements } from "../../services/settings/etablissementAPI";
import FormCreateUpdate from "../../components/Modals/ModalEtablissement/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalEtablissement/FormDelete";
import { setErrorPageEtablissement, setEtablissementLoading, setEtablissements } from "../../_redux/features/settings/etablissementSlice";
import Table from "../../components/Tables/TableEtablissement/Table";




const Etablissements = () => {
    const [selectedEtablissement, setSelectedEtablissement] = useState<Etablissement | null>(null);

    const { data: { etablissements } } = useSelector((state: RootState) => state.etablissementSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);

   
    const {t}=useTranslation();
    
    
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchEtablissements = async () => {
            dispatch(setEtablissementLoading(true));
            try {
                const fetchedEtablissements = await getEtablissements({ page: currentPage, lang });
                if (fetchedEtablissements) {
                    dispatch(setEtablissements(fetchedEtablissements));
                } else {
                    dispatch(setEtablissements({
                        etablissements: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            } catch (error) {
                dispatch(setErrorPageEtablissement(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setEtablissementLoading(false));
            }
        };
        fetchEtablissements();
    }, [currentPage, lang, dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.etablissements')}/>
            <Table
                data={etablissements}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCreate={() => setSelectedEtablissement(null)}
                onEdit={setSelectedEtablissement}
            />

            <FormCreateUpdate etablissement={selectedEtablissement} />
            <FormDelete etablissement={selectedEtablissement} />

        </>
    );
};


export default Etablissements;
