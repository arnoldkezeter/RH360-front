import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { RootState } from "../../../_redux/store";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import Pagination from "../../Pagination/Pagination";
import { setEvenementLoading, setEvenements, setErrorPageEvenement } from "../../../_redux/features/evenement_slice";
import { apiSearchEvenement, generateListEvent, getEvenementsByYear } from "../../../services/api_evenement";
import createToast from "../../../hooks/toastify";
import { createPDF, extractYear, formatYear, generateYearRange } from "../../../fonctions/fonction";
import { PageErreur } from "../../_Global/PageErreur";
import Download from "../common/Download";


interface TableEvenementProps {
    data: EvenementType[];
    onCreate: () => void;
    onEdit: (evenement: EvenementType) => void;
    refresh: () => void;
}


const Table = ({ data, onCreate, onEdit, refresh }: TableEvenementProps) => {
    const { t } = useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.evenementSlice.pageIsLoading);
    const [isDownload, setIsDownload]=useState(false);
    const pageError = useSelector((state: RootState) => state.evenementSlice.pageError);
    const dispatch = useDispatch();
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023;
    const promotions = useSelector((state: RootState) => state.dataSetting.dataSetting.promotions) ?? [];
    const [promotion, setPromotion] = useState<PromotionProps | undefined>();
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageCalendarPermission = userPermissions.includes('gerer_calendrier_academique');
    

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [selectedYear, setSelectedYear] = useState<number>(currentYear); // contient la valeur qui a ete selectionner sur le bouton filtre annee

    const handleAnneeSelect = (selected: String | undefined) => {
        // setFiltreAnnee(selected);
        if (selected) {
            setSelectedYear(extractYear(selected.toString()));
        }
    };

    const handlePromotionSelect = (selected: PromotionProps | undefined) => {
        if (selected?._id) {
            setPromotion(selected);
            setSearchText('');
        }
    };
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    // Filtrer les évènement en fonction de la langue
   
    
    const handleDownloadSelect = async (selected: string) => {
        // setFormatToDownload(selected);
        
        try {
            let title = "calendrier_académique_"+formatYear(selectedYear);
            if(lang !== 'fr'){
                title = "academic_calendar_"+formatYear(selectedYear);
            }
            setIsDownload(true);
            if(selected === 'PDF'){
                await generateListEvent({annee:selectedYear, langue:lang, fileType:'pdf'}).then((blob)=>{
                    // Créer un objet URL pour le blob PDF
                    if(blob){
                        createPDF(blob, title);
                    }
                })
                
            }else{
                await generateListEvent({annee:selectedYear, langue:lang, fileType:'xlsx'}).then((blob)=>{
                    // Créer un objet URL pour le blob PDF
                    if(blob){
                        createPDF(blob, title, 'xlsx');
                    }
                })
            }
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        }finally {
            setIsDownload(false);
        }
        
        
        // methode pour download
    };

    
    
   
      


    // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.evenementSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.evenementSlice.data.totalItems);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    
    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Render page numbers
    const pageNumbers :number[]= [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);

    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);
    
    // Fonction pour récupérer les événements en fonction de l'année et de la page actuelle
    const fetchEvenements = async (annee: number, page: number) => {
        dispatch(setEvenementLoading(true)); // Définissez le loading à true avant le chargement
        try {
            const emptyCalendrier:EvenementReturnGetType={
                evenements: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0
            }
            if(promotion && promotion._id){
                const fetchedEvenements = await getEvenementsByYear({ annee: annee, promotion:promotion?._id, page: page });
                // Mettez à jour l'état Redux avec les données récupérées
                dispatch(setEvenements(fetchedEvenements));
    
                dispatch(setErrorPageEvenement(null)); // Réinitialisez les erreurs s'il y en a
            }else{
                dispatch(setEvenements(emptyCalendrier));
            }
           
        } catch (error) {
            dispatch(setErrorPageEvenement(t('message.erreur')));
            createToast(t('message.erreur'), "", 2)
        } finally {
            dispatch(setEvenementLoading(false)); // Définissez le loading à false après le chargement
        }
    };
    

    // Effet pour récupérer les événements initiaux lorsque le composant est monté ou lorsque la page change
    useEffect(() => {
        const annee = selectedYear; // Remplacez par l'année souhaitée
        fetchEvenements(annee, currentPage);
    }, [currentPage, selectedYear, promotion]); // Déclencher l'effet lorsque currentPage change

    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<EvenementType[]>(data);


    // useEffect(() => {
    //     const result = filterEventByContent(data);
    //     setFilteredData(result);
    // }, [searchText, data]);

    useEffect(() => {
        if(searchText!==''){
             setIsSearch(true);
        }else{
             setIsSearch(false);
        }
     }, [searchText]);
     useEffect(() => {
        // if(searchText===''){
            if(promotions && promotions.length>0){
                setPromotion(promotions[0]);
            }
        // }
     }, []);

    const latestQueryEvenement = useRef('');
    useEffect(() => {
        dispatch(setEvenementLoading(true));
        latestQueryEvenement.current = searchText;
        try{
            
            const filterEvenementByContent = async () => {
                if (searchText === '') {
                    if(isSearch){
                        if(promotions && promotions.length>0){
                            setPromotion(promotions[0]);
                        }
                    }
                    const result: EvenementType[] = data;
                    setFilteredData(result); 
                }else{
                    setPromotion(undefined);
                    let evenementsResult : EvenementType[] = [];
                    await apiSearchEvenement({ searchString:searchText, limit:10, langue:lang, annee:selectedYear }).then(result=>{
                        if (latestQueryEvenement.current === searchText) {
                            if(result){
                                evenementsResult = result.evenements;
                                setFilteredData(evenementsResult);
                            }
                        }
                        
                    })
                    
                }
        
                
            };
            filterEvenementByContent();
        }catch(e){
            dispatch(setErrorPageEvenement(t('message.erreur')));
        }finally{
            if (latestQueryEvenement.current === searchText) {
                dispatch(setEvenementLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, data]);
    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {(hasManageCalendarPermission) && (<ButtonCreate
                    title={t('boutton.nouvel_evenement')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />)}
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.evenement')} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.evenement')}</h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear, firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut

                                onSelect={handleAnneeSelect}
                            />

                            <CustomDropDown2<PromotionProps>
                                title={t('label.promotion')}
                                selectedItem={promotion}
                                items={promotions}
                                defaultValue={promotion} // ou spécifie une valeur par défaut
                                displayProperty={(promotion: PromotionProps) => `${lang === 'fr' ? promotion.libelleFr : promotion.libelleEn}`}
                                onSelect={handlePromotionSelect}
                            />
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear, firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut

                                onSelect={handleAnneeSelect}
                            />

                            <CustomDropDown2<PromotionProps>
                                title={t('label.promotion')}
                                selectedItem={promotion}
                                items={promotions}
                                defaultValue={promotion} // ou spécifie une valeur par défaut
                                displayProperty={(promotion: PromotionProps) => `${lang === 'fr' ? promotion.libelleFr : promotion.libelleEn}`}
                                onSelect={handlePromotionSelect}
                            />
                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : pageError ?
                                    <PageErreur onRefresh={refresh} />

                                    : filteredData.length === 0 ?
                                        <NoDataTable /> :
                                        <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit} />
                        }




                    </table>
                </div>

                {/* Pagination */}

                {searchText==='' && filteredData && filteredData.length>0 &&<Pagination
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
            <div className="mt-7 mb-10">
                {isDownload?<Download/>:<CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />}
            </div>

        </div>
    );
};


export default Table;

