import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Users, Clock, MoreVertical, Download, Filter, Search } from 'lucide-react';
import { formatDate } from '../../../../fonctions/fonction';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../_redux/store';
import { useFetchData } from '../../../../hooks/fechDataOptions';
import { useTranslation } from 'react-i18next';
import { getFilteredStages } from '../../../../services/stagiaires/stageAPI';
import { setErrorPageStage, setStages, setStagesLoading } from '../../../../_redux/features/stagiaire/stageSlice';
import { NoData } from '../../../NoData';
import Pagination from '../../../Pagination/Pagination';
import Skeleton from 'react-loading-skeleton';
import FormCreateUpdateNoteMandat from '../../../Modals/Notes/ModalNoteService/FormCreateUpdateNoteMandat';
import { setShowModal } from '../../../../_redux/features/setting';

interface StageTabProps {
  onEditStage?: (stage: Stage) => void;
}

const StageTab = ({ onEditStage }: StageTabProps) => {
    const lang = useSelector((state: RootState) => state.setting.language);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [isSearch, setIsSearch] = useState(false);
    const [filterType, setFilterType] = useState<string>('ALL');
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const fetchData = useFetchData();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedStage, setSelectedStage] = useState<Stage|undefined>(undefined)
    const { data: { stages } } = useSelector((state: RootState) => state.stageSlice);
    const pageIsLoading = useSelector((state: RootState) => state.stageSlice.pageIsLoading);
     // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.stageSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.stageSlice.data.totalItems);
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

    useEffect(() => {
          dispatch(setStagesLoading(true));
  
          fetchData({
              apiFunction: getFilteredStages,
              params: {
                  page: currentPage,
                  type:filterType,
                  statut:filterStatus,
                  lang,
              },
              onSuccess: (data) => {
                  
                  dispatch(setStages(data || {
                      stagiaires: [],
                      currentPage: 0,
                      totalItems: 0,
                      totalPages: 0,
                      pageSize: 0,
                  }));
              },
              onError: () => {
                  dispatch(setErrorPageStage(t('message.erreur')));
              },
              onLoading: (isLoading) => {
                  dispatch(setStagesLoading(isLoading));
              },
          });
    }, [currentPage, filterStatus, filterType, lang, dispatch]);
  

    const [filteredData, setFilteredData] = useState<Stage[]>(stages);
        
    
    const latestQueryStage = useRef('');
    useEffect(() => {
        dispatch(setStagesLoading(true));
        latestQueryStage.current = searchTerm;
        
        try{
            
            const filterStagiaireByContent = async () => {
                if (searchTerm === '') {
                    // if(isSearch){
                        // sections.length>0?setSection(sections[0]):setSection(undefined);
                        // filterCycleBySection(section?._id);
                        // filterNiveauxByCycle(cycle?._id);
                        
                        const result: Stage[] = stages;
                        setFilteredData(result); 
                        
                    // }
                }else{
                    // setSection(undefined);
                    // setCycle(undefined);
                    // setNiveau(undefined);
                    // setFilteredCycle([]);
                    // setFilteredNiveaux([]);
                    let stagesResult : Stage[] = [];
                    
                    await getFilteredStages({page:1, search:searchTerm, lang}).then(result=>{
                        if (latestQueryStage.current === searchTerm) {
                            if(result){
                                stagesResult = result.stages;
                                setFilteredData(stagesResult);
                            }
                            }
                        
                    })
                }
        
                
            };
            
            filterStagiaireByContent();
        }catch(e){
            dispatch(setErrorPageStage(t('message.erreur')));
        }finally{
            if (latestQueryStage.current === searchTerm) {
                dispatch(setStagesLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchTerm, isSearch, stages]);
  

  const getStatusBadge = (statut: Stage['statut']): JSX.Element => {
    const statusConfig: Record<Stage['statut'], { bg: string; text: string; label: string }> = {
      'EN_ATTENTE': { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', label: 'En attente' },
      'ACCEPTE': { bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]', label: 'Accepté' },
      'REFUSE': { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]', label: 'Refusé' }
    };
    
    const config = statusConfig[statut];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: Stage['type']): JSX.Element => {
    return type === 'GROUPE' ? (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#EDE9FE] text-[#5B21B6]">
        <Users className="w-3 h-3 mr-1" />
        {t('label.groupe')}
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#DBEAFE] text-[#1E40AF]">
        {t('label.individuel')}
      </span>
    );
  };

  

  const calculateDuration = (dateDebut: string, dateFin: string): string => {
    try {
      const debut = new Date(dateDebut);
      const fin = new Date(dateFin);
      const diffTime = Math.abs(fin.getTime() - debut.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const months = Math.floor(diffDays / 30);
      return months > 0 ? `${months} mois` : `${diffDays} jours`;
    } catch (error) {
      return t('label.duree_inconnue');
    }
  };

 

  const ActionMenu: React.FC<{ stage: Stage }> = ({ stage }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleGenerate = () => {
      setSelectedStage(stage)
      dispatch(setShowModal())
    };

    return (
      <>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-[#6B7280]" />
          </button>
          
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] z-20">
                <div className="py-1">
                  
                  <button 
                    className="flex items-center w-full px-4 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB]"
                    onClick={handleGenerate}
                  >
                    <Download className="w-4 h-4 mr-3" />
                    {t('label.generer_note')}
                  </button>
                  
                  {/* <hr className="my-1 border-[#E5E7EB]" />
                  <button 
                    className="flex items-center w-full px-4 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2]"
                    onClick={() => {setSelectedStage(stage);dispatch(setShowModalDelete()); setIsOpen(false)}}
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    Supprimer
                  </button> */}
                </div>
              </div>
            </>
          )}
        </div>
        
      </>
    );
  };

  return (
    <>
        <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                    <h1 className="text-3xl font-bold text-[#1F2937] mb-2">{t('label.titre_note')}</h1>
                    <p className="text-[#6B7280]">{t('label.generer_note_service_ind_grp')}</p>
                    </div>
                </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    
                    {/* Search */}
                    <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
                        <input
                        type="text"
                        placeholder="Rechercher un stage..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                        />
                    </div>
                    </div>

                    {/* Status Filter */}
                    <div className="lg:w-48">
                    <select
                        value={filterStatus}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                    >
                        <option value="ALL">Tous les statuts</option>
                        <option value="EN_ATTENTE">En attente</option>
                        <option value="ACCEPTE">Accepté</option>
                        <option value="REFUSE">Refusé</option>
                    </select>
                    </div>

                    {/* Type Filter */}
                    <div className="lg:w-48">
                    <select
                        value={filterType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                    >
                        <option value="ALL">Tous les types</option>
                        <option value="GROUPE">Groupe</option>
                        <option value="INDIVIDUEL">Individuel</option>
                    </select>
                    </div>

                    <button className="inline-flex items-center px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-lg hover:bg-[#E5E7EB] transition-colors">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                    </button>
                </div>
                </div>

                {/* Stages Grid */}
                {pageIsLoading?
                <Skeleton height={350}/>:(
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredData.map((stage: Stage) => (
                            <div key={stage._id} className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                            
                            {/* Card Header */}
                            <div className="p-6 pb-4 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-2 overflow-hidden">
                                    <div className="line-clamp-2">
                                        {stage.nomFr}
                                    </div>
                                    </h3>
                                </div>
                                <ActionMenu stage={stage} />
                                </div>

                                {/* Content qui s'étend */}
                                <div className="flex-1">
                                {/* Participants Info */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center text-[#6B7280]">
                                    <Users className="w-4 h-4 mr-2" />
                                    <span className="text-sm">
                                        {stage.nombreStagiaires} stagiaire{(stage?.nombreStagiaires||0) > 1 ? 's' : ''}
                                    </span>
                                    </div>
                                    {stage.type === 'GROUPE' && (
                                    <div className="flex items-center text-[#6B7280]">
                                        <span className="text-sm">
                                        {stage.nombreGroupes} groupe{(stage?.nombreGroupes||0) > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    )}
                                </div>

                                {/* Dates */}
                                <div className="space-y-2">
                                    <div className="flex items-center text-[#6B7280]">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span className="text-sm">
                                        {formatDate(stage.dateDebut)} - {formatDate(stage.dateFin)}
                                    </span>
                                    </div>
                                    <div className="flex items-center text-[#6B7280]">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span className="text-sm">
                                        Durée: {calculateDuration(stage.dateDebut, stage.dateFin)}
                                    </span>
                                    </div>
                                </div>
                                </div>

                                {/* Badges alignés en bas */}
                                <div className="flex items-center gap-2 mt-4">
                                {getTypeBadge(stage.type)}
                                {getStatusBadge(stage.statut)}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#E5E7EB] mt-auto">
                                <div className="flex items-center justify-between">
                                <span className="text-xs text-[#6B7280]">
                                    Année {stage.anneeStage}
                                </span>
                                <span className="text-xs text-[#6B7280]">
                                    Créé le {formatDate(stage?.createdAt||"")}
                                </span>
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>

                        {/* Empty State */}
                        {filteredData.length === 0 && (
                            <NoData/>
                        )}
                    </>
                )}

                {/* Pagination */}
                {searchTerm==='' && filteredData && filteredData.length>0 && <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={setCurrentPage}
                />}
            </div>
        </div>
        <FormCreateUpdateNoteMandat note={undefined} stageId={selectedStage?._id}/>
    </>
  );
};

export default StageTab;