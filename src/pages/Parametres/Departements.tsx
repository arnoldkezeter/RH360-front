import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { getDepartements, getDepartementsByRegion } from "../../services/settings/departementAPI";
import Table from "../../components/Tables/Parametres/TableDepartement/Table";
import FormCreateUpdate from "../../components/Modals/Parametres/ModalDepartement/FormCreateUpdate";
import FormDelete from "../../components/Modals/Parametres/ModalDepartement/FormDelete";
import { setErrorPageRegion, setRegionLoading, setRegions } from "../../_redux/features/parametres/regionSlice";
import { getRegions, getRegionsForDropDown } from "../../services/settings/regionAPI";
import { setDepartementLoading, setDepartements, setErrorPageDepartement } from "../../_redux/features/parametres/departementSlice";
import { useHeader } from "../../components/Context/HeaderConfig";




const Departements = () => {
    const [selectedDepartement, setSelectedDepartement] = useState<Departement | null>(null);

    const { data: { departements } } = useSelector((state: RootState) => state.departementSlice);
    const { data: { regions } } = useSelector((state: RootState) => state.regionSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentRegion, setCurrentRegion] = useState<Region>(regions[0]);

   
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
   
    
    const fetchDepartements = async () => {
        if (!currentRegion || regions.length === 0) return;

        dispatch(setDepartementLoading(true));
        try {
            const fetchedDepartements = await getDepartementsByRegion({
                page: currentPage,
                regionId: currentRegion._id || "",
                lang,
            });
            if (fetchedDepartements) {
                dispatch(setDepartements(fetchedDepartements));
            } else {
                dispatch(setDepartements({
                    departements: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            }
        } catch (error) {
            dispatch(setErrorPageDepartement(t('message.erreur')));
            createToast(t('message.erreur'), "", 2);
        } finally {
            dispatch(setDepartementLoading(false));
        }
    };
    
    useEffect(() => {
        fetchDepartements();
    }, [currentPage, currentRegion, lang]);
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRegionChange = (region: Region) => {
        setCurrentRegion(region);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.departements')}/>
            <Table
                data={departements}
                regions={regions}
                currentRegion={currentRegion}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onRegionChange={handleRegionChange}
                onCreate={() => setSelectedDepartement(null)}
                onEdit={setSelectedDepartement}
            />

            <FormCreateUpdate departement={selectedDepartement} onDepartmentUpdated={fetchDepartements}/>
            <FormDelete departement={selectedDepartement} />

        </>
    );
};


export default Departements;
