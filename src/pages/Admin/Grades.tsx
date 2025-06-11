import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { getGrades } from "../../services/settings/gradeAPI";
import FormCreateUpdate from "../../components/Modals/ModalGrade/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalGrade/FormDelete";
import { setErrorPageGrade, setGradeLoading, setGrades } from "../../_redux/features/settings/gradeSlice";
import Table from "../../components/Tables/TableGrade/Table";




const Grades = () => {
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

    const { data: { grades } } = useSelector((state: RootState) => state.gradeSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);

   
    const {t}=useTranslation();
    
    
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchGrades = async () => {
            dispatch(setGradeLoading(true));
            try {
                const fetchedGrades = await getGrades({ page: currentPage, lang });
                if (fetchedGrades) {
                    dispatch(setGrades(fetchedGrades));
                } else {
                    dispatch(setGrades({
                        grades: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            } catch (error) {
                dispatch(setErrorPageGrade(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setGradeLoading(false));
            }
        };
        fetchGrades();
    }, [currentPage, lang, dispatch, t]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.grades')}/>
            <Table
                data={grades}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCreate={() => setSelectedGrade(null)}
                onEdit={setSelectedGrade}
            />

            <FormCreateUpdate grade={selectedGrade} />
            <FormDelete grade={selectedGrade} />

        </>
    );
};


export default Grades;
