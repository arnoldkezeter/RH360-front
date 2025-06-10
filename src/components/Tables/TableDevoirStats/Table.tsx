import { useDispatch, useSelector } from "react-redux";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { useEffect, useRef, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import { useTranslation } from "react-i18next";
import createToast from "../../../hooks/toastify";
import Pagination from "../../Pagination/Pagination";
import { setDevoirLoading } from "../../../_redux/features/devoir_slice";
import { setDevoirStats } from "../../../_redux/features/devoir_stats_slice";
import { apiSearchStudentStatsByName, generateDevoirStats, getDevoirStats } from "../../../services/api_devoir";
import Download from "../common/Download";
import CustomButtonDownload from "../common/CustomButtomDownload";
import { createPDF } from "../../../fonctions/fonction";

interface TableDevoirStatsProps {
    data : 
    {
        etudiant:UserState
        meilleureScore: number,
        nombreTentatives: number,
    }[];
    noteSur:number;
    totalQuestionPoints:number
   
}

const Table = ({ data, noteSur, totalQuestionPoints}: TableDevoirStatsProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const selectedDevoir = useSelector((state: RootState) => state.devoirSlice.selectedDevoir);

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const departements:CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.departementsAcademique) ?? [];
    
    const pageIsLoading = useSelector((state: RootState) => state.devoirStatsSlice.pageIsLoading);
    const [isDownload, setIsDownload]=useState(false);
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];

    // // Filtrer les niveaux de l'utilisateur enseignant
    // const niveauxEnseignant = niveaux.filter(niveau => niveau._id && niveauxEnseignantIds.includes(niveau._id));
    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
   
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState(false);
   
    const [formatToDownload, setFormatToDownload] = useState("");


    const handleDownloadSelect = async (selected: string) => {
        setFormatToDownload(selected);
        try{
            setIsDownload(true);
            let title =`statistiques_${selectedDevoir?.titreFr || ""}`.replace(" ","_")
            if (lang !== 'fr') {
                title = `statistics_${selectedDevoir?.titreEn || ""}`.replace(" ","_")
            }
            const niveau = selectedDevoir && niveaux.find(niv=>niv._id?.toString()===selectedDevoir.niveau.toString());
            const cycle = niveau && cycles.find(cy=>cy._id?.toString()===niveau.cycle.toString());
            const section = cycle && sections.find(sec=>sec._id?.toString() === cycle.section.toString());
            const departement=section && departements.find(dep=>dep._id && dep._id.toString()===section.departement.toString());
            if(section && cycle && niveau && departement){
                if(selected === 'PDF'){
                    if(selectedDevoir && selectedDevoir._id){
                        await generateDevoirStats({departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, fileType:'pdf', devoirId:selectedDevoir._id}).then((blob)=>{
                            // Créer un objet URL pour le blob PDF
                            if(blob){
                                createPDF(blob, title);
                            }
                        })
                    }  
                }else{
                    if(selectedDevoir && selectedDevoir._id){
                        await generateDevoirStats({departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang, fileType:'xlsx', devoirId:selectedDevoir._id}).then((blob)=>{
                            // Créer un objet URL pour le blob PDF
                            if(blob){
                                createPDF(blob, title, 'xlsx');
                            }
                        })
                    }
                }
            }else{
                alert(t("label.message_telecharger"));
            }
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        }finally {
            setIsDownload(false);
        }

    };



   
    // variable pour la pagination
    
    const itemsPerPage =  useSelector((state: RootState) => state.devoirSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.devoirSlice.data.totalItems);
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
    


    useEffect(() => {
    
        const fetchDevoirStats = async () => {
            dispatch(setDevoirLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyStats:DevoirStatsReturnGetType = {
                    devoir: {
                        _id: "",
                        titreFr: "",
                        titreEn: "",
                        noteSur: 0,
                        totalQuestionPoints:0,
                    },
                    nombreParticipants: 0,
                    nombreParticipantsSurEffectif:"",
                    meilleureNote: 0,
                    pireNote: 0,
                    noteMoyenne: 0,
                    etudiants: []
                }
                if(selectedDevoir && selectedDevoir._id){
                    const fetchedStats = await getDevoirStats({ devoirId: selectedDevoir._id});
                        
                    if (fetchedStats) { // Vérifiez si fetchedQuestions n'est pas faux, vide ou indéfini
                        dispatch(setDevoirStats(fetchedStats));
                    } else {
                        dispatch(setDevoirStats(emptyStats));
                    }
                }else {
                    dispatch(setDevoirStats(emptyStats));
                }
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setDevoirLoading(false));; // Définissez le loading à false après le chargement
            }
        }
        fetchDevoirStats();
    }, [dispatch, t]);

    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<StudentStats[]>(data);
    
    const latestQueryDevoir = useRef('');
    useEffect(() => {
        dispatch(setDevoirLoading(true));
        latestQueryDevoir.current = searchText;
        try{
            
            const filterStatsByContent = async () => {
                if (searchText === '') {
                    
                    
                    const result: StudentStats[] = data;
                    setFilteredData(result); 
                }else{
                    
                    let devoirsResult : StudentStats[] = [];
                    // if(hasManageHomeworkPermission || currentUser.role === roles.etudiant || currentUser.role === roles.delegue){
                        
                        await apiSearchStudentStatsByName({devoirId:selectedDevoir?._id, searchString:searchText}).then(result=>{
                            if (latestQueryDevoir.current === searchText) {
                                if(result){
                                    setFilteredData(result);
                                }else{
                                    setFilteredData(devoirsResult)
                                }
                            }
                            
                        })
                    // }
                    
                }                
            };
            filterStatsByContent();
        }catch(e){
            createToast(t('message.erreur'), "", 2)
        }finally{
            if (latestQueryDevoir.current === searchText) {
                dispatch(setDevoirLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, data]);



    return (
        <div>
             <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <InputSearch hintText={t('recherche.rechercher')+t('recherche.etudiant')} value={searchText} onSubmit={(text) =>{setIsSearch(true); setSearchText(text)}} />
            </div>
            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
           
                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : filteredData.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredData} noteSur={noteSur} totalQuestionPoints={totalQuestionPoints} />
                        }




                    </table>
                </div>

                {/* Pagination */}

                {/* {((searchText ==='') && (filteredData && filteredData.length>0)) && <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={handlePageClick}
                />} */}

            </div>

            {/* bouton downlod Download */}
            <div className="mt-7 mb-10">
                {isDownload?<Download/>:<CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />}
            </div>

        </div>
    );
};


export default Table;