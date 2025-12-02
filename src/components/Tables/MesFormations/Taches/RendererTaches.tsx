import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../_redux/store";
import { useEffect, useRef, useState } from "react";
import { setErrorPageTacheThemeFormation, setTacheThemeFormationLoading } from "../../../../_redux/features/elaborations/tacheThemeFormationSlice";
import { getFilteredTacheThemeFormations } from "../../../../services/elaborations/tacheThemeFormationAPI";
import Pagination from "../../../Pagination/Pagination";
import CustomDropDown2 from "../../../DropDown/CustomDropDown2";
import InputSearch from "../../common/SearchTable";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { ProgressBar } from "../../../ui/Progress";
import TacheCard from "../../../ui/TacheExecute/TaskCard";
import { TYPE_TACHE } from "../../../../config";
import Skeleton from "react-loading-skeleton";
import { NoData } from "../../../NoData";
import { useNavigate } from "react-router-dom";




interface RendererTacheExecuteeProps {
    data: TacheThemeFormation[];
    themeId?:string|null;
    etats:EtatTache[];
    niveaux:NiveauExecution[];
    currentPage: number;
    currentEtat?:EtatTache; 
    currentNiveau?:NiveauExecution; 
    progressionExecuter:number;
    progressionEnAttente:number;
    onPageChange: (page: number) => void;
    onEtatTacheChange:(tache:EtatTache)=>void;
    onNiveauChange:(niveau:NiveauExecution)=>void;
    onEdit: (tacheThemeFormation : TacheThemeFormation) => void;
}

const RendererTacheExecutee = ({ data,themeId, etats,niveaux, progressionExecuter, progressionEnAttente, currentPage, currentEtat, currentNiveau, onPageChange, onEtatTacheChange,onNiveauChange, onEdit}: RendererTacheExecuteeProps) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const typeTaches = Object.values(TYPE_TACHE);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const pageIsLoading = useSelector((state: RootState) => state.tacheThemeFormationSlice.pageIsLoading);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    }; 
   
    
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState(false);

    
   

    const handleEtatSelect = (selected: EtatTache | undefined) => {
        if (selected) {
            onEtatTacheChange(selected);  
        }
    };

    const handleNiveauSelect = (selected: NiveauExecution | undefined) => {
        if (selected) {
            onNiveauChange(selected);  
        }
    };

  

    const handleOpenChat = (tache: TacheThemeFormation) => {
        console.log(`Ouverture du chat pour la tâche : ${tache.tache.nomFr} avec l'ID d'entité : ${tache.tache._id}`);
        // Ici, vous pouvez rediriger l'utilisateur vers la page de chat
        // en passant l'ID de la tâche comme paramètre d'URL.
        navigate(`/chat?tacheId=${tache.tache._id}&entityType=TacheExecutee`);
    };

   
    

     // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.tacheThemeFormationSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.tacheThemeFormationSlice.data.totalItems);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    // Render page numbers
    const pageNumbers :number[]= [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);

    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);
    

    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<TacheThemeFormation[]>(data);
   
    const latestQueryTacheThemeFormation = useRef('');
    useEffect(() => {
        dispatch(setTacheThemeFormationLoading(true));
        latestQueryTacheThemeFormation.current = searchText;
        
        try{
            
            const filterTacheThemeFormationByContent = async () => {
                if (searchText === '') {                        
                    const result: TacheThemeFormation[] = data;
                    setFilteredData(result); 
                        
                }else{
                    let tacheThemeFormationsResult : TacheThemeFormation[] = [];
                    
                    await getFilteredTacheThemeFormations({page:1, search:searchText, lang, themeId:themeId}).then(result=>{
                        if (latestQueryTacheThemeFormation.current === searchText) {
                            if(result){
                                tacheThemeFormationsResult = result.tachesThemeFormation;
                                setFilteredData(tacheThemeFormationsResult);
                            }
                            }
                        
                    })
                }
        
                
            };
            
            filterTacheThemeFormationByContent();
        }catch(e){
            dispatch(setErrorPageTacheThemeFormation(t('message.erreur')));
        }finally{
            if (latestQueryTacheThemeFormation.current === searchText) {
                dispatch(setTacheThemeFormationLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, isSearch, data]);

    
    return (
        <div>
            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-2">
                <div className="block md:hidden mb-4 mt-3">
                    <button
                    onClick={toggleFilters}
                    className="w-full flex items-center justify-between p-4 bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg transition-colors duration-200"
                    >
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-[#2563EB]" />
                        <span className="font-medium text-[#1E40AF]">
                        {t('filtre.filtrer')}
                        </span>
                    </div>
                    {isFiltersVisible ? (
                        <ChevronUp className="w-5 h-5 text-[#2563EB]" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-[#2563EB]" />
                    )}
                    </button>
                </div>

                {/* Conteneur des filtres */}
                <div className={`
                    transition-all duration-300 ease-in-out md:overflow-visible
                    md:block md:opacity-100 md:max-h-none relative z-50 mt-3
                    ${isFiltersVisible 
                    ? 'block opacity-100 max-h-96 overflow-visible' 
                    : 'hidden md:block opacity-0 md:opacity-100 max-h-0 md:max-h-none overflow-hidden'
                    }
                `}>
                    <div className="w-full space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4 mb-3 mt-3">
                       
                       <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">
                            {t('label.niveau_execution')}
                            </label>
                            <CustomDropDown2
                                title=""
                                selectedItem={currentNiveau}
                                items={niveaux}
                                defaultValue={undefined}
                                displayProperty={(item: NiveauExecution) => `${lang === 'fr' ? item.nomFr : item.nomEn}`}
                                onSelect={handleNiveauSelect}
                            />
                        </div>

                        {/* Etat */}
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">
                            {t('label.etat')}
                            </label>
                            <CustomDropDown2
                                title=""
                                selectedItem={currentEtat}
                                items={etats}
                                defaultValue={undefined}
                                displayProperty={(item: EtatTache) => `${lang === 'fr' ? item.nomFr : item.nomEn}`}
                                onSelect={handleEtatSelect}
                            />
                        </div>
                        

                        {/**Barre de recherche */}
                        <div className="md:col-span-4">
                            <InputSearch 
                                hintText={t('recherche.rechercher') + t('recherche.tache_formation')} 
                                value={searchText} 
                                onSubmit={(text) => {
                                setIsSearch(true);
                                setSearchText(text);
                                }} 
                            />
                        </div>
                    </div>
                </div>


                {/* <div className="bg-white rounded-xl shadow p-6"> */}
                    <div className="mt-10 flex justify-between gap-8">
                        {/* Conteneur de la barre de progression gauche */}
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-[#374151] mb-2">{t('label.tache_en_attente')}</h4>
                            <ProgressBar value={progressionEnAttente} />
                            <p className="text-right text-sm text-[#6B7280] mt-1">{progressionEnAttente}%</p>
                        </div>

                        {/* Conteneur de la barre de progression droite */}
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-[#374151] mb-2">{t('label.tache_executee')}</h4>
                            <ProgressBar value={progressionExecuter} />
                            <p className="text-right text-sm text-[#6B7280] mt-1">{progressionExecuter}%</p>
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold mb-4">{t('label.liste_tache')}</h2>
                    {pageIsLoading?
                        <Skeleton height={300}/>
                        :
                        filteredData && filteredData.length>0?
                            <div className="grid gap-4">
                                {filteredData.map(t => (
                                    <TacheCard 
                                        tache={t} 
                                        typeTaches={typeTaches} 
                                        lang={lang} 
                                        onExecute={()=>onEdit(t)} 
                                        onOpenChat={()=>handleOpenChat(t)}
                                    />
                                ))}
                            </div>
                            :<NoData/>
                    }

                    
                {/* </div> */}
                {/* </div> */}
               

                {/* Pagination */}
                {searchText==='' && filteredData && filteredData.length>0 && <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={onPageChange}
                />}
            </div>
        </div>
    );
};


export default RendererTacheExecutee;