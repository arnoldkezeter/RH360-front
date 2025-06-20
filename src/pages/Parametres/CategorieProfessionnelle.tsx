import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import {getCategorieProfessionnellesByGrade } from "../../services/settings/categorieProfessionnelleAPI";
import Table from "../../components/Tables/Parametres/TableCategorieProfessionnelle/Table";
import FormCreateUpdate from "../../components/Modals/Parametres/ModalCategorieProfessionnelle/FormCreateUpdate";
import FormDelete from "../../components/Modals/Parametres/ModalCategorieProfessionnelle/FormDelete";
import { setErrorPageGrade, setGradeLoading, setGrades } from "../../_redux/features/parametres/gradeSlice";
import {  getGradesForDropDown } from "../../services/settings/gradeAPI";
import { setCategorieProfessionnelleLoading, setCategorieProfessionnelles, setErrorPageCategorieProfessionnelle } from "../../_redux/features/parametres/categorieProfessionnelleSlice";
import { useHeader } from "../../components/Context/HeaderConfig";




const CategorieProfessionnelles = () => {
    const [selectedCategorieProfessionnelle, setSelectedCategorieProfessionnelle] = useState<CategorieProfessionnelle | null>(null);

    const { data: { categorieProfessionnelles } } = useSelector((state: RootState) => state.categorieProfessionnelleSlice);
    const { data: { grades } } = useSelector((state: RootState) => state.gradeSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentGrade, setCurrentGrade] = useState<Grade>(grades[0]);

   
    const {t}=useTranslation();
    const dispatch = useDispatch();

    const { setHeaderConfig } = useHeader();
    useEffect(() => {
        setHeaderConfig({
        title: undefined,
        showAddButton: false,
        exportOptions: [],
        importOptions: [],
        });
    }, []);
   
    
    const fetchCategorieProfessionnelles = async () => {
        if (!currentGrade || grades.length === 0) return;

        dispatch(setCategorieProfessionnelleLoading(true));
        try {
            const fetchedCategorieProfessionnelles = await getCategorieProfessionnellesByGrade({
                page: currentPage,
                gradeId: currentGrade._id || "",
                lang,
            });
            if (fetchedCategorieProfessionnelles) {
                dispatch(setCategorieProfessionnelles(fetchedCategorieProfessionnelles));
            } else {
                dispatch(setCategorieProfessionnelles({
                    categorieProfessionnelles: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            }
        } catch (error) {
            dispatch(setErrorPageCategorieProfessionnelle(t('message.erreur')));
            createToast(t('message.erreur'), "", 2);
        } finally {
            dispatch(setCategorieProfessionnelleLoading(false));
        }
    };
    
    useEffect(() => {
        fetchCategorieProfessionnelles();
    }, [currentPage, currentGrade, lang]);
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleGradeChange = (grade: Grade) => {
        setCurrentGrade(grade);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.categories_professionnelles')}/>
            <Table
                data={categorieProfessionnelles}
                grades={grades}
                currentGrade={currentGrade}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onGradeChange={handleGradeChange}
                onCreate={() => setSelectedCategorieProfessionnelle(null)}
                onEdit={setSelectedCategorieProfessionnelle}
            />

            <FormCreateUpdate categorieProfessionnelle={selectedCategorieProfessionnelle} onDepartmentUpdated={fetchCategorieProfessionnelles}/>
            <FormDelete categorieProfessionnelle={selectedCategorieProfessionnelle} />

        </>
    );
};


export default CategorieProfessionnelles;
