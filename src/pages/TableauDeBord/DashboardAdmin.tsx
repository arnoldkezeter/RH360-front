import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Users, DollarSign, BarChart2, CalendarCheck, Banknote } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { useFetchDashbordData } from '../../hooks/useFetchDashbordData';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import Table from '../../components/Tables/Dashbord/TableDashord/Table';

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white rounded-2xl shadow-lg border border-[#F3F4F6] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 flex justify-between items-center">
    <div>
      <p className="text-sm font-medium text-[#6B7280] mb-1">{title}</p>
      <p className="text-3xl font-bold text-[#111827]">{value}</p>
    </div>
    <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);



const DashboardProgram = () => {
    const lang: string = useSelector((state: RootState) => state.setting.language) || 'fr';
    const {data:{programmeFormations}} = useSelector((state: RootState) => state.programmeFormationSlice);
    const [selectedId, setSelectedId] = useState<string|undefined>();
    const {t} = useTranslation()
    useEffect(()=>{
        if(programmeFormations && programmeFormations.length>0){
            setSelectedId(programmeFormations[0]._id);
        }
    },[programmeFormations]);

    const { 
        data,
        error,
        isLoading, 
    
    } = useFetchDashbordData({programmeId:selectedId});
  

    const coutFormations = data.coutsFormation || []
    function getTotalMontantReelTTC(coutFormations: { montantReelTTC?: number }[]): number {
        return coutFormations.reduce((total, item) => {
            const montant = item.montantReelTTC ?? 0;
            return total + montant;
        }, 0);
    }


    const dataDetails = data?.tauxExecution?.details || []
    const barData = {
        labels: dataDetails.map((a:any) =>lang==='fr'?a.titreFr:a.titreEn),
        datasets: [
        {
            
            data: dataDetails.map((a: any) => a.tauxExecution),
            backgroundColor: '#2563EB',
            borderRadius: 6,
        },
        ],
    };




    const tauxExecutionMois = data.tauxExecutionMois || [];
  const lineData = {
    labels: tauxExecutionMois.map((m:any) => lang === 'fr' ? m.moisFr : m.moisEn),
    datasets: [
      {
        label: lang === 'fr' ? 'Taux d’exécution' : 'Execution Rate',
        data: tauxExecutionMois.map((m:any) => m.taux),
        borderColor: '#10B981',
        backgroundColor: '#D1FAE5',
        tension: 0.3,
        pointBackgroundColor: '#10B981'
      }
    ]
  };

//   const lineOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: { legend: { display: false } },
//     scales: {
//       x: { ticks: { font: { size: 11 } }, grid: { color: '#f1f5f9' } },
//       y: { ticks: { font: { size: 11 } }, grid: { color: '#f8fafc' } }
//     }
//   };
  
  return (
    <div className="p-4 space-y-6">
      {/* Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading?<Skeleton height={150}/>:<StatCard title={lang === 'fr' ? 'Taux d’exécution' : 'Execution Rate'} value={`${(data?.tauxExecution?.tauxExecutionGlobal) || 0}%`} icon={BarChart2} color="from-[#3B82F6] to-[#60A5FA]" />}
        {isLoading?<Skeleton height={150}/>:<StatCard title={lang === 'fr' ? 'Stages en cours' : 'Ongoing Stages'} value={data?.nbStageEnCours || 0} icon={CalendarCheck} color="from-[#F59E0B] to-[#FBBF24]" />}
        {isLoading?<Skeleton height={150}/>:<StatCard title={lang === 'fr' ? 'Formateurs déployés' : 'Deployed Trainers'} value={`${(data.statsFormateurs?.interne || 0)+(data.statsFormateurs?.externe || 0)}`} icon={Users} color="from-[#10B981] to-[#34D399]" />}
        {isLoading?<Skeleton height={150}/>:<StatCard title={lang === 'fr' ? 'Budget dépensé' : 'Budget Spent'} value={`${getTotalMontantReelTTC(coutFormations)}`} icon={Banknote} color="from-[#8B5CF6] to-[#A78BFA]" />}
      </div>

      {/* Histogramme */}
      <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 hover:shadow-xl transition-shadow duration-300 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-[#3B82F6] to-[#2563EB] rounded-full"></div>
            {lang === 'fr' ? 'Formations par axe stratégique' : 'Trainings by Strategic Axis'}
          </h3>
        </div>
        <div style={{ minWidth: '500px', height: '300px' }}>
          {isLoading?<Skeleton height={300}/>:<Bar data={barData} 
            options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context: any) {
                                const value = context.parsed.y ?? context.parsed;
                                return `${t('label.formations')} : ${value}%`;
                                }
                            }
                        },
                        
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
                                },
                                callback: function (value: string | number) {
                                    return typeof value === 'number' ? `${value}%` : value;
                                }
                            }
                        },
                           
                        
                    }
                }}
            />}
        </div>
      </div>

      {/* Courbe */}
      <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 hover:shadow-xl transition-shadow duration-300 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-[#10B981] to-[#059669] rounded-full"></div>
            {lang === 'fr' ? 'Taux d’exécution par mois' : 'Execution Rate by Month'}
          </h3>
        </div>
        <div style={{ minWidth: '500px', height: '300px' }}>
          <Line 
            data={lineData} 
            options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context: any) {
                                const value = context.parsed.y ?? context.parsed;
                                return `${t('label.formations')} : ${value}%`;
                                }
                            }
                        },
                        
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
                                },
                                callback: function (value: string | number) {
                                    return typeof value === 'number' ? `${value}%` : value;
                                }
                            }
                        },
                           
                        
                    }
                }}
            />
        </div>
      </div>

      {/* Tableau */}
      <Table data={data.formationsAVenir} isLoading={isLoading}/>
    </div>
  );
};

export default DashboardProgram;
