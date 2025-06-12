import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import HeaderPage from "../../components/HeaderPage";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";




const Utilisateurs = () => {
    const [selectedUtilisateur, setSelectedUtilisateur] = useState<Utilisateur | null>(null);

    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);   
    const {t}=useTranslation();    
    const dispatch = useDispatch();

    const { setHeaderConfig } = useHeader();

    // Fonctions spécifiques aux utilisateurs
    const handleAddUser = () => {
        console.log('Ajout d\'un nouvel utilisateur');
        // Logique d'ajout d'utilisateur
    };

    const handleExportUsers = (format: string) => {
        console.log(`Export des utilisateurs en ${format}`);
        // Logique d'export spécifique aux utilisateurs
        switch(format) {
        case 'CSV':
            // Export CSV des utilisateurs
            break;
        case 'Excel':
            // Export Excel des utilisateurs
            break;
        case 'PDF':
            // Export PDF des utilisateurs
            break;
        }
    };


    useEffect(() => {
        setHeaderConfig({
        title: 'Utilisations',
        showAddButton: true,
        exportOptions: ['PDF', 'Excel'],
        onAdd: handleAddUser,
        onExport: handleExportUsers,
        });

       
    }, []);

    
    return (
        <>
            <BreadcrumbPageDescription pageDescription={t('description.utilisateur')} titleColor="text-gray-900" pageName={t('sub_menu.utilisateurs')}/>
        </>
    );
};


export default Utilisateurs;
