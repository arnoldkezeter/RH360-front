import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { setErrorPageCohorte, setCohorteLoading, setCohortes } from "../../_redux/features/parametres/cohorteSlice";
import Table from "../../components/Tables/Parametres/TableCohorte/Table";
import FormCreateUpdate from "../../components/Modals/Parametres/ModalCohorte/FormCreateUpdate";
import FormDelete from "../../components/Modals/Parametres/ModalCohorte/FormDelete";
import { useHeader } from "../../components/Context/HeaderConfig";
import { getCohortes } from "../../services/settings/cohorteAPI";
import CohorteUserManager from "./CohorteUserManager";
import { setShowModalUserCohorte } from "../../_redux/features/setting";




const Cohortes = () => {
    const [selectedCohorte, setSelectedCohorte] = useState<Cohorte | null>(null);

    const { data: { cohortes } } = useSelector((state: RootState) => state.cohorteSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

   
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
        const fetchCohortes = async () => {
            dispatch(setCohorteLoading(true));
            try {
                const fetchedCohortes = await getCohortes({ page: currentPage, lang });
                if (fetchedCohortes) {
                    dispatch(setCohortes(fetchedCohortes));
                } else {
                    dispatch(setCohortes({
                        cohortes: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            } catch (error) {
                dispatch(setErrorPageCohorte(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setCohorteLoading(false));
            }
        };
        fetchCohortes();
    }, [currentPage, lang, dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleOpenUserCohorteManage=()=>{
        console.log("open")
        dispatch(setShowModalUserCohorte())
    }
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.cohortes')}/>
            <Table
                data={cohortes}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCreate={() => setSelectedCohorte(null)}
                onEdit={setSelectedCohorte}
                openUserCohorteManage={handleOpenUserCohorteManage}
            />

            <FormCreateUpdate cohorte={selectedCohorte} />
            <FormDelete cohorte={selectedCohorte} />
            {selectedCohorte && selectedCohorte._id && (
                <CohorteUserManager
                    cohorteId={selectedCohorte._id}
                />
            )}

        </>
    );
};


export default Cohortes;
