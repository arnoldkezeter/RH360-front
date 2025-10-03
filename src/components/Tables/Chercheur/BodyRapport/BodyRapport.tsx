import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

import { CheckCircle, ChevronDown, ChevronUp, Clock, Filter, TrendingUp, Users, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../_redux/store';
import DateRangePicker from '../../../ui/RangeDatePicker';
import Skeleton from 'react-loading-skeleton';
import { NoData } from '../../../NoData';

const RapportStageBody = ({ data, isLoading, startDate, endDate, onDateChange }: any) => {
  const { t } = useTranslation();
  const lang = useSelector((state: RootState) => state.setting.language) || 'fr';
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const toggleFilters = () => setIsFiltersVisible(!isFiltersVisible);

  // Prépare les données des établissements avec label dynamique
  const etablissementsData = useMemo(() => {
    return (data.chercheursParEtablissement || []).map((item: any) => ({
      ...item,
      label: lang === 'fr' ? item.etablissement.nomFr : item.etablissement.nomEn,
    }));
  }, [data.chercheursParEtablissement, lang]);

  // Prépare les données des structures avec label dynamique
  const structuresData = useMemo(() => {
    return (data.repartitionParStructure || []).map((item: any) => ({
      ...item,
      label: lang === 'fr' ? item.nomFr : item.nomEn,
    }));
  }, [data.repartitionParStructure, lang]);

  // Prépare les données des superviseurs avec nom + prenom concaténés
  const superviseursData = useMemo(() => {
    return (data.repartitionParSuperviseur || []).map((item: any) => ({
      ...item,
      label: `${item.superviseur.nom} ${item.superviseur?.prenom||""}`,
    }));
  }, [data.repartitionParSuperviseur]);

  // Largeurs dynamiques pour scroll horizontal si beaucoup d'éléments
  const chartWidthEtablissement = Math.min(Math.max(etablissementsData.length * 120, 600), 1500);
  const chartWidthSuperviseur = Math.min(Math.max(superviseursData.length * 80, 600), 1500);
  const chartHeightStructure = 300;

  // Cartes Statistiques
  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className={`bg-white rounded-2xl shadow-lg border border-[#F3F4F6] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 flex justify-between items-center`}>
      <div>
        <p className="text-sm font-medium text-[#6B7280] mb-1">{title}</p>
        <p className="text-3xl font-bold text-[#111827]">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6 bg-white mt-3">
      {/* Filtre par date */}
      <div className="block md:hidden mb-4 mt-5">
        <button
          onClick={toggleFilters}
          className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">{t('filtre.filtrer')}</span>
          </div>
          {isFiltersVisible ? (
            <ChevronUp className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-600" />
          )}
        </button>
      </div>

      <div className={`
          transition-all duration-300 ease-in-out md:overflow-visible
          md:block md:opacity-100 md:max-h-none relative z-50
          ${isFiltersVisible 
              ? 'block opacity-100 max-h-96 overflow-visible' 
              : 'hidden md:block opacity-0 md:opacity-100 max-h-0 md:max-h-none overflow-hidden'
          }
      `}>
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 mb-3 mt-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('label.periode')}
            </label>
            <DateRangePicker
              onDateChange={onDateChange}
              language={lang === "fr" ? "fr" : "en"}
              initialStartDate={startDate}
              initialEndDate={endDate}
            />
          </div>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading?<Skeleton height={100}/>:<StatCard
          title={t("label.total_chercheurs")}
          value={data.totalChercheurs ?? 0}
          icon={Users}
          color="from-[#6366F1] to-[#8B5CF6]"
        />}
        {isLoading?<Skeleton height={100}/>:<StatCard
          title={t("label.stages_termines")}
          value={data.totalStageRecherchesTermines ?? 0}
          icon={CheckCircle}
          color="from-[#10B981] to-[#059669]"
        />}
        {isLoading?<Skeleton height={100}/>:<StatCard
          title={t("label.chercheurs_par_superviseur")}
          value={data.moyenneChercheursParSuperviseur ?? 0}
          icon={TrendingUp}
          color="from-[#F59E0B] to-[#D97706]"
        />}
        {isLoading?<Skeleton height={100}/>:<StatCard
          title={t("label.duree_moyenne_mois")}
          value={data.dureeMoyenneStageRecherches ?? 0}
          icon={Clock}
          color="from-[#EC4899] to-[#BE185D]"
        />}
        {isLoading?<Skeleton height={100}/>:<StatCard
          title={t("label.taux_acceptation")}
          value={`${((data.tauxStatutStageRecherches?.tauxAccepte ?? 0) * 100).toFixed(1)}%`}
          icon={CheckCircle}
          color="from-[#10B981] to-[#059669]"
        />}
        {isLoading?<Skeleton height={100}/>:<StatCard
          title={t("label.taux_refus")}
          value={`${((data.tauxStatutStageRecherches?.tauxRefuse ?? 0) * 100).toFixed(1)}%`}
          icon={XCircle}
          color="from-[#EF4444] to-[#DC2626]"
        />}
      </div>

      {/* Diagramme superviseurs */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-2">{t("label.repartition_chercheur_par_superviseur")}</h3>
        {isLoading?<Skeleton height={320}/>:(superviseursData && superviseursData.length===0)?
          <NoData/>
        : <div style={{ overflowX: 'auto' }}>
          <BarChart
            width={chartWidthSuperviseur}
            height={300}
            data={superviseursData}
            margin={{ bottom: 60 }}
          >
            <XAxis dataKey="label" angle={0} textAnchor="end" interval={0} height={60} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stagesEnCours" fill="#8884d8" name={t("label.en_cours")} />
            <Bar dataKey="stagesTermines" fill="#82ca9d" name={t("label.termines")} />
          </BarChart>
        </div>}
      </div>

      {/* Diagramme par structure */}
      {/* <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-2">{t("label.repartition_par_structure")}</h3>
         {isLoading?<Skeleton height={320}/>:(structuresData && structuresData.length===0)?
          <NoData/>
        : <div className="overflow-x-auto" style={{ width: '100%' }}>
          <div
            style={{
              width: structuresData.length > 10 ? `${structuresData.length * 120}px` : '100%',
              height: chartHeightStructure,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={structuresData}
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              >
                <XAxis type="number" />
                <YAxis
                  dataKey="label"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="nombreChercheurs" fill="#8884d8" name={t("label.nombre_chercheurs")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>}
      </div> */}

      {/* Diagramme chercheurs par établissement */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-2">{t("label.repartition_chercheur_par_etablissement")}</h3>
         {isLoading?<Skeleton height={320}/>:(etablissementsData && etablissementsData.length===0)?
          <NoData/>
        : <div style={{ overflowX: 'auto' }}>
          <BarChart
            data={etablissementsData}
            width={chartWidthEtablissement}
            height={300}
            margin={{ bottom: 60 }}
          >
            <XAxis dataKey="label" angle={0} textAnchor="end" interval={0} height={60} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stagesAccepte" fill="#4caf50" name={t("label.acceptes")} />
            <Bar dataKey="stagesRefuse" fill="#f44336" name={t("label.refuses")} />
          </BarChart>
        </div>}
      </div>
    </div>
  );
};

export default RapportStageBody;
