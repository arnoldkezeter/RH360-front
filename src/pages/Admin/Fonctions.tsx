import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableFonction/Table";
import FormCreateUpdate from "../../components/Modals/ModalFonction/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalFonction/FormDelete";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { setDataSetting, setErrorDataSetting, setLoadingDataSetting } from "../../_redux/features/data_setting_slice";
import { apiGetAllSettings } from "../../services/settings/api_data_setting";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { PageErreur } from "../../components/_Global/PageErreur";
import { PageNoData } from "../../components/_Global/PageNoData";
import { setShowModal } from "../../_redux/features/setting";
import Loading from "../../components/ui/loading";


const CategorieProfessionnelle = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const [selectedFonction, setSelectedFonction] = useState<CommonSettingProps | null>(null);
    const handleEditFonction = (fonction: CommonSettingProps) => {
        setSelectedFonction(fonction);
    }

    const handleCreate = () => {
        handleAddFonction();
        dispatch(setShowModal())
    }
    const handleAddFonction = () => {
        setSelectedFonction(null);
    }
    const fonctions = useSelector((state: RootState) => state.dataSetting.dataSetting.fonctions);

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
            <Breadcrumb pageName={t('sub_menu.fonctions')} />

            {
                pageIsLoading ?
                    <Loading /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        fonctions.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.fonction')}
                                titreBouton={t('ajouter_votre_premier.fonction')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />
                            : <Table
                                data={fonctions}
                                onCreate={handleAddFonction}
                                onEdit={handleEditFonction} />



            }

            <FormCreateUpdate fonction={selectedFonction} />
            <FormDelete fonction={selectedFonction} />

        </>
    );
};


export default CategorieProfessionnelle;
