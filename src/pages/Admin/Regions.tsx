import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableRegion/Table";
import FormCreateUpdate from "../../components/Modals/ModalRegion/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalRegion/FormDelete";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { setDataSetting, setErrorDataSetting, setLoadingDataSetting } from "../../_redux/features/data_setting_slice";
import { apiGetAllSettings } from "../../services/settings/api_data_setting";
import { PageNoData } from "../../components/_Global/PageNoData";
import { PageErreur } from "../../components/_Global/PageErreur";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { setShowModal } from "../../_redux/features/setting";
import Loading from "../../components/ui/loading";

const Regions = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [selectedRegion, setSelectedRegion] = useState<CommonSettingProps | null>(null);

    // data depuis le store de redux
    const regions = useSelector((state: RootState) => state.dataSetting.dataSetting.regions);

    const handleCreate = () => {
        handleAddRegion();
        dispatch(setShowModal())
    }
    const handleEditRegion = (region: CommonSettingProps) => { setSelectedRegion(region) }
    const handleAddRegion = () => { setSelectedRegion(null) }


    const pageIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const pageError = useSelector((state: RootState) => state.dataSetting.error);

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
            <Breadcrumb pageName={t('sub_menu.regions')} />
            {
                pageIsLoading ?
                    <Loading /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        regions.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.region')}
                                titreBouton={t('ajouter_votre_premier.region')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />

                            : <Table data={regions} onCreate={handleAddRegion} onEdit={handleEditRegion} />

            }

            <FormCreateUpdate region={selectedRegion} />
            <FormDelete region={selectedRegion} />

        </>
    );
};

export default Regions;
