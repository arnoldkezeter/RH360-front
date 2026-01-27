import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BookOpen, Users, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../_redux/store';
import { getFormationsUtilisateur, getThemesEnCoursParticipant, getThemesEnCoursResponsable } from '../../services/elaborations/themeFormationAPI';


// Composant StatCard
const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium opacity-90">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="bg-white bg-opacity-20 p-3 rounded-lg">
        <Icon className="w-8 h-8" />
      </div>
    </div>
  </div>
);

// Composant carte de thème
const ThemeCard = ({ theme, lang, role }: { theme: ThemeEnCours; lang: string; role: string }) => {
  const titre = lang === 'fr' ? theme.titreFr : theme.titreEn;
  const dateDebut = new Date(theme.dateDebut).toLocaleDateString(lang);
  const dateFin = new Date(theme.dateFin).toLocaleDateString(lang);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex-1 line-clamp-2">{titre}</h4>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
          role === 'responsable' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {role === 'responsable' 
            ? (lang === 'fr' ? 'Responsable' : 'Manager') 
            : (lang === 'fr' ? 'Participant' : 'Participant')}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Calendar className="w-4 h-4" />
        <span className="truncate">{dateDebut} - {dateFin}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {lang === 'fr' ? 'Progression' : 'Progress'}
          </span>
          <span className="font-semibold text-gray-800">{theme.progression}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${theme.progression}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Composant carte de formation
const FormationCard = ({ formation, lang }: { formation: FormationUtilisateur; lang: string }) => {
  const titre = lang === 'fr' ? formation.titreFr : formation.titreEn;
  const dateDebut = formation.dateDebut ? new Date(formation.dateDebut).toLocaleDateString(lang) : '-';
  const dateFin = formation.dateFin ? new Date(formation.dateFin).toLocaleDateString(lang) : '-';
  
  const getEtatColor = (etat: string) => {
    if (etat.includes('cours') || etat.includes('progress')) return 'text-green-600 bg-green-50';
    if (etat.includes('terminé') || etat.includes('completed')) return 'text-gray-600 bg-gray-50';
    return 'text-blue-600 bg-blue-50';
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex-1 line-clamp-2">{titre}</h4>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${getEtatColor(formation.etat)}`}>
          {formation.etat}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Calendar className="w-4 h-4" />
        <span className="truncate">{dateDebut} - {dateFin}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${
          formation.role === 'responsable' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {formation.role === 'responsable' 
            ? (lang === 'fr' ? 'Responsable' : 'Manager') 
            : (lang === 'fr' ? 'Participant' : 'Participant')}
        </span>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">{formation.progression}%</span>
        </div>
      </div>
    </div>
  );
};

const DashboardUser = () => {
  const { t } = useTranslation();
  const lang: string = useSelector((state: RootState) => state.setting.language) || 'fr';
  const userId: string = useSelector((state: RootState) => state.utilisateurSlice.utilisateur._id!);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [themesResponsable, setThemesResponsable] = useState<ThemeEnCours[]>([]);
  const [themesParticipant, setThemesParticipant] = useState<ThemeEnCours[]>([]);
  const [formations, setFormations] = useState<FormationUtilisateur[]>([]);
  const [activeTab, setActiveTab] = useState<'themes' | 'formations'>('themes');

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const [responsableData, participantData, formationsData] = await Promise.all([
          getThemesEnCoursResponsable({ userId, lang }),
          getThemesEnCoursParticipant({ userId, lang }),
          getFormationsUtilisateur({ userId, lang, page: 1, limit: 100 })
        ]);
        
        setThemesResponsable(responsableData.themes || []);
        setThemesParticipant(participantData.themes || []);
        setFormations(formationsData.formations || []);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(lang === 'fr' 
          ? 'Erreur lors du chargement des données' 
          : 'Error loading data'
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [userId, lang]);

  const stats = {
    totalThemes: themesResponsable.length + themesParticipant.length,
    themesResponsable: themesResponsable.length,
    themesParticipant: themesParticipant.length,
    totalFormations: formations.length,
    progressionMoyenne: themesResponsable.length + themesParticipant.length > 0
      ? Math.round(
          [...themesResponsable, ...themesParticipant].reduce((acc, t) => acc + t.progression, 0) / 
          (themesResponsable.length + themesParticipant.length)
        )
      : 0
  };

  if (error) {
    return (
      <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {lang === 'fr' ? 'Réessayer' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Skeleton height={150} />
            <Skeleton height={150} />
            <Skeleton height={150} />
            <Skeleton height={150} />
          </>
        ) : (
          <>
            <StatCard 
              title={t('label.themes_actifs')} 
              value={stats.totalThemes} 
              icon={BookOpen} 
              color="from-[#3B82F6] to-[#60A5FA]" 
            />
            <StatCard 
              title={t('label.en_tant_que_responsable')} 
              value={stats.themesResponsable} 
              icon={Users} 
              color="from-[#8B5CF6] to-[#A78BFA]" 
            />
            <StatCard 
              title={t('label.en_tant_que_participant')} 
              value={stats.themesParticipant} 
              icon={CheckCircle} 
              color="from-[#10B981] to-[#34D399]" 
            />
            <StatCard 
              title={t('label.progression_moyenne')} 
              value={`${stats.progressionMoyenne}%`} 
              icon={TrendingUp} 
              color="from-[#F59E0B] to-[#FBBF24]" 
            />
          </>
        )}
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('themes')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'themes'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                {t('label.formation_en_cours')}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('formations')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'formations'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                {t("label.toutes_mes_formations")}
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton height={120} count={3} />
            </div>
          ) : activeTab === 'themes' ? (
            <div className="space-y-6">
              {/* Thèmes responsable */}
              {themesResponsable.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    {lang === 'fr' ? 'Mes thèmes en tant que responsable' : 'My themes as manager'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themesResponsable.map(theme => (
                      <ThemeCard key={theme._id} theme={theme} lang={lang} role="responsable" />
                    ))}
                  </div>
                </div>
              )}

              {/* Thèmes participant */}
              {themesParticipant.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    {lang === 'fr' ? 'Mes thèmes en tant que participant' : 'My themes as participant'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themesParticipant.map(theme => (
                      <ThemeCard key={theme._id} theme={theme} lang={lang} role="participant" />
                    ))}
                  </div>
                </div>
              )}

              {themesResponsable.length === 0 && themesParticipant.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {t('label.aucune_formation_en_cours')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {formations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formations.map(formation => (
                    <FormationCard key={formation._id} formation={formation} lang={lang} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {t('label.aucune_formation_disponible')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;