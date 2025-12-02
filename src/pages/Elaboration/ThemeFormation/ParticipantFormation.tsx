import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useHeader } from "../../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../../components/BreadcrumbPageDescription";

import { 
    setErrorPageUtilisateur, 
    setUtilisateurs, 
    setUtilisateursLoading 
} from "../../../_redux/features/utilisateurs/utilisateurSlice";
import { setShowModal } from "../../../_redux/features/setting";
import { useFetchData } from "../../../hooks/fechDataOptions";
import { getTargetedUsers, getThemeById } from "../../../services/elaborations/themeFormationAPI";
import { getQueryParam } from "../../../fonctions/fonction";
import Table from "../../../components/Tables/MesFormations/TableParticipant/Table";
import FormCreateUpdate from "../../../components/Modals/Elaboration/Formation/ModalThemeFormation/FormCreateUpdate";

const ParticipantsTheme = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { utilisateurs } } = useSelector((state: RootState) => state.utilisateurSlice);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedTheme, setSelectedTheme]=useState<ThemeFormation|null>(null)
    const themeId = getQueryParam("themeId");
    const { setHeaderConfig } = useHeader();

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_participants'),
            showAddButton: true,
            exportOptions: [],
            onAdd: () => {dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des utilisateurs en ${format}`);
        // Implémentez ici la logique d'export
    };

    useEffect(() => {
    
        fetchData({
            apiFunction: getThemeById,
            params: {
                themeId:themeId||"",
                lang,
            },
            onSuccess: (data) => {
               setSelectedTheme(data);
            },
            onError: () => {
                dispatch(setErrorPageUtilisateur(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setUtilisateursLoading(isLoading));
            },
        });
    }, [themeId, lang, dispatch, fetchData]);

    // Charge les utilisateurs en fonction des filtres
    useEffect(() => {
    
        if(selectedTheme){
            fetchData({
                apiFunction: getTargetedUsers,
                params: {
                    page: currentPage,
                    themeId:selectedTheme._id||"",
                    lang,
                },
                onSuccess: (data) => {
                    dispatch(setUtilisateurs(data || {
                        utilisateurs: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                },
                onError: () => {
                    dispatch(setErrorPageUtilisateur(t('message.erreur')));
                },
                onLoading: (isLoading) => {
                    dispatch(setUtilisateursLoading(isLoading));
                },
            });
        }
    }, [currentPage, selectedTheme?._id, lang, dispatch, fetchData]);



    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.participant_list')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.participant_list')} 
            />
            <Table
                data={utilisateurs}
                themeId={themeId||""}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
           <FormCreateUpdate themeFormation={selectedTheme} isParticipant={true} />
        </>
    );
};

export default ParticipantsTheme;
