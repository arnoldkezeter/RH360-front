import { useEffect, useState } from 'react';
import {
  getCoutsReelEtPrevu,
  getNbFormateursParType,
  getStatsParticipants,
  getTauxExecutionParAxe,
  getTauxExecutionParTheme
} from '../services/elaborations/formationAPI';

export function useFetchRapportFormationData({ programmeId, formationId }: { programmeId?: string, formationId?: string }) {
  const [data, setData] = useState<{
    tauxExecution?: any;
    statsParticipants?: any;
    statsFormateurs?: any;
    coutsFormationOuTheme?: any;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (!programmeId && !formationId) return;
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Déterminer quel service exécuter pour taux d'exécution
        const tauxExecutionPromise = formationId
          ? getTauxExecutionParTheme({ programmeId, formationId })
          : getTauxExecutionParAxe({ programmeId });

        const [tauxExecution, statsParticipants, statsFormateurs, coutsFormationOuTheme] = await Promise.all([
          tauxExecutionPromise,
          getStatsParticipants({ programmeId, formationId }),
          getNbFormateursParType({ programmeId, formationId }),
          getCoutsReelEtPrevu({ programmeId, formationId })
        ]);

        setData({
          tauxExecution,
          statsParticipants,
          statsFormateurs,
          coutsFormationOuTheme
        });
      } catch (err: any) {
        console.error('Erreur chargement dashboard:', err);
        setError(err.message || 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [programmeId, formationId]);

  return { data, isLoading, error };
}
