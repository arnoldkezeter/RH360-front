import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import {getCommunesByDepartement } from "../../services/settings/communeAPI";
import FormCreateUpdate from "../../components/Modals/Parametres/ModalCommune/FormCreateUpdate";
import FormDelete from "../../components/Modals/Parametres/ModalCommune/FormDelete";
import { setErrorPageRegion, setRegionLoading, setRegions } from "../../_redux/features/parametres/regionSlice";
import { getRegionsForDropDown } from "../../services/settings/regionAPI";
import { setCommuneLoading, setCommunes, setErrorPageCommune } from "../../_redux/features/parametres/communeSlice";
import { setDepartementLoading, setDepartements, setErrorPageDepartement } from "../../_redux/features/parametres/departementSlice";
import { getDepartementsForDropDown } from "../../services/settings/departementAPI";
import Table from "../../components/Tables/Parametres/TableCommune/Table";
import { useHeader } from "../../components/Context/HeaderConfig";




const Communes = () => {
    const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);

    const { data: { communes } } = useSelector((state: RootState) => state.communeSlice);
    const { data: { regions } } = useSelector((state: RootState) => state.regionSlice);
    const { data: { departements } } = useSelector((state: RootState) => state.departementSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentRegion, setCurrentRegion] = useState<Region>(regions[0]);
    const [currentDepartement, setCurrentDepartement] = useState<Departement>(departements[0]);


   
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
   
    useEffect(() => {
        const fetchDepartements = async () => {
            if (!currentRegion || regions.length === 0) return;

            dispatch(setDepartementLoading(true));
            try {
                const fetchedDepartements = await getDepartementsForDropDown({
                    regionId: currentRegion?._id || "",
                    lang,
                });
                if (fetchedDepartements) {
                    dispatch(setDepartements(fetchedDepartements));
                    setCurrentDepartement(fetchedDepartements.departements[0] || null);
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
                dispatch(setErrorPageDepartement(t("message.erreur")));
                createToast(t("message.erreur"), "", 2);
            } finally {
                dispatch(setDepartementLoading(false));
            }
        };

        fetchDepartements();
    }, [currentRegion, lang, dispatch, t]);

    
    const fetchCommunes = async () => {
        if (!currentDepartement || departements.length === 0) return;

        dispatch(setCommuneLoading(true));
        try {
            const fetchedCommunes = await getCommunesByDepartement({
                page: currentPage,
                departementId: currentDepartement._id || "",
                lang,
            });
            if (fetchedCommunes) {
                dispatch(setCommunes(fetchedCommunes));
            } else {
                dispatch(setCommunes({
                    communes: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            }
        } catch (error) {
            dispatch(setErrorPageCommune(t('message.erreur')));
            createToast(t('message.erreur'), "", 2);
        } finally {
            dispatch(setCommuneLoading(false));
        }
    };
    
    useEffect(() => {
        fetchCommunes();
    }, [currentPage, currentDepartement, lang]);
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRegionChange = (region: Region) => {
        setCurrentRegion(region);
    };

    const handleDepartementChange = (departement: Departement) => {
        setCurrentDepartement(departement);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.communes')}/>
            <Table
                data={communes}
                regions={regions}
                departements={departements}
                currentRegion={currentRegion}
                currentDepartement={currentDepartement}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onRegionChange={handleRegionChange}
                onDepartementChange={handleDepartementChange}
                onCreate={() => setSelectedCommune(null)}
                onEdit={setSelectedCommune}
            />

            <FormCreateUpdate commune={selectedCommune} onCommuneUpdated={fetchCommunes}/>
            <FormDelete commune={selectedCommune} />

        </>
    );
};


export default Communes;
