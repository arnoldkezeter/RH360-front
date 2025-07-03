import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { useTranslation } from "react-i18next";
import { RootState } from "../../../../_redux/store";
import { Filter, ChevronUp, ChevronDown } from "lucide-react";
import 'react-loading-skeleton/dist/skeleton.css'
import CustomDropDown2 from "../../../DropDown/CustomDropDown2";
import { config } from "../../../../config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "react-circular-progressbar/dist/styles.css";
import ExecutionRateCard from "../../../ui/Rapport/ExecutionRateCard";
import { NoData } from "../../../NoData";
import Skeleton from "react-loading-skeleton";

// Enregistrer les composants Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface RapportBodyDepenseProps {
    programmeFormations: ProgrammeFormation[];
    formations: Formation[];
    currentFormation?: Formation;
    currentProgrammeFormation?: ProgrammeFormation;
    
    pourcentageExecution:any;
    coutFormations:any;
    statPersonnesFormes:any;
    formateurs:any
    
    isLoading: boolean;
    onFormationChange: (formation: Formation) => void;
    onProgrammeFormationChange: (programme: ProgrammeFormation) => void;
}

const RapportBody = ({
    programmeFormations, formations, 
    currentFormation, currentProgrammeFormation,pourcentageExecution, coutFormations, statPersonnesFormes, formateurs,
    isLoading, onFormationChange,
    onProgrammeFormationChange
}: RapportBodyDepenseProps) => {
    const { t } = useTranslation();
    const lang:string = useSelector((state: RootState) => state.setting.language);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };
    

    // Configuration des graphiques
  // Données pour les graphiques
    const barChartData = coutFormations ?{
        
        labels: coutFormations && coutFormations.map((c: { titreFr: any; titreEn: any; }) => (lang === "fr" ? c.titreFr : c.titreEn)),
        datasets: [
        {
            label: t('label.cout_prevu_ttc'),
            data: coutFormations && coutFormations.map((c: { montantPrevuTTC: any; }) => c.montantPrevuTTC),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
        {
            label: t('label.cout_reel_ttc'),
            data: coutFormations && coutFormations.map((c: { montantReelTTC: any; }) => c.montantReelTTC),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        ],
    }:undefined;

    const participantsPieData = (statPersonnesFormes && statPersonnesFormes.sexe)?{
        labels: statPersonnesFormes && statPersonnesFormes.sexe.map((p: { genre: string; }) => (p?p.genre === "H" ? t('label.hommes') : t('label.femmes'):"")),
        datasets: [
        {
            data: statPersonnesFormes && statPersonnesFormes.sexe.map((p: { total: any; }) => p.total),
            backgroundColor: ["#FF6384", "#36A2EB"],
        },
        ],
    }:undefined;

    const participantsByServiceData = (statPersonnesFormes && statPersonnesFormes.service)?{
        labels: statPersonnesFormes && statPersonnesFormes.service.map((s: { service: { nomFr: any; nomEn: any; }; }) => (lang === "fr" ? s.service.nomFr : s.service.nomEn)),
        datasets: [
            {
                data: statPersonnesFormes && statPersonnesFormes.service.map((s: { total: any; }) => s.total),
                backgroundColor: "#36A2EB",
            },
        ],
    }:undefined;

    const participantsByCategoryData = (statPersonnesFormes && statPersonnesFormes.categorieProfessionnelle)?{
        labels: statPersonnesFormes && statPersonnesFormes.categorieProfessionnelle.map((c: { categorieProfessionnelle: { nomFr: any; nomEn: any; }; }) => (lang === "fr" ? c.categorieProfessionnelle.nomFr : c.categorieProfessionnelle.nomEn)),
        datasets: [
        {
            data: statPersonnesFormes && statPersonnesFormes.categorieProfessionnelle.map((c: { total: any; }) => c.total),
            backgroundColor: "#FF6384",
        },
        ],
    }:undefined;

    const participantsByAgeData = (statPersonnesFormes && statPersonnesFormes.trancheAge)?{
        labels: statPersonnesFormes && statPersonnesFormes.trancheAge.map((a: { tranche: any; }) => a.tranche),
        datasets: [
        {
            data: statPersonnesFormes && statPersonnesFormes.trancheAge.map((a: { total: any; }) => a.total),
            backgroundColor: "#4BC0C0",
        },
        ],
    }:undefined;

    // Handlers pour les dropdowns
    const handleProgrammeFormationSelect = (selected: ProgrammeFormation | undefined) => {
        if (selected) onProgrammeFormationChange(selected);
    };

    const handleFormationSelect = (selected: Formation | undefined) => {
        if (selected) onFormationChange(selected);
    };

    

     return (

        <div className="p-6 space-y-6 min-h-screen bg-white mt-3 dark:bg-gray-900">
            {/* Filtres */}
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
                            defaultValue={undefined}
                            displayProperty={(item) => `${lang === 'fr' ? item.titreFr : item.titreEn}`}
                            onSelect={handleFormationSelect}
                        />
                    </div>
                </div>
            </div>

            {/* Taux d'exécution */}
            {isLoading?<Skeleton height={320}/>:!pourcentageExecution?<NoData/>:<ExecutionRateCard pourcentageExecution={pourcentageExecution} lang={lang} isProgramme={currentFormation===undefined} />}
        
            {/* Participants */}
            <div className="space-y-8">
            {/* Section Participants par Sexe et Service */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Participants par Sexe */}
                <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-[#6366f1] to-[#8b5cf6] rounded-full"></div>
                    {t('label.participants_par_sexe')}
                    </h3>
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {t('label.repartition')}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="w-64 h-64 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-full opacity-20"></div>
                        {isLoading?<Skeleton height={320}/>:
                            !participantsPieData?<NoData/>:
                            <Pie 
                                data={participantsPieData} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                padding: 20,
                                                usePointStyle: true,
                                                font: {
                                                    size: 12,
                                                },
                                            },
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function(context) {
                                                    const label = context.label || '';
                                                    const value = context.raw || 0;
                                                    return `${label}: ${value} participants`;
                                                },
                                            },
                                            backgroundColor: '#ffffff', // Couleur de fond du tooltip
                                            titleColor: '#000000', // Couleur du titre
                                            bodyColor: '#333333', // Couleur du texte
                                            borderColor: '#dddddd',
                                            borderWidth: 1,
                                        },
                                    },
                                }}
                            />

                        }
                    </div>
                </div>
                </div>

                {/* Participants par Service */}
                <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-[#10b981] to-[#059669] rounded-full"></div>
                    {t('label.participants_par_service')}
                    </h3>
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {participantsByServiceData?.datasets?.[0]?.data?.length || 0} {t('label.services')}
                    </div>
                </div>
                <div className="relative">
                    <div 
                    className="overflow-x-auto scrollbar-custom"
                    style={{
                        maxHeight: participantsByServiceData?.datasets?.[0]?.data?.length > 10 ? '400px' : 'auto',
                        overflowY: participantsByServiceData?.datasets?.[0]?.data?.length > 10 ? 'auto' : 'visible'
                    }}
                    >
                    <div style={{ minWidth: participantsByServiceData?.datasets?.[0]?.data?.length > 10 ? '600px' : 'auto' }}>
                        {isLoading?<Skeleton height={320}/>:
                        
                            !participantsByServiceData?<NoData/>:
                            <Bar 
                                data={participantsByServiceData} 
                                options={{ 
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                    legend: {
                                        display: false
                                    }
                                    },
                                    scales: {
                                    x: {
                                        grid: {
                                        color: '#f1f5f9'
                                        },
                                        ticks: {
                                        font: {
                                            size: 11
                                        },
                                        maxRotation: 0,
                                        minRotation: 0,
                                        callback: function(value, index, ticks) {
                                            const label = this.getLabelForValue ? this.getLabelForValue(Number(value)) : '';
                                            if (label && label.length > 12) {
                                                return label.substring(0, 12) + '...';
                                            }
                                            return label || '';
                                        }
                                        }
                                    },
                                    y: {
                                        grid: {
                                        color: '#f8fafc'
                                        },
                                        ticks: {
                                        font: {
                                            size: 11
                                        }
                                        }
                                    }
                                    }
                                }}
                                height={participantsByServiceData?.datasets?.[0]?.data?.length > 10 ? 350 : 250}
                            />
                        }
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Section Participants par Catégorie et Tranche d'âge */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Participants par Catégorie */}
                <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-6 bg-gradient-to-b from-[#f59e0b] to-[#d97706] rounded-full"></div>
                        {t('label.participants_par_categorie')}
                        </h3>
                        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        {participantsByCategoryData?.datasets?.[0]?.data?.length || 0} {t('label.categories')}
                        </div>
                    </div>
                    <div className="relative">
                        <div 
                        className="overflow-x-auto scrollbar-custom"
                        style={{
                            maxHeight: participantsByCategoryData?.datasets?.[0]?.data?.length > 10 ? '400px' : 'auto',
                            overflowY: participantsByCategoryData?.datasets?.[0]?.data?.length > 10 ? 'auto' : 'visible'
                        }}
                        >
                        <div style={{ minWidth: participantsByCategoryData?.datasets?.[0]?.data?.length > 10 ? '500px' : 'auto' }}>
                            {isLoading?<Skeleton height={320}/>:
                            
                                !participantsByCategoryData?<NoData/>:
                                <Bar 
                                data={participantsByCategoryData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: {
                                    legend: {
                                        display: false
                                    }
                                    },
                                    scales: {
                                    x: {
                                        grid: {
                                        color: '#f1f5f9'
                                        },
                                        ticks: {
                                        font: {
                                            size: 11
                                        },
                                        maxRotation: 0,
                                        minRotation: 0,
                                        callback: function(value, index, ticks) {
                                                const label = this.getLabelForValue ? this.getLabelForValue(Number(value)) : '';
                                                if (label && label.length > 12) {
                                                    return label.substring(0, 12) + '...';
                                                }
                                                return label || '';
                                            }
                                        }
                                    },
                                    y: {
                                        grid: {
                                        color: '#f8fafc'
                                        },
                                        ticks: {
                                        font: {
                                            size: 11
                                        }
                                        }
                                    }
                                    }
                                }}
                                height={participantsByCategoryData?.datasets?.[0]?.data?.length > 10 ? 350 : 250}
                                />
                            }
                        </div>
                        </div>
                    </div>
                </div>

                {/* Participants par Tranche d'âge */}
                <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-[#ef4444] to-[#dc2626] rounded-full"></div>
                    {t('label.participants_par_tranche_age')}
                    </h3>
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {participantsByAgeData?.datasets?.[0]?.data?.length || 0} {t('label.tranches')}
                    </div>
                </div>
                <div className="relative">
                    <div 
                    className="overflow-x-auto scrollbar-custom"
                    style={{
                        maxHeight: participantsByAgeData?.datasets?.[0]?.data?.length > 10 ? '400px' : 'auto',
                        overflowY: participantsByAgeData?.datasets?.[0]?.data?.length > 10 ? 'auto' : 'visible'
                    }}
                    >
                    <div style={{ minWidth: participantsByAgeData?.datasets?.[0]?.data?.length > 10 ? '500px' : 'auto' }}>
                        {isLoading?<Skeleton height={320}/>:
                        
                            !participantsByAgeData?<NoData/>:
                            <Bar 
                                data={participantsByAgeData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: {
                                    legend: {
                                        display: false
                                    }
                                    },
                                    scales: {
                                    x: {
                                        grid: {
                                        color: '#f1f5f9'
                                        },
                                        ticks: {
                                        font: {
                                            size: 11
                                        },
                                        maxRotation: 0,
                                        minRotation: 0,
                                        callback: function(value, index, ticks) {
                                            const label = this.getLabelForValue ? this.getLabelForValue(Number(value)) : '';
                                            if (label && label.length > 12) {
                                                return label.substring(0, 12) + '...';
                                            }
                                            return label || '';
                                        }

                                        }
                                    },
                                    y: {
                                        grid: {
                                        color: '#f8fafc'
                                        },
                                        ticks: {
                                        font: {
                                            size: 11
                                        }
                                        }
                                    }
                                    }
                                }}
                                height={participantsByAgeData?.datasets?.[0]?.data?.length > 10 ? 350 : 250}
                            />
                        }
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        
            {/* Coût par Formation */}
            <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] rounded-full"></div>
                    {currentFormation?t('label.cout_par_theme'):t('label.cout_par_formation')}
                    </h3>
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {barChartData?.datasets?.[0]?.data?.length || 0} {t('label.formations')}
                    </div>
                </div>
                <div className="relative">
                    <div 
                    className="overflow-x-auto scrollbar-custom"
                    style={{
                        maxHeight: barChartData?.datasets?.[0]?.data?.length > 10 ? '400px' : 'auto',
                        overflowY: barChartData?.datasets?.[0]?.data?.length > 10 ? 'auto' : 'visible'
                    }}
                    >
                    <div style={{ minWidth: barChartData?.datasets?.[0]?.data?.length > 10 ? '500px' : 'auto' }}>
                        {isLoading?<Skeleton height={320}/>:
                        
                            !barChartData?<NoData/>:
                            <Bar 
                                data={barChartData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: {
                                    legend: {
                                        display: false
                                    }
                                    },
                                    scales: {
                                    x: {
                                        grid: {
                                        color: '#f1f5f9'
                                        },
                                        ticks: {
                                        font: {
                                            size: 11
                                        },
                                        maxRotation: 0,
                                        minRotation: 0,
                                        callback: function(value, index, ticks) {
                                            const label = this.getLabelForValue ? this.getLabelForValue(Number(value)) : '';
                                            if (label && label.length > 12) {
                                                return label.substring(0, 12) + '...';
                                            }
                                            return label || '';
                                        }
                                        }
                                    },
                                    y: {
                                        grid: {
                                        color: '#f8fafc'
                                        },
                                        ticks: {
                                        font: {
                                            size: 11
                                        }
                                        }
                                    }
                                    }
                                }}
                                height={barChartData?.datasets?.[0]?.data?.length > 10 ? 350 : 250}
                            />
                        }
                    </div>
                    </div>
                </div>
            </div>
        
            {/* Formateurs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Formateurs Internes */}
                <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-8 bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] rounded-full"></div>
                        <h3 className="font-bold text-lg text-gray-800">
                        {t('label.formateurs_internes')}
                        </h3>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] rounded-lg flex items-center justify-center group-hover:from-[#3b82f6] group-hover:to-[#1d4ed8] transition-all duration-300">
                        <svg className="w-5 h-5 text-[#3b82f6] group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                        </svg>
                    </div>
                    </div>
                    <div className="flex items-end justify-between">
                    {isLoading?<Skeleton height={5}/>:<p className="text-3xl font-bold text-[#3b82f6] group-hover:text-[#1d4ed8] transition-colors duration-300">
                        {formateurs?.interne || 0}
                    </p>}
                    <div className="text-sm text-gray-500 bg-[#f0f9ff] px-2 py-1 rounded-md">
                        {t('label.internes')}
                    </div>
                    </div>
                </div>

            {/* Formateurs Externes */}
                <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-8 bg-gradient-to-b from-[#10b981] to-[#047857] rounded-full"></div>
                        <h3 className="font-bold text-lg text-gray-800">
                        {t('label.formateurs_externes')}
                        </h3>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0] rounded-lg flex items-center justify-center group-hover:from-[#10b981] group-hover:to-[#047857] transition-all duration-300">
                        <svg className="w-5 h-5 text-[#10b981] group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                        </svg>
                    </div>
                    </div>
                    <div className="flex items-end justify-between">
                    {isLoading?<Skeleton height={5}/>:<p className="text-3xl font-bold text-[#10b981] group-hover:text-[#047857] transition-colors duration-300">
                        {formateurs?.externe || 0}
                    </p>}
                    <div className="text-sm text-gray-500 bg-[#f0fdf4] px-2 py-1 rounded-md">
                        {t("label.externes")}
                    </div>
                    </div>
                </div>

            {/* Total */}
                <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-8 bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] rounded-full"></div>
                        <h3 className="font-bold text-lg text-gray-800">
                        {t('label.total')}
                        </h3>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#ede9fe] to-[#ddd6fe] rounded-lg flex items-center justify-center group-hover:from-[#8b5cf6] group-hover:to-[#7c3aed] transition-all duration-300">
                        <svg className="w-5 h-5 text-[#8b5cf6] group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    </div>
                    <div className="flex items-end justify-between">
                    {isLoading?<Skeleton height={5}/>:<p className="text-3xl font-bold text-[#8b5cf6] group-hover:text-[#7c3aed] transition-colors duration-300">
                        {(formateurs?.interne + formateurs?.externe) || 0}
                    </p>}
                    <div className="text-sm text-gray-500 bg-[#faf5ff] px-2 py-1 rounded-md">
                        {t('label.formateurs')}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default RapportBody;