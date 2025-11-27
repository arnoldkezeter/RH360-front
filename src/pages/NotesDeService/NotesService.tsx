import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";
import { setShowModal } from "../../_redux/features/setting";
import { useFetchData } from "../../hooks/fechDataOptions";
import Table from "../../components/Tables/NoteService/TableNoteService/Table";
import { setErrorPageNoteService, setNoteServiceLoading, setNoteServices } from "../../_redux/features/notes/noteServiceSlice";
import { getFilteredNoteServices } from "../../services/notes/noteServiceAPI";
import FormDelete from "../../components/Modals/Notes/ModalNoteService/FormDelete";
import FormUploadFile from "../../components/Modals/Notes/ModalNoteService/FormUploadFile";

const NoteServices = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();

    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { noteServices } } = useSelector((state: RootState) => state.noteServiceSlice);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedNoteService, setSelectedNoteService] = useState<NoteService | null>(null);

    const { setHeaderConfig } = useHeader();

    // Configure le header
    useEffect(() => {
        setHeaderConfig({
            title: t('button.ajouter_utilisateur'),
            showAddButton: true,
            exportOptions: [],
            onAdd: () => {setSelectedNoteService(null);dispatch(setShowModal())},
            onExport: handleExportUsers,
        });
    }, [t]);

    const handleExportUsers = (format: string) => {
        console.log(`Export des utilisateurs en ${format}`);
        // Implémentez ici la logique d'export
    };
   

    // Charge les utilisateurs en fonction des filtres
    useEffect(() => {
        fetchData({
            apiFunction: getFilteredNoteServices,
            params: {
                page: currentPage,
                lang,
            },
            onSuccess: (data) => {
                dispatch(setNoteServices(data || {
                    noteServices: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageNoteService(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setNoteServiceLoading(isLoading));
            },
        });
    }, [currentPage, lang, dispatch]);



    // Handlers pour les filtres
    const handlePageChange = (page: number) => setCurrentPage(page);

   
    return (
        <>
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.noteService')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.historique_note')} 
            />
            <Table
                data={noteServices}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onEdit={setSelectedNoteService} 
            />
            <FormUploadFile note={selectedNoteService} />
            <FormDelete noteService={selectedNoteService} /> 
        </>
    );
};

export default NoteServices;
