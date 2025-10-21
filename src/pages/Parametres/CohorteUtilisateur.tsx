import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { setErrorPageCohorteUtilisateur, setCohorteUtilisateurLoading, setCohorteUtilisateurs } from "../../_redux/features/parametres/cohorteUtilisateurSlice";
import Table from "../../components/Tables/Parametres/TableCohorteUtilisateur/Table";
import FormDelete from "../../components/Modals/Parametres/ModalCohorteUtilisateur/FormDelete";
import { useHeader } from "../../components/Context/HeaderConfig";
import { getUsersByCohorteByPage } from "../../services/settings/cohorteUtilisateurAPI";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";




const CohorteUtilisateurs = () => {
    const [selectedCohorteUtilisateur, setSelectedCohorteUtilisateur] = useState<CohorteUtilisateur | null>(null);

    const { data: { participants } } = useSelector((state: RootState) => state.cohorteUtilisateurSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [cohorteId, setCohorteId] = useState("");

   
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

    const params = new URLSearchParams(window.location.search);
    useEffect(() => {
        const id = params.get("cohorteId");
        if (id) setCohorteId(id);
    }, [lang, t]);
    
    useEffect(() => {
        const fetchCohorteUtilisateurs = async () => {
            dispatch(setCohorteUtilisateurLoading(true));
            try {
                if(cohorteId){
                    const fetchedCohorteUtilisateurs = await getUsersByCohorteByPage({cohorteId,lang, page:currentPage });
                    if (fetchedCohorteUtilisateurs) {
                        dispatch(setCohorteUtilisateurs(fetchedCohorteUtilisateurs));
                    } else {
                        dispatch(setCohorteUtilisateurs({
                            participants: [],
                            currentPage: 0,
                            totalItems: 0,
                            totalPages: 0,
                            pageSize: 0,
                        }));
                    }
                }
            } catch (error) {
                dispatch(setErrorPageCohorteUtilisateur(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setCohorteUtilisateurLoading(false));
            }
        };
        fetchCohorteUtilisateurs();
    }, [currentPage, lang, cohorteId, dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    
    return (
        <>
            
             <BreadcrumbPageDescription 
                pageDescription={t('page_description.cohorte_utilisateur')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.cohorte_utilisateur')} 
                breadcrumbItems={[{
                    isActive: false,
                    name: t('sub_menu.cohortes'),
                    path: "/parametres/cohortes"
                },{
                    isActive: true,
                    name: t('sub_menu.cohorte_utilisateur'),
                    path: "#"
                }]}
            />
            <Table
                data={participants}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                cohorteId={cohorteId}
                onEdit={setSelectedCohorteUtilisateur}
            />

            <FormDelete cohorteUtilisateur={selectedCohorteUtilisateur} />
        </>
    );
};


export default CohorteUtilisateurs;
