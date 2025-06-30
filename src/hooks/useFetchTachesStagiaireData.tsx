import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getTachesStagiaires, getTachesStagiairesStats } from '../services/stagiaires/tacheStagiaireAPI';
import { setTachesStagiaire } from '../_redux/features/stagiaire/tacheStagiaireSlice';

interface UseTachesReturnType {
  isLoading: boolean;
  taches: any[];
  stats: any;
  error: string | null;
  refresh: () => Promise<void>;
  addTache: (tache: any) => Promise<void>;
  updateTache: (tache: any) => Promise<void>;
  deleteTache: (tacheId: string) => Promise<void>;
}

export const useTachesStagiaires = ({
  page = 1,
  lang,
  stagiaireId,
  dateDebut,
  dateFin,
  statut,
  search,
}: {
  page?: number;
  lang:string;
  stagiaireId?: string;
  dateDebut?: string;
  dateFin?: string;
  statut?: string;
  search?: string;
}): UseTachesReturnType => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [taches, setTaches] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const isInitial = !statut && !search;

  const fetchData = async () => {
    if(!stagiaireId) {
        setStats({
            etatJournalier: [],
            progression:0,
            totalAbsences:0,
            totalCompletees:0,
            totalTaches:0
        })
        return
    }
    try {
      setIsLoading(true);
      const [tachesRes, statsRes] = await Promise.all([
        getTachesStagiaires({ page, lang, stagiaireId, dateDebut, dateFin, statut, search }),
        isInitial ? getTachesStagiairesStats(lang, stagiaireId, dateDebut, dateFin) : Promise.resolve(null),
      ]);

      if (tachesRes) {
        setTaches(tachesRes.tachesStagiaire || []);
        dispatch(setTachesStagiaire(tachesRes));
      } else {
        dispatch(setTachesStagiaire({
          tachesStagiaire: [],
          currentPage: 0,
          totalItems: 0,
          totalPages: 0,
          pageSize: 0,
        }));
      }
      console.log(statsRes)
      if (statsRes) {
        setStats(statsRes.statistiques);
      }
    } catch (err: any) {
      console.error('Erreur chargement des données', err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, lang, stagiaireId, dateDebut, dateFin, statut, search]);

  const refresh = async () => {
    await fetchData();
  };

  const addTache = async (tache: any) => {
    const updated = [tache, ...taches];
    setTaches(updated);
    await fetchData();
  };

  const updateTache = async (tache: any) => {
    const updated = taches.map((t) => (t._id === tache._id ? tache : t));
    setTaches(updated);
    await fetchData();
  };

  const deleteTache = async (tacheId: string) => {
    const updated = taches.filter((t) => t._id !== tacheId);
    setTaches(updated);
    await fetchData();
  };

  return {
    isLoading,
    taches,
    stats,
    error,
    refresh,
    addTache,
    updateTache,
    deleteTache,
  };
};
