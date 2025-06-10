import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalCategorie/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCategorie/FormDelete";
import Table from "../../components/Tables/TableCategorie/Table";
// import { Categorie } from "./Categories";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { PageErreur } from "../../components/_Global/PageErreur";
import { PageNoData } from "../../components/_Global/PageNoData";
import { setDataSetting, setErrorDataSetting, setLoadingDataSetting } from "../../_redux/features/data_setting_slice";
import { apiGetAllSettings } from "../../services/settings/api_data_setting";
import { setShowModal } from "../../_redux/features/setting";
import Loading from "../../components/ui/loading";

export interface Categorie {
    id?: number;
    code: string;
    libelle: string;
    categorie: Categorie;
}
const Categories = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const categories = useSelector((state: RootState) => state.dataSetting.dataSetting.categories);

    const [selectedCategorie, setSelectedCategorie] = useState<CategorieProps | null>(null);

    const handleCreate = () => {
        handleAddCategorie();
        dispatch(setShowModal())
    }
    const handleEditCategorie = (categorie: CategorieProps) => { setSelectedCategorie(categorie) }
    const handleAddCategorie = () => { setSelectedCategorie(null) }

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
            <Breadcrumb pageName={t('sub_menu.categories')} />

            {
                pageIsLoading ?
                    <Loading /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        categories.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.categorie')}
                                titreBouton={t('ajouter_votre_premier.categorie')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />

                            : <Table
                                data={categories}
                                onCreate={handleAddCategorie}
                                onEdit={handleEditCategorie} />

            }
            <FormCreateUpdate categorie={selectedCategorie} />
            <FormDelete categorie={selectedCategorie} />

        </>
    );
};

export default Categories;

