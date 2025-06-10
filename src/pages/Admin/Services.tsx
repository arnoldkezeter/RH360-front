import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableService/Table";
import FormCreateUpdate from "../../components/Modals/ModalService/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalService/FormDelete";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { PageErreur } from "../../components/_Global/PageErreur";
import { PageNoData } from "../../components/_Global/PageNoData";
import { setDataSetting, setErrorDataSetting, setLoadingDataSetting } from "../../_redux/features/data_setting_slice";
import { apiGetAllSettings } from "../../api/settings/api_data_setting";
import { setShowModal } from "../../_redux/features/setting";
import Loading from "../../components/ui/loading";


const Services = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [selectedService, setSelectedService] = useState<CommonSettingProps | null>(null);
    


    const handleEditService = (service: CommonSettingProps) => {
        setSelectedService(service);
    }



    const handleAddService = () => {
        setSelectedService(null);
    }
    const services = useSelector((state: RootState) => state.dataSetting.dataSetting.services);

    const pageIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const pageError = useSelector((state: RootState) => state.dataSetting.error);

    const handleCreate = () => {
        handleAddService();
        dispatch(setShowModal())
    }
    const handleRefresh = async () => {
        dispatch(setLoadingDataSetting(true));
        try {
            const settingsData = await apiGetAllSettings();
            dispatch(setDataSetting(settingsData));
            dispatch(setErrorDataSetting(null))

        } catch (error) { dispatch(setErrorDataSetting('une erreur est survenue')) }
        finally { dispatch(setLoadingDataSetting(false)); }
    }

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.services')} />
            {
                pageIsLoading ?
                    <Loading /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        services.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.service')}
                                titreBouton={t('ajouter_votre_premier.service')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />
                            : <Table
                                data={services}
                                onCreate={handleAddService}
                                onEdit={handleEditService} />
            }

            <FormCreateUpdate service={selectedService} />
            <FormDelete service={selectedService} />

        </>
    );
};

export default Services;