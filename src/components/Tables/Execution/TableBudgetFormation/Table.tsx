import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../_redux/store";
import Pagination from "../../../Pagination/Pagination";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { CardStat } from "../../../ui/Card";
import { Target, TrendingUp, Banknote, Filter, ChevronUp, ChevronDown } from "lucide-react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { NoData } from "../../../NoData";
import CustomDropDown2 from "../../../DropDown/CustomDropDown2";
import InputSearch from "../../common/SearchTable";
import { setShowModal } from "../../../../_redux/features/setting";
import { config } from "../../../../config";
import Button from "../../common/Button";

interface TableDepenseProps {
    data: Depense[];
    typesDepenses: TypeDepense[];
    programmeFormations: ProgrammeFormation[];
    formations: Formation[];
    budgets: BudgetFormation[];
    currentFormation?: Formation;
    currentProgrammeFormation?: ProgrammeFormation;
    currentBudget?: BudgetFormation;
    currentType?: TypeDepense;
    histogramme: any[];
    totaux: any;
    isLoading: boolean;
    currentPage: number;
    onPageChange: (page: number) => void;
    onFormationChange: (formation: Formation) => void;
    onProgrammeFormationChange: (programme: ProgrammeFormation) => void;
    onBudgetChange: (budget: BudgetFormation) => void;
    onTypeChange: (type: TypeDepense) => void;
    onCreate: () => void;
    onEdit: (depense: Depense) => void;
}

const Table = ({
    data, typesDepenses, programmeFormations, formations, budgets,
    currentFormation, currentProgrammeFormation, currentBudget, currentType,
    histogramme, totaux, isLoading, currentPage, onPageChange, onFormationChange,
    onProgrammeFormationChange, onBudgetChange, onTypeChange, onCreate, onEdit
}: TableDepenseProps) => {
    const { t } = useTranslation();
    const pageIsLoading = isLoading;
    const lang:string = useSelector((state: RootState) => state.setting.language);
    const userRole = useSelector((state: RootState) => state.utilisateurSlice.utilisateur.role);
    const roles = config.roles;
    const dispatch = useDispatch();
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
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
    const itemsPerPage = useSelector((state: RootState) => state.depenseSlice.data.pageSize);
    const count = useSelector((state: RootState) => state.depenseSlice.data.totalItems);
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


    const handleBudgetSelect = (selected: BudgetFormation | undefined) => {
        if (selected) onBudgetChange(selected);
    };

    const handleTypeSelect = (selected: TypeDepense | undefined) => {
        if (selected) onTypeChange(selected);
    };

    return (
        <div className="min-h-screen bg-white mt-3 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* Filtres principaux (Programme, Formation, Thème) */}
                {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-stroke dark:border-gray-700 p-4 mb-6"> */}
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
            
                        {/* Thème
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
                        </div> */}
                    </div>
                </div>
                {/* </div> */}

                {/* Cartes statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                        {pageIsLoading ? (
                            <Skeleton height={80} />
                        ) : (
                            <CardStat
                                title={t('label.total_budget_prevu')}
                                value={totaux.totalBudgetPrevu}
                                icon={<Target className="w-8 h-8 text-[#2563eb]" />}
                                color="bg-[#eff6ff] dark:bg-[#1e3a8a]/20"
                                isLoading={pageIsLoading}
                            />
                        )}

                        {pageIsLoading ? (
                            <Skeleton height={80} />
                        ) : (
                            <CardStat
                                title={t('label.total_budget_reel')}
                                value={totaux.totalBudgetReel}
                                icon={<Banknote className="w-8 h-8 text-[#16a34a]" />}
                                color="bg-[#f0fdf4] dark:bg-[#14532d]/20"
                                isLoading={pageIsLoading}
                            />
                        )}

                        {pageIsLoading ? (
                            <Skeleton height={80} />
                        ) : (
                            <CardStat
                                title={t('label.total_ecart')}
                                value={totaux.totalEcart}
                                icon={<TrendingUp className="w-8 h-8 text-[#ea580c]" />}
                                color="bg-[#fff7ed] dark:bg-[#9a3412]/20"
                                isLoading={pageIsLoading}
                            />
                        )}
                </div>

                {/* Graphique */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-stroke dark:border-gray-700 mb-3">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('label.graphique_depenses')}
                        </h2>
                        
                        <div className="h-80">
                            {pageIsLoading ? (
                                <Skeleton height={320} />
                            ) : histogramme.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <NoData />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={histogramme} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis 
                                            dataKey={lang === 'fr' ? "titreFr" : "titreEn"} 
                                            stroke="#64748b" 
                                            fontSize={12}
                                            tick={{ fill: '#64748b' }}
                                            tickFormatter={(value) => {
                                                // Truncate long text to max 15 characters
                                                if (value && value.length > 15) {
                                                    return value.substring(0, 12) + '...';
                                                }
                                                return value;
                                            }}
                                            height={60}
                                            interval={0}
                                        />
                                        <YAxis stroke="#64748b" fontSize={12} tick={{ fill: '#64748b' }} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'white', 
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="budgetPrevu" fill="#3b82f6" name={t('label.budget_estimatif')} radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="budgetReel" fill="#10b981" name={t('label.budget_reel')} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filtres secondaires et actions pour le tableau */}
                {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-stroke dark:border-gray-700 p-4 mb-6"> */}
                {/* Toggle mobile pour le bloc 2 uniquement */}
                <div className="block md:hidden mb-4">
                    <button
                        onClick={toggleBloc2}
                        className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors duration-200"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-800">
                                {t('filtre.filtrer')}
                            </span>
                        </div>
                        {isBloc2Visible ? (
                            <ChevronUp className="w-5 h-5 text-green-600" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-green-600" />
                        )}
                    </button>
                </div>

                {/* Conteneur du Bloc 2 (budget, type, recherche, ajout) */}
                {/* Conteneur des filtres */}
                <div className={`
                    transition-all duration-300 ease-in-out md:overflow-visible
                    md:block md:opacity-100 md:max-h-none relative z-50
                    ${isBloc2Visible 
                        ? 'block opacity-100 max-h-96 overflow-visible' 
                        : 'hidden md:block opacity-0 md:opacity-100 max-h-0 md:max-h-none overflow-hidden'
                    }
                `}>
                    <div className="flex flex-col gap-4 mb-3">
                        {/* Ligne 1 : Budget + Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('label.budget')}
                                </label>
                                <CustomDropDown2<BudgetFormation>
                                    title=""
                                    selectedItem={currentBudget}
                                    items={budgets}
                                    defaultValue={currentBudget}
                                    displayProperty={(item) => `${lang === 'fr' ? item.nomFr : item.nomEn}`}
                                    onSelect={handleBudgetSelect}
                                />
                            </div>

                            {/* Type de dépense */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('label.type_depense')}
                                </label>
                                <CustomDropDown2<TypeDepense>
                                    title=""
                                    selectedItem={currentType}
                                    items={typesDepenses}
                                    defaultValue={undefined}
                                    displayProperty={(item) => `${lang === 'fr' ? item.nomFr : item.nomEn}`}
                                    onSelect={handleTypeSelect}
                                />
                            </div>
                        </div>

                        {/* Ligne 2 : Recherche + Ajout */}
                        <div className="flex flex-col md:flex-row gap-4 md:items-end">
                            {/* Barre de recherche */}
                            <div className="flex-1 w-full">
                                <div className="relative">
                                    <InputSearch 
                                    hintText={t('recherche.rechercher') + t('recherche.depense')} 
                                    value={""} 
                                    onSubmit={(text) => console.log('Recherche:', text)} 
                                    />
                                </div>
                            </div>

                            {/* Bouton d'ajout */}
                            {(roles.admin === userRole || roles.superAdmin === userRole) && (
                            <div className="w-full md:w-auto">
                                <Button
                                    onClick={() => { 
                                        onCreate();
                                        dispatch(setShowModal()) 
                                    }}
                                    title={t('button.ajouter_depense')}
                                    className="text-sm lg:text-base whitespace-nowrap w-full md:w-auto justify-center md:justify-start h-12"
                                />
                            </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* </div> */}

                {/* Tableau */}
                {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-stroke dark:border-gray-700"> */}
                    {/* <div className="p-4 border-b border-stroke dark:border-gray-700"> */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {t('label.liste_depense')}
                            </h2>
                        </div>
                    {/* </div> */}

                    <div className="overflow-hidden">
                        {pageIsLoading ? (
                            <div className="p-6">
                                <Skeleton count={10} height={40} />
                            </div>
                        ) : data?.length === 0 ? (
                            <div className="p-12 text-center">
                                <NoData />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <HeaderTable />
                                    <BodyTable data={data} onEdit={onEdit} />
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {data && data.length > 0 && (
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

export default Table;