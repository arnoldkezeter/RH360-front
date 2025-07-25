import React from 'react';
import { Target, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CardStat } from '../../../../ui/Card';
import { useTranslation } from 'react-i18next';
import { monthsFullEn, monthsFullFr } from '../../../../../config';
import Skeleton from 'react-loading-skeleton';

interface VueEnsembleProps {
    data: any;
    loading:boolean;
    lang:string;
}
// Composant principal DashboardOverview
const VueEnsemble = ({data, loading = false, lang}:VueEnsembleProps) => {
    const {t}=useTranslation();
    const formatMonth = (value: number) => {
        const months = lang === 'fr' ? monthsFullFr : monthsFullEn;
        return months[value - 1] || value;
    };

    return (
        <div className="space-y-8">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CardStat
                title={t('label.taux_validation')}
                value={`${data?.tauxValidation?.tauxValidation || 0}%`}
                icon={<Target className="w-8 h-8 text-[#3b82f6]" />}
                color="bg-[#f0fdf4] dark:bg-[#14532d]/20"
                footer={`${data?.tauxValidation?.valides || 0}/${data?.tauxValidation?.total || 0} évaluations`}
                isLoading={loading}
            />
            
            <CardStat
                title={t('label.valides')}
                value={`${data?.tauxValidation?.valides || 0}`}
                icon={<CheckCircle className="w-8 h-8 text-[#16a34a]" />}
                color="bg-[#f0fdf4] dark:bg-[#16653433]"
                isLoading={loading}
            />

            <CardStat
                title={t('label.rejetees')}
                value={`${data?.tauxValidation?.rejetees || 0}`}
                icon={<XCircle className="w-8 h-8 text-[#dc2626]" />}
                color="bg-[#fef2f2] dark:bg-[#7f1d1d33]"
                isLoading={loading}
            />

            <CardStat
                title={t('label.en_attentes')}
                value={`${data?.tauxValidation?.enAttente || 0}`}
                icon={<Clock className="w-8 h-8 text-[#ca8a04]" />}
                color="bg-[#fefce8] dark:bg-[#78350f33]"
                isLoading={loading}
            />
        </div>

        {/* Graphique d'évolution mensuelle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-stroke dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('label.evolution_mensuelle')}
            </h3>
            {loading ? (<Skeleton height={300}/>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data?.parMois?.data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                    dataKey="_id.month" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                        return `${lang==='fr'?monthsFullFr[value - 1] : monthsFullEn[value - 1]}` || value;
                    }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                    labelFormatter={formatMonth}
                    contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3} 
                />
                </AreaChart>
            </ResponsiveContainer>
            )}
        </div>

        {/* Besoins prioritaires */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-stroke dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('label.besoin_prioritaire')}
            </h3>
            
            {loading ? (
                <Skeleton height={200}/>
            ) : (
            <div className="space-y-3">
                {(data?.faibles?.data || []).length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    {t('label.aucun_besoin_prioritaire') || 'Aucun besoin prioritaire identifié'}
                </div>
                ) : (
                (data?.faibles?.data || []).map((item: { titre: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Iterable<React.ReactNode> | null | undefined; niveau: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Iterable<React.ReactNode> | null | undefined; count: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Iterable<React.ReactNode> | null | undefined; postes: any[]; }, index: React.Key | null | undefined) => (
                    <div
                    key={index}
                    className="p-4 bg-[#fef2f2] dark:bg-red-950/30 rounded-lg border border-[#fecaca] dark:border-red-800/50 transition-all duration-200 hover:shadow-sm"
                    >
                    <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-[#ef4444] mr-3 shrink-0 mt-0.5" />
                        <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.titre}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {t('label.niveau')}: <span className="font-medium">{item?.niveau}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {t('label.nombre_utilisateurs')}: <span className="font-medium">{item?.count}</span>
                        </p>
                        {item?.postes?.length > 0 && (
                            <div className="mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {t('label.postes_concernes')}:
                            </p>
                            <div className="mt-1 flex flex-wrap gap-1">
                                {item.postes.map((poste, idx) => (
                                <span 
                                    key={idx}
                                    className="inline-block px-2 py-1 text-xs bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded-md"
                                >
                                    {poste.nom}
                                </span>
                                ))}
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
                    </div>
                ))
                )}
            </div>
            )}
        </div>
        </div>
    );
};

export default VueEnsemble


