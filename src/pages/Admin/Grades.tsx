import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableGrade/Table";
import FormCreateUpdate from "../../components/Modals/ModalGrade/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalGrade/FormDelete";
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

export interface Grade {
    id?: number;
    code: string;
    libelle: string;
}

const Grades = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const [selectedGrade, setSelectedGrade] = useState<CommonSettingProps | null>(null);
    const handleEditGrade = (grade: CommonSettingProps | null) => {
        setSelectedGrade(grade);
    }
    const handleCreate = () => {
        handleAddGrade();
        dispatch(setShowModal())
    }

    const handleAddGrade = () => {
        setSelectedGrade(null);
    }
    const grades = useSelector((state: RootState) => state.dataSetting.dataSetting.grades);


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
            <Breadcrumb pageName={t('sub_menu.grades')} />

            {
                pageIsLoading ?
                    <Loading /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        grades.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.grade')}
                                titreBouton={t('ajouter_votre_premier.grade')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />
                            : <Table data={grades} onCreate={handleAddGrade} onEdit={handleEditGrade} />



            }

            <FormCreateUpdate grade={selectedGrade} />
            <FormDelete grade={selectedGrade} />

        </>
    );
};

export default Grades;
