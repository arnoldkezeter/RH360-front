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
    return (data.stagiairesParEtablissement || []).map((item: any) => ({
      ...item,
      label: lang === 'fr' ? item.etablissement.nomFr : item.etablissement.nomEn,
    }));
  }, [data.stagiairesParEtablissement, lang]);

  // Prépare les données des services avec label dynamique
  const servicesData = useMemo(() => {
    return (data.repartitionParService || []).map((item: any) => ({
      ...item,
      label: lang === 'fr' ? item.nomFr : item.nomEn,
    }));
  }, [data.repartitionParService, lang]);

  // Prépare les données des superviseurs avec nom + prenom concaténés
  const superviseursData = useMemo(() => {
    return (data.repartitionParSuperviseur || []).map((item: any) => ({
      ...item,
      label: `${item.superviseur.nom} ${item.superviseur.prenom}`,
    }));
  }, [data.repartitionParSuperviseur]);
  
  // 2. Définir une largeur minimale nécessaire par élément/barre (ex: 50-70 pixels).
  const MIN_BAR_WIDTH = 70; 
  const CHART_HEIGHT = 300;
  const MAX_CONTAINER_WIDTH = 800; // Limite optionnelle si vous ne voulez pas un graphique trop large

  // Calculer la largeur dynamique du graphique
  const getDynamicChartWidth = (data: string | any[], minWidthPerBar: number, containerMaxWidth: number) => {
      if (!data || data.length === 0) {
          return containerMaxWidth || 400; // Retourne une largeur par défaut si pas de données
      }
      
      const requiredWidth = data.length * minWidthPerBar;
      
      // S'assurer que le graphique n'est jamais plus petit que la largeur du conteneur parent (800px par défaut)
      return Math.max(containerMaxWidth || 800, requiredWidth); 
  };

  // ... À l'intérieur de votre composant React où superviseursData est disponible ...

  // Calcul de la largeur
  const chartWidthSuperviseur = getDynamicChartWidth(
      superviseursData, 
      MIN_BAR_WIDTH, 
      MAX_CONTAINER_WIDTH // 800 par exemple
  );

  // Hauteur minimale requise par élément/barre (y compris l'espacement).
const MIN_BAR_HEIGHT = 40; 
// Largeur maximale du conteneur (pour la barre de défilement)
const MAX_CONTAINER_WIDTH_SERVICE = '100%'; 
// Hauteur minimale pour que le graphique soit lisible même avec peu de données
const MIN_CHART_HEIGHT = 300; 

// Calculer la hauteur dynamique du graphique
const getDynamicChartHeight = (data: string | any[], minHeightPerBar: number, minChartHeight: number) => {
    if (!data || data.length === 0) {
        return minChartHeight;
    }
    
    // Calculer la hauteur nécessaire pour tous les éléments + une marge
    const requiredHeight = data.length * minHeightPerBar + 50; 
    
    // S'assurer que le graphique n'est jamais plus petit que la hauteur minimale
    return Math.max(minChartHeight, requiredHeight); 
};
  const chartHeightService = getDynamicChartHeight(
      servicesData, 
      MIN_BAR_HEIGHT, 
      MIN_CHART_HEIGHT
  );


  

  // Largeurs dynamiques pour scroll horizontal si beaucoup d'éléments
  const chartWidthEtablissement = Math.min(Math.max(etablissementsData.length * 120, 600), 1500);
  // const chartWidthSuperviseur = Math.min(Math.max(superviseursData.length * 80, 600), 1500);
  // const chartHeightService = 300;

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
          title={t("label.total_stagiaires")}
          value={data.totalStagiaires ?? 0}
          icon={Users}
          color="from-[#6366F1] to-[#8B5CF6]"
        />}
        {isLoading?<Skeleton height={100}/>:<StatCard
          title={t("label.stages_termines")}
          value={data.totalStagesTermines ?? 0}
          icon={CheckCircle}
          color="from-[#10B981] to-[#059669]"
        />}
        {isLoading?<Skeleton height={100}/>:<StatCard
          title={t("label.stagiaires_par_superviseur")}
          value={data.moyenneStagiairesParSuperviseur ?? 0}
          icon={TrendingUp}
          color="from-[#F59E0B] to-[#D97706]"
        />}
        {isLoading?<Skeleton height={100}/>:<StatCard
          title={t("label.duree_moyenne_mois")}
          value={data.dureeMoyenneStages ?? 0}
          icon={Clock}
          color="from-[#EC4899] to-[#BE185D]"
        />}
        {isLoading?<Skeleton height={100}/>:<StatCard
          title={t("label.taux_acceptation")}
          value={`${((data.tauxStatutStages?.tauxAccepte ?? 0) * 100).toFixed(1)}%`}
          icon={CheckCircle}
          color="from-[#10B981] to-[#059669]"
        />}
        {isLoading?<Skeleton height={100}/>:<StatCard
          title={t("label.taux_refus")}
          value={`${((data.tauxStatutStages?.tauxRefuse ?? 0) * 100).toFixed(1)}%`}
          icon={XCircle}
          color="from-[#EF4444] to-[#DC2626]"
        />}
      </div>

     {/* Diagramme superviseurs */}
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold mb-2">{t("label.repartition_par_superviseur")}</h3>
      {isLoading ? (
        <Skeleton height={CHART_HEIGHT} />
      ) : superviseursData && superviseursData.length === 0 ? (
        <NoData />
      ) : (
        // 💡 Correction 1: Le conteneur doit gérer l'overflow (déjà fait)
        <div style={{ overflowX: 'auto' }}>
          <BarChart
            // 💡 Correction 2: Utilisation de la largeur calculée dynamiquement
            width={chartWidthSuperviseur} 
            height={CHART_HEIGHT}
            data={superviseursData.map((item: { superviseur: { prenom: any; }; }) => ({ 
                ...item, 
                label: item.superviseur.prenom // Simplification de l'étiquette si elle est trop longue
            }))}
            margin={{ 
                top: 5, 
                right: 20, 
                left: 20, 
                bottom: 60 // Garder cette marge pour les étiquettes X tournées
            }}
          >
            {/* 💡 Amélioration: Rotation de l'étiquette X pour les noms longs */}
            <XAxis 
                dataKey="label" 
                angle={-30} // Rotation pour éviter le chevauchement (vous aviez 0)
                textAnchor="end" 
                interval={0} 
                height={60} 
            />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }}/>
            <Bar dataKey="totalStagesEnCours" fill="#8884d8" name={t("label.en_cours")} />
            <Bar dataKey="totalStagesTermines" fill="#82ca9d" name={t("label.termines")} />
          </BarChart>
        </div>
      )}
    </div>

      {/* Diagramme par service */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-2">{t("label.repartition_par_service")}</h3>
        {isLoading ? (
          <Skeleton height={MIN_CHART_HEIGHT} />
        ) : servicesData && servicesData.length === 0 ? (
          <NoData />
        ) : (
          // 💡 La div externe gère le débordement vertical si la hauteur dépasse l'écran
          // Cependant, dans ce cas, nous gérons le débordement via la hauteur calculée
          <div className="overflow-x-auto" style={{ width: '100%' }}>
            <div
              style={{
                // 💡 CORRECTION: Largeur toujours 100%, la hauteur devient dynamique
                width: MAX_CONTAINER_WIDTH_SERVICE, 
                height: chartHeightService, // 💡 Hauteur calculée
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={servicesData.map((item: { nomFr: any; nomEn: any; }) => ({
                      ...item,
                      // Utiliser le nom du service approprié selon la langue ou le nom par défaut
                      label: lang === 'fr' ? item.nomFr||"" : item.nomEn||"",
                  }))}
                  // Marge ajustée pour donner plus de place aux étiquettes Y (noms de services)
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }} 
                >
                  {/* XAxis affiche les valeurs numériques (nombre de stagiaires) */}
                  <XAxis type="number" /> 
                  {/* YAxis affiche les catégories (noms de services) */}
                  <YAxis
                    dataKey="label"
                    type="category"
                    // 💡 AMÉLIORATION: Augmenter la largeur de l'axe Y pour les noms longs (150-200px)
                    width={180} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="nombreStagiaires" fill="#8884d8" name={t("label.nombre_stagiaires")} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Diagramme stagiaires par établissement */}
      {/* <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-2">{t("label.repartition_par_etablissement")}</h3>
         {isLoading?<Skeleton height={320}/>:(etablissementsData && etablissementsData.length===0)?
          <NoData/>
        : <div style={{ overflowX: 'auto' }}>
          <BarChart
            data={etablissementsData}
            width={chartWidthEtablissement}
            height={300}
            margin={{ bottom: 60 }}
          >
            <XAxis dataKey="label" angle={-30} textAnchor="end" interval={0} height={60} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="acceptes" fill="#4caf50" name={t("label.acceptes")} />
            <Bar dataKey="refuses" fill="#f44336" name={t("label.refuses")} />
          </BarChart>
        </div>}
      </div> */}
    </div>
  );
};

export default RapportStageBody;
