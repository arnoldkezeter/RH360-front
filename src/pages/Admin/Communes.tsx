import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalCommune/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCommune/FormDelete";
import Table from "../../components/Tables/TableCommune/Table";
// import { Commune } from "./Communes";
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

export interface Commune {
    id?: number;
    code: string;
    libelle: string;
    commune: Commune;
}
const Communes = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const communes = useSelector((state: RootState) => state.dataSetting.dataSetting.communes);

    const [selectedCommune, setSelectedCommune] = useState<CommuneProps | null>(null);

    const handleCreate = () => {
        handleAddCommune();
        dispatch(setShowModal())
    }
    const handleEditCommune = (commune: CommuneProps) => { setSelectedCommune(commune) }
    const handleAddCommune = () => { setSelectedCommune(null) }

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
            <Breadcrumb pageName={t('sub_menu.communes')} />

            {
                pageIsLoading ?
                    <Loading /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        communes.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.commune')}
                                titreBouton={t('ajouter_votre_premier.commune')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />

                            : <Table
                                data={communes}
                                onCreate={handleAddCommune}
                                onEdit={handleEditCommune} />

            }
            <FormCreateUpdate commune={selectedCommune} />
            <FormDelete commune={selectedCommune} />

        </>
    );
};

export default Communes;

