import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";

import { setErrorPageFamilleMetier, setFamilleMetierLoading, setFamilleMetiers } from "../../_redux/features/familleMetierSlice";
import { getFamillesMetierForDropDown } from "../../services/familleMetierAPI";
import { setCompetenceLoading, setCompetences, setErrorPageCompetence } from "../../_redux/features/competenceSlice";
import { getCompetencesByFamilleMetier } from "../../services/competenceAPI";
import Table from "../../components/Tables/TableCompetence/Table";
import FormCreateUpdate from "../../components/Modals/ModalCompetence/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCompetence/FormDelete";




const Competences = () => {
    const [selectedCompetence, setSelectedCompetence] = useState<Competence | null>(null);

    const { data: { competences } } = useSelector((state: RootState) => state.competenceSlice);
    const { data: { familleMetiers } } = useSelector((state: RootState) => state.familleMetierSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentFamilleMetier, setCurrentFamilleMetier] = useState<FamilleMetier>(familleMetiers[0]);

   
    const {t}=useTranslation();
    const dispatch = useDispatch();
   
    useEffect(() => {
        const fetchFamilleMetiers = async () => {
            dispatch(setFamilleMetierLoading(true));
            try {
                const fetchedFamilleMetiers = await getFamillesMetierForDropDown({ lang });
                if (fetchedFamilleMetiers) {
                    dispatch(setFamilleMetiers(fetchedFamilleMetiers));
                    // Initialiser la région courante avec la première région récupérée
                    setCurrentFamilleMetier(fetchedFamilleMetiers.familleMetiers[0] || null);
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
    }, [lang, dispatch, t]);

    
    const fetchCompetences = async () => {
        if (!currentFamilleMetier || familleMetiers.length === 0) return;

        dispatch(setCompetenceLoading(true));
        try {
            const fetchedCompetences = await getCompetencesByFamilleMetier({
                page: currentPage,
                familleMetierId: currentFamilleMetier._id || "",
                lang,
            });
            if (fetchedCompetences) {
                dispatch(setCompetences(fetchedCompetences));
            } else {
                dispatch(setCompetences({
                    competences: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            }
        } catch (error) {
            dispatch(setErrorPageCompetence(t('message.erreur')));
            createToast(t('message.erreur'), "", 2);
        } finally {
            dispatch(setCompetenceLoading(false));
        }
    };
    
    useEffect(() => {
        fetchCompetences();
    }, [currentPage, currentFamilleMetier, lang]);
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFamilleMetierChange = (FamilleMetier: FamilleMetier) => {
        setCurrentFamilleMetier(FamilleMetier);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.competences')}/>
            <Table
                data={competences}
                familleMetiers={familleMetiers}
                currentFamilleMetier={currentFamilleMetier}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onFamilleMetierChange={handleFamilleMetierChange}
                onCreate={() => setSelectedCompetence(null)}
                onEdit={setSelectedCompetence}
            />

            <FormCreateUpdate competence={selectedCompetence} onCompetenceUpdated={fetchCompetences}/>
            <FormDelete competence={selectedCompetence} />

        </>
    );
};


export default Competences;
