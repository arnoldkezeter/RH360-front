import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import Table from "../../components/Tables/Parametres/TableService/Table";
import FormCreateUpdate from "../../components/Modals/Parametres/ModalService/FormCreateUpdate";
import FormDelete from "../../components/Modals/Parametres/ModalService/FormDelete";

import { setServiceLoading, setServices, setErrorPageService } from "../../_redux/features/parametres/serviceSlice";
import { setErrorPageStructure, setStructureLoading, setStructures } from "../../_redux/features/parametres/strucutureSlice";
import { getStructuresForDropDown } from "../../services/settings/structureAPI";
import { getServicesBystructure } from "../../services/settings/serviceAPI";
import { useHeader } from "../../components/Context/HeaderConfig";




const Services = () => {
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const { data: { services } } = useSelector((state: RootState) => state.serviceSlice);
    const { data: { structures } } = useSelector((state: RootState) => state.structureSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentStructure, setCurrentStructure] = useState<Structure>(
        structures && structures.length > 0 ? structures[0] : {nomFr:"", nomEn: ""}
    );

   
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
   
    
    const fetchServices = async () => {
        if (!currentStructure || structures.length === 0) return;

        dispatch(setServiceLoading(true));
        try {
            const fetchedServices = await getServicesBystructure({
                page: currentPage,
                structureId: currentStructure._id || "",
                lang,
            });
            if (fetchedServices) {
                dispatch(setServices(fetchedServices));
            } else {
                dispatch(setServices({
                    services: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            }
        } catch (error) {
            dispatch(setErrorPageService(t('message.erreur')));
            createToast(t('message.erreur'), "", 2);
        } finally {
            dispatch(setServiceLoading(false));
        }
    };
    
    useEffect(() => {
        fetchServices();
    }, [currentPage, currentStructure, lang]);
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleStructureChange = (structure: Structure) => {
        setCurrentStructure(structure);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.services')}/>
            <Table
                data={services}
                structures={structures}
                currentStructure={currentStructure}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onStructureChange={handleStructureChange}
                onCreate={() => setSelectedService(null)}
                onEdit={setSelectedService}
            />

            <FormCreateUpdate service={selectedService} onDepartmentUpdated={fetchServices}/>
            <FormDelete service={selectedService} />

        </>
    );
};


export default Services;
