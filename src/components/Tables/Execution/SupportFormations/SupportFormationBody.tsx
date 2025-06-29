import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../_redux/store";
import Pagination from "../../../Pagination/Pagination";
import { Filter, ChevronUp, ChevronDown, BookOpen, Calendar, Trash2, FileDown } from "lucide-react";
import 'react-loading-skeleton/dist/skeleton.css'
import CustomDropDown2 from "../../../DropDown/CustomDropDown2";
import { config } from "../../../../config";
import { deleteSupportFormationSlice, setErrorPageSupportFormation, setSupportFormationLoading } from "../../../../_redux/features/execution/supportFormationSlice";
import { deleteSupportFormation, getFilteredSupportsFormation, telechargerSupportFormation } from "../../../../services/executions/supportFormationAPI";
import { Card } from "../../../ui/Support/Card";
import { CardContent } from "../../../ui/Support/CardContent";
import { Button } from "../../../ui/Support/Button";
import { formatFileSizeInMo, getFileIcon, getFileSize, truncateText } from "../../../../fonctions/fonction";
import { NoData } from "../../../NoData";
import createToast from "../../../../hooks/toastify";

interface SupportFormationBodyProps {
    data: SupportFormation[];
    programmeFormations: ProgrammeFormation[];
    formations: Formation[];
    themes: ThemeFormation[];
    currentFormation?: Formation;
    currentProgrammeFormation?: ProgrammeFormation;
    currentTheme?: ThemeFormation;
    
   
    isLoading: boolean;
    currentPage: number;
    onPageChange: (page: number) => void;
    onFormationChange: (formation: Formation) => void;
    onProgrammeFormationChange: (programme: ProgrammeFormation) => void;
    onThemeChange: (theme: ThemeFormation) => void;
    onEdit: (supportFormation: SupportFormation) => void;
}

const SupportFormationBody = ({
    data, programmeFormations, formations, themes,
    currentFormation, currentProgrammeFormation, currentTheme,
    isLoading, currentPage, onPageChange, onFormationChange,
    onProgrammeFormationChange, onThemeChange, onEdit
}: SupportFormationBodyProps) => {
    const { t } = useTranslation();
    const pageIsLoading = isLoading;
    const lang = useSelector((state: RootState) => state.setting.language);
    const userRole = useSelector((state: RootState) => state.utilisateurSlice.utilisateur.role);
    const roles = config.roles;
    const dispatch = useDispatch();
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    const [isBloc2Visible, setIsBloc2Visible] = useState(false);
    const toggleBloc2 = () => {
        setIsBloc2Visible(!isBloc2Visible);
    };
    // États pour l'interface
    const [searchTerm, setSearchTerm] = useState("");

    // Variables pour la pagination
    const itemsPerPage = useSelector((state: RootState) => state.supportFormationSlice.data.pageSize);
    const count = useSelector((state: RootState) => state.supportFormationSlice.data.totalItems);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    const pageNumbers: number[] = [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);
    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);

    // Handlers pour les dropdowns
    const handleProgrammeFormationSelect = (selected: ProgrammeFormation | undefined) => {
        if (selected) onProgrammeFormationChange(selected);
    };

    const handleFormationSelect = (selected: Formation | undefined) => {
        if (selected) onFormationChange(selected);
    };

    const handleThemeSelect = (selected: ThemeFormation | undefined) => {
        if (selected) onThemeChange(selected);
    };

    const [filteredData, setFilteredData] = useState<SupportFormation[]>(data);
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState(false);

    const latestQuerySupportFormation = useRef('');
    useEffect(() => {
        dispatch(setSupportFormationLoading(true));
        latestQuerySupportFormation.current = searchText;
        
        try{
            
            const filterSupportFormationByContent = async () => {
                if (searchText === '') {
                    const result: SupportFormation[] = data;
                    setFilteredData(result); 
                }else{
                    let supportFormationsResult : SupportFormation[] = [];
                    
                    await getFilteredSupportsFormation({page:1, titre:searchText, lang}).then(result=>{
                        if (latestQuerySupportFormation.current === searchText) {
                            if(result){
                                supportFormationsResult = result.supportFormations;
                                setFilteredData(supportFormationsResult);
                            }
                            }
                        
                    })
                }
        
                
            };
            
            filterSupportFormationByContent();
        }catch(e){
            dispatch(setErrorPageSupportFormation(t('message.erreur')));
        }finally{
            if (latestQuerySupportFormation.current === searchText) {
                dispatch(setSupportFormationLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, isSearch, data]);

    const handleDelete = async (id: string) => {
        if (confirm(t('confirmer_suppression'))) {
        try {
            await deleteSupportFormation(id, lang);
            dispatch(deleteSupportFormationSlice({id}))
        } catch (error) {
            console.error('Erreur suppression:', error);
        }
        }
    };

    const handleDownload = async (support: any) => {
        try {
            await telechargerSupportFormation(support._id, lang).then((e: Blob) => {
                if (e) {
                    const url = window.URL.createObjectURL(e);
                    const link = document.createElement('a');
                    
                    // Nom du fichier : extrait depuis le chemin du backend ou par défaut
                    const fileName = support.fichier?.split('/').pop() || 'document.pdf';
                    
                    link.href = url;
                    link.download = fileName;
                    document.body.appendChild(link); // Nécessaire pour Firefox
                    link.click();
                    link.remove();
            
                    window.URL.revokeObjectURL(url);

                } else {
                    
                    createToast('message.erreur', '', 2);

                }
            }).catch(async (e) => {
                const blob = e.response.data as Blob;
                if (blob.type === 'application/json') {
                    // Lire le blob JSON
                    const text = await blob.text(); // lire le blob en texte
                    const json = JSON.parse(text);  // parser en JSON
                    createToast(json.message || json, '', 2);
                } else {
                    console.error('Erreur backend non JSON:', e.message);
                }
                
            })
            
             // Libère la mémoire

        } catch (e) {
            console.error('Erreur lors du téléchargement du support :', e);
        }
    };


    return (
        <div className="min-h-screen bg-white mt-3 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* Filtres principaux (Programme, Formation, Thème) */}
                {/* Bouton pour afficher/masquer les filtres - visible uniquement sur mobile */}
                <div className="block md:hidden mb-4">
                    <button
                        onClick={toggleFilters}
                        className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-800">
                                {t('filtre.filtrer')}
                            </span>
                        </div>
                        {isFiltersVisible ? (
                        <ChevronUp className="w-5 h-5 text-blue-600" />
                        ) : (
                        <ChevronDown className="w-5 h-5 text-blue-600" />
                        )}
                    </button>
                </div>
            
                {/* Conteneur des filtres */}
                <div className={`
                    transition-all duration-300 ease-in-out md:overflow-visible
                    md:block md:opacity-100 md:max-h-none relative z-50
                    ${isFiltersVisible 
                        ? 'block opacity-100 max-h-96 overflow-visible' 
                        : 'hidden md:block opacity-0 md:opacity-100 max-h-0 md:max-h-none overflow-hidden'
                    }
                `}>
                    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 mb-3">
                        {/* Programme Formation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('label.programme_formation')}
                            </label>
                            <CustomDropDown2<ProgrammeFormation>
                                title=""
                                selectedItem={currentProgrammeFormation}
                                items={programmeFormations}
                                defaultValue={currentProgrammeFormation}
                                displayProperty={(item) => `${item.annee}`}
                                onSelect={handleProgrammeFormationSelect}
                            />
                        </div>
            
                        {/* Formation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('label.formation')}
                            </label>
                            <CustomDropDown2<Formation>
                                title=""
                                selectedItem={currentFormation}
                                items={formations}
                                defaultValue={currentFormation}
                                displayProperty={(item) => `${lang === 'fr' ? item.titreFr : item.titreEn}`}
                                onSelect={handleFormationSelect}
                            />
                        </div>
            
                        {/* Thème */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('label.theme')}
                            </label>
                            <CustomDropDown2<ThemeFormation>
                                title=""
                                selectedItem={currentTheme}
                                items={themes}
                                defaultValue={currentTheme}
                                displayProperty={(item) => `${lang === 'fr' ? item.titreFr : item.titreEn}`}
                                onSelect={handleThemeSelect}
                            />
                        </div>
                    </div>
                </div>
                {/* </div> */}
                {true && (
                <>
                    {console.log(data)}
                    {filteredData && filteredData.length === 0 ? (
                    <NoData/>
                    ) : (
                    <div className={`grid gap-6 ${
                        viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                        : 'grid-cols-1'
                    }`}>
                        {filteredData && filteredData.map((support) => (
                        <Card 
                            key={support._id} 
                            className={`group bg-white border border-[#e1e5e9] hover:border-[#3b82f6] hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col ${
                            viewMode === 'list' ? 'sm:flex-row' : ''
                            }`}
                        >
                            <CardContent className={`p-6 flex flex-col h-full ${viewMode === 'list' ? 'flex-1' : ''}`}>
                            {/* Header avec icône de fichier et badge thème */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                <div className="relative p-3 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] rounded-xl border border-[#e1e5e9] group-hover:shadow-md transition-all duration-300">
                                    {support.fichier && getFileIcon(support.fichier)}
                                    {/* Badge de taille de fichier */}
                                    <div className="absolute -bottom-1 -right-1 bg-[#1e293b] text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                                        {support.taille?formatFileSizeInMo(support.taille):""}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    {support.theme && (
                                    <div 
                                        className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white text-xs font-medium mb-2 max-w-full"
                                        title={lang === 'fr' ? support.theme.titreFr : support.theme.titreEn}
                                    >
                                        <span className="truncate">
                                        {truncateText(lang === 'fr' ? support.theme.titreFr : support.theme.titreEn)}
                                        </span>
                                    </div>
                                    )}
                                </div>
                                </div>
                            </div>
                            
                            {/* Title */}
                            <h2 className="text-lg font-bold text-[#1e293b] mb-3 group-hover:text-[#3b82f6] transition-colors line-clamp-2 flex-shrink-0">
                                {lang === 'fr' ? support.nomFr : support.nomEn}
                            </h2>
                            
                            {/* Description - flex-grow pour occuper l'espace disponible */}
                            <p className="text-sm text-[#64748b] line-clamp-3 mb-4 leading-relaxed flex-grow">
                                {lang === 'fr' ? support.descriptionFr : support.descriptionEn}
                            </p>
                            
                            {/* Date info */}
                            {support.theme?.dateDebut && (
                                <div className="flex items-center gap-2 text-xs text-[#6b7280] mb-6 flex-shrink-0">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {new Date(support.theme.dateDebut).toLocaleDateString()} 
                                    {support.theme.dateFin && ` - ${new Date(support.theme.dateFin).toLocaleDateString()}`}
                                </span>
                                </div>
                            )}
                            
                            {/* Actions - toujours en bas avec mt-auto */}
                            <div className={`flex gap-3 mt-auto flex-shrink-0 ${viewMode === 'list' ? 'sm:flex-col lg:flex-row' : 'flex-col sm:flex-row'}`}>
                                <Button 
                                variant="outline"
                                onClick={() => handleDownload(support)}
                                className="flex-1 border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-white transition-all duration-200 rounded-xl h-10"
                                >
                                <FileDown className="w-4 h-4 mr-2" /> 
                                {t('button.telecharger')}
                                </Button>
                                <Button
                                variant="destructive"
                                onClick={() => handleDelete(support._id!)}
                                className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white rounded-xl h-10 px-4 flex-shrink-0"
                                >
                                <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                    )}
                </>
                )}

                

                {/* Pagination */}
                {filteredData && filteredData.length > 0 && (
                    <div className="p-6 border-t border-stroke dark:border-gray-700">
                        <Pagination
                            count={count}
                            itemsPerPage={itemsPerPage}
                            startItem={startItem}
                            endItem={endItem}
                            hasPrevious={hasPrevious}
                            hasNext={hasNext}
                            currentPage={currentPage}
                            pageNumbers={pageNumbers}
                            handlePageClick={onPageChange}
                        />
                    </div>
                )}
                {/* </div> */}
            </div>
        </div>
    );
};

export default SupportFormationBody;