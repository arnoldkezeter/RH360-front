import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import {getPosteDeTravailsByFamilleMetier } from "../../services/settings/posteDeTravailAPI";
import Table from "../../components/Tables/Parametres/TablePosteDeTravail/Table";
import FormCreateUpdate from "../../components/Modals/Parametres/ModalPosteDeTravail/FormCreateUpdate";
import FormDelete from "../../components/Modals/Parametres/ModalPosteDeTravail/FormDelete";
import { setPosteDeTravailLoading, setPosteDeTravails, setErrorPagePosteDeTravail } from "../../_redux/features/parametres/posteDeTravailSlice";
import { setErrorPageFamilleMetier, setFamilleMetierLoading, setFamilleMetiers } from "../../_redux/features/elaborations/familleMetierSlice";
import { getFamillesMetierForDropDown } from "../../services/elaborations/familleMetierAPI";
import { useHeader } from "../../components/Context/HeaderConfig";




const PosteDeTravails = () => {
    const [selectedPosteDeTravail, setSelectedPosteDeTravail] = useState<PosteDeTravail | null>(null);

    const { data: { posteDeTravails } } = useSelector((state: RootState) => state.posteDeTavailSlice);
    const { data: { familleMetiers } } = useSelector((state: RootState) => state.familleMetierSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentFamilleMetier, setCurrentFamilleMetier] = useState<FamilleMetier>(familleMetiers[0]);

   
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const { setHeaderConfig } = useHeader();
    useEffect(() => {
        setHeaderConfig({
        title: undefined,
        showAddButton: false,
        exportOptions: [],
        importOptions: [],
        });
    }, []);
   
    
    const fetchPosteDeTravails = async () => {
        if (!currentFamilleMetier || familleMetiers.length === 0) return;

        dispatch(setPosteDeTravailLoading(true));
        try {
            const fetchedPosteDeTravails = await getPosteDeTravailsByFamilleMetier({
                page: currentPage,
                familleMetierId: currentFamilleMetier._id || "",
                lang,
            });
            if (fetchedPosteDeTravails) {
                dispatch(setPosteDeTravails(fetchedPosteDeTravails));
            } else {
                dispatch(setPosteDeTravails({
                    posteDeTravails: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            }
        } catch (error) {
            dispatch(setErrorPagePosteDeTravail(t('message.erreur')));
            createToast(t('message.erreur'), "", 2);
        } finally {
            dispatch(setPosteDeTravailLoading(false));
        }
    };
    
    useEffect(() => {
        fetchPosteDeTravails();
    }, [currentPage, currentFamilleMetier, lang]);
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFamilleMetierChange = (FamilleMetier: FamilleMetier) => {
        setCurrentFamilleMetier(FamilleMetier);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.postes_de_travail')}/>
            <Table
                data={posteDeTravails}
                familleMetiers={familleMetiers}
                currentFamilleMetier={currentFamilleMetier}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onFamilleMetierChange={handleFamilleMetierChange}
                onCreate={() => setSelectedPosteDeTravail(null)}
                onEdit={setSelectedPosteDeTravail}
            />

            <FormCreateUpdate posteDeTravail={selectedPosteDeTravail} onDepartmentUpdated={fetchPosteDeTravails}/>
            <FormDelete posteDeTravail={selectedPosteDeTravail} />

        </>
    );
};


export default PosteDeTravails;
