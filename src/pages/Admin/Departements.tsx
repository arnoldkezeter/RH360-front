import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableDepartement/Table";
import FormCreateUpdate from "../../components/Modals/ModalDepartement/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalDepartement/FormDelete";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { setDataSetting, setErrorDataSetting, setLoadingDataSetting } from "../../_redux/features/data_setting_slice.tsx";
import { apiGetAllSettings } from "../../services/settings/api_data_setting.tsx";
import { PageNoData } from "../../components/_Global/PageNoData";
import { PageErreur } from "../../components/_Global/PageErreur";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { setShowModal } from "../../_redux/features/setting";
import Loading from "../../components/ui/loading";


export const Departements = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const departements = useSelector((state: RootState) => state.dataSetting.dataSetting.departements);

    const [selectedDepartement, setSelectedDepartement] = useState<DepartementProps | null>(null);

    const handleCreate = () => {
        handleAddDepartement();
        dispatch(setShowModal())
    }

    const handleEditDepartement = (departement: DepartementProps) => { setSelectedDepartement(departement) }
    const handleAddDepartement = () => { setSelectedDepartement(null) }


    // LOADING AND ERROR
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
            <Breadcrumb pageName={t('sub_menu.departements')} />

            {
                pageIsLoading ?
                    <Loading /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        departements.length === 0 ?
                        <PageNoData
                            titrePage={t('aucun.departement')}
                            titreBouton={t('ajouter_votre_premier.departement')}
                            showModalCreate={handleCreate}
                            refreshFunction={handleRefresh} />
                        : <Table
                            data={departements}
                            onCreate={handleAddDepartement}
                            onEdit={handleEditDepartement} />

            }
            <FormCreateUpdate departement={selectedDepartement} />
            <FormDelete departement={selectedDepartement} />

        </>
    );
};


