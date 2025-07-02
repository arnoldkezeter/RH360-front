import React from 'react';
import { AlertCircle, CheckCircle, Clock, TrendingUp, XCircle, Calendar, BarChart3 } from "lucide-react";
import { STATUT_TACHE } from '../../../../config';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';



interface WeeklySectionTacheStagiaireProps {
  stats?: {
    totalCompletees?: number;
    totalAbsences?: number;
    etatJournalier?: DayData[];
  };
  progressionPercent?: number;
  lang?:string;
  isLoading:boolean;
}

// Fonction pour déterminer la couleur et hauteur des barres
const getBarProps = (dayData: DayData) => {
  const maxHeight = 24;
  const height = Math.max(4, Math.min(maxHeight, dayData.total * 3));

  if (dayData.absent > 0) {
    return {
      height: height,
      color: 'from-[#EF4444] via-[#F87171] to-[#FCA5A5]',
      shadowColor: 'shadow-[#FCA5A5]/50',
      status: STATUT_TACHE.ABSENT.key
    };
  } else if (dayData.enCours > 0) {
    return {
      height: height,
      color: 'from-[#3B82F6] via-[#60A5FA] to-[#93C5FD]',
      shadowColor: 'shadow-[#93C5FD]/50',
      status: STATUT_TACHE.EN_COURS.key
    };
  } else {
    return {
      height: height,
      color: 'from-[#10B981] via-[#34D399] to-[#6EE7B7]',
      shadowColor: 'shadow-[#6EE7B7]/50',
      status: STATUT_TACHE.COMPLETE.key
    };
  }
};

const WeeklySection: React.FC<WeeklySectionTacheStagiaireProps> = ({ 
  stats = {
    totalCompletees: 12,
    totalAbsences: 2,
    etatJournalier: []
  }, 
  progressionPercent = 85,
  lang='fr',
  isLoading
}) => {
  const {t}=useTranslation()

  const StatCard = ({ title, value, icon: Icon, gradient, iconColor }: {
    title: string;
    value: number;
    icon: any;
    gradient: string;
    iconColor: string;
  }) => (
    <div className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${gradient} backdrop-blur-sm border border-white/20 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#6B7280]/90">{title}</span>
        <div className={`p-1.5 rounded-lg bg-white/20 backdrop-blur-sm ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-xl font-bold text-[#1F2937] mb-1">{value}</div>
      <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
    </div>
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm  shadow-lg border border-stroke mt-3 overflow-hidden hover:shadow-xl transition-all duration-500">
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl shadow-md">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#1F2937] to-[#6B7280] bg-clip-text text-transparent">
              {t('label.vue_hebdomadaire')}
            </h2>
            <p className="text-[#6B7280] text-xs mt-0.5">{t('label.analyse')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {isLoading?<Skeleton height={100}/>:<StatCard
              title={t('label.taches_terminees')}
              value={stats?.totalCompletees || 0}
              icon={CheckCircle}
              gradient="from-[#ECFDF5] to-[#D1FAE5]"
              iconColor="text-[#10B981]"
            />}
            
            {isLoading?<Skeleton height={100}/>:<StatCard
              title={t('label.nombre_absence')}
              value={stats?.totalAbsences || 0}
              icon={AlertCircle}
              gradient="from-[#FEF2F2] to-[#FECACA]"
              iconColor="text-[#EF4444]"
            />}
            
            {/* Progress Card */}
            {isLoading?<Skeleton height={100}/>:<div className="bg-gradient-to-br from-[#EEF2FF] to-[#DBEAFE] rounded-xl p-4 border border-[#C7D2FE]/50 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-xs font-medium text-gray-700">{t('label.progression_hebdomadaire')}</span>
              </div>
              
              <div className="relative w-full bg-[#E5E7EB]/50 rounded-full h-3 mb-2 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4F46E5] via-[#3B82F6] to-[#06B6D4] rounded-full shadow-lg transition-all duration-1000 ease-out"
                  style={{width: `${progressionPercent}%`}}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-[#1F2937]">{progressionPercent}%</span>
                <span className="text-xs text-[#6B7280] bg-white/60 px-2 py-1 rounded-full">
                  {t('label.complete_semaine')}
                </span>
              </div>
            </div>}
          </div>
          
          {/* Chart Section */}
          <div className="xl:col-span-1">
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-4 p-3 bg-[#F9FAFB]/80 rounded-xl border border-[#E5E7EB]">
              {[
                { status: STATUT_TACHE.COMPLETE, color: 'from-[#10B981] to-[#6EE7B7]', label: lang==='fr'? STATUT_TACHE.COMPLETE.nomFr : STATUT_TACHE.COMPLETE.nomEn },
                { status: STATUT_TACHE.EN_COURS, color: 'from-[#3B82F6] to-[#93C5FD]', label: lang==='fr'? STATUT_TACHE.EN_COURS.nomFr : STATUT_TACHE.EN_COURS.nomEn },
                { status: STATUT_TACHE.ABSENT, color: 'from-[#EF4444] to-[#FCA5A5]', label: lang==='fr'? STATUT_TACHE.ABSENT.nomFr : STATUT_TACHE.ABSENT.nomEn }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-lg bg-gradient-to-r ${item.color} shadow-sm`}></div>
                  <span className="text-xs font-medium text-[#374151]">{item.label}</span>
                </div>
              ))}
            </div>
            
            {/* Bar Chart */}
            <div className="bg-gradient-to-t from-[#F9FAFB]/50 to-white/80 rounded-xl p-4 border border-[#E5E7EB]/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-3 h-3 text-[#6B7280]" />
                <span className="text-xs font-medium text-[#6B7280]">{t('label.activite_quotidienne')}</span>
              </div>
              
              {isLoading?<Skeleton height={150}/>:<div className="flex justify-center items-end gap-3 h-32 px-2">
                {stats?.etatJournalier?.map((day, index) => {
                  const barProps = getBarProps(day);
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 group">
                      <div className="relative">
                        <div 
                          className={`w-8 bg-gradient-to-t ${barProps.color} rounded-lg shadow-md ${barProps.shadowColor} transition-all duration-300 hover:scale-110 cursor-pointer group-hover:shadow-lg`}
                          style={{ height: `${barProps.height * 3}px` }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#1F2937] text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-10">
                          {day.enCours > 0 ? (
                            <>{t('label.en_cours')}: {day.enCours} | {t('label.termine')}: {day.complet}</>
                          ) : day.absent > 0 ? (
                            <>{t('label.absent')}: {day.absent}</>
                          ) : (
                            <>{t('label.total')}: {day.total}</>
                          )}
                          <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#1F2937] rotate-45"></div>
                        </div>
                      </div>
                      
                      <div className="text-xs font-semibold text-[#6B7280] group-hover:text-[#1F2937] transition-colors duration-200">
                        {day?.jour || ""}
                      </div>
                    </div>
                  );
                })}
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySection;