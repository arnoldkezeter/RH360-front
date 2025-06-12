import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { getRegions } from "../../services/settings/regionAPI";
import FormCreateUpdate from "../../components/Modals/ModalRegion/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalRegion/FormDelete";
import { setErrorPageRegion, setRegionLoading, setRegions } from "../../_redux/features/settings/regionSlice";
import Table from "../../components/Tables/TableRegion/Table";




const Regions = () => {
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

    const { data: { regions } } = useSelector((state: RootState) => state.regionSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);

   
    const {t}=useTranslation();
    
    
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchRegions = async () => {
            dispatch(setRegionLoading(true));
            try {
                const fetchedRegions = await getRegions({ page: currentPage, lang });
                if (fetchedRegions) {
                    dispatch(setRegions(fetchedRegions));
                } else {
                    dispatch(setRegions({
                        regions: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            } catch (error) {
                dispatch(setErrorPageRegion(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setRegionLoading(false));
            }
        };
        fetchRegions();
    }, [currentPage, lang, dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.regions')}/>
            <Table
                data={regions}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCreate={() => setSelectedRegion(null)}
                onEdit={setSelectedRegion}
            />

            <FormCreateUpdate region={selectedRegion} />
            <FormDelete region={selectedRegion} />

        </>
    );
};


export default Regions;
