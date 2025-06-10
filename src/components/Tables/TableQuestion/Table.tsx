import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useRef, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { setQuestionLoading, setQuestions, setErrorPageQuestion } from "../../../_redux/features/question_slice";
import { apiSearchQuestion, obtenirQuestionsDevoirAvecPagination } from "../../../services/api_question";
import createToast from "../../../hooks/toastify";
import Pagination from "../../Pagination/Pagination";

interface TableQuestionProps {
    data: QuestionType[];
    onCreate:()=>void;
    onEdit: (question:QuestionType) => void;
}


const Table = ({ data, onCreate, onEdit}: TableQuestionProps) => {
    const {t}=useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.questionSlice.pageIsLoading);
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageQuestionPermission = userPermissions.includes('gerer_questions');


    const dispatch = useDispatch();

    
    // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.questionSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.questionSlice.data.totalItems);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    
    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Render page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);

    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);
    
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const selectedDevoir = useSelector((state: RootState) => state.devoirSlice.selectedDevoir);
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(false);

    useEffect(() => {

        const fetchQuestions = async () => {
            dispatch(setQuestionLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyQuestions: QuestionReturnGetType = {
                    questions: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                if(selectedDevoir && selectedDevoir._id){
                    const fetchedQuestions = await obtenirQuestionsDevoirAvecPagination({ devoirId: selectedDevoir._id, page: currentPage});
                        
                    if (fetchedQuestions) { // Vérifiez si fetchedQuestions n'est pas faux, vide ou indéfini
                        dispatch(setQuestions(fetchedQuestions));
                    } else {
                        dispatch(setQuestions(emptyQuestions));
                    }
                }else {
                    dispatch(setQuestions(emptyQuestions));
                }
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageQuestion(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setQuestionLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        fetchQuestions();
    }, [dispatch, selectedDevoir, currentPage, t]); // Déclencher l'effet lorsque currentPage change
    const [filteredData, setFilteredData] = useState<QuestionType[]>(data);
   
    useEffect(() => {
        if(searchText!==''){
             setIsSearch(true);
        }else{
             setIsSearch(false);
        }
     }, [searchText]);

    const latestQueryQuestion = useRef('');
    useEffect(() => {
        dispatch(setQuestionLoading(true));
        latestQueryQuestion.current = searchText;
        try{
            
            const filterQuestionByContent = async () => {
                if (searchText === '') {
                    const result: QuestionType[] = data;
                    setFilteredData(result); 
                }else{
                    let questionsResult : QuestionType[] = [];
                    if(selectedDevoir && selectedDevoir._id){
                        await apiSearchQuestion({ searchString:searchText, limit:10, langue:lang, devoirId:selectedDevoir?._id}).then(result=>{
                            if (latestQueryQuestion.current === searchText) {
                                if(result){
                                    questionsResult = result.questions;
                                    setFilteredData(questionsResult);
                                }
                            }
                            
                        })
                    }else{
                        const result: QuestionType[] = data;
                        setFilteredData(result); 
                    }
                }
        
                
            };
            filterQuestionByContent();
        }catch(e){
            dispatch(setErrorPageQuestion(t('message.erreur')));
        }finally{
            if (latestQueryQuestion.current === searchText) {
                dispatch(setQuestionLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, data]);


    
    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {(hasManageQuestionPermission) && <ButtonCreate
                    title={t('boutton.nouveau_question')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />}
                <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.question'))} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                
                {selectedDevoir && (<div>
                    {lang === 'fr' ? selectedDevoir.titreFr : selectedDevoir.titreEn}
                </div>)}
                
                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : filteredData?.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit}/>
                        }




                    </table>
                </div>

                {/* Pagination */}

                { searchText==='' && filteredData && filteredData.length>0 && <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={handlePageClick}
                />}


            </div>

            {/* bouton downlod Download */}
            {/* <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};


export default Table;