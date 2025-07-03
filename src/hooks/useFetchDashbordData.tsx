import { useEffect, useState } from 'react';
import {
  getCoutsReelEtPrevu,
  getFormationAVenir,
  getNbFormateursParType,
  getTauxExecutionParAxe,
  getTauxExecutionParMois,
} from '../services/elaborations/formationAPI';
import { getNombreStagesEnCours } from '../services/stagiaires/stageAPI';

export function useFetchDashbordData({ programmeId}: { programmeId?: string}) {
  const [data, setData] = useState<{
    tauxExecution?: any;
    statsFormateurs?: any;
    coutsFormation?: any;
    formationsAVenir?:any;
    tauxExecutionMois?:any;
    nbStageEnCours?:number;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (!programmeId) return;
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Déterminer quel service exécuter pour taux d'exécution
        

        const [tauxExecution, statsFormateurs, coutsFormation, formationsAVenir, tauxExecutionMois, nbStageEnCours] = await Promise.all([
          getTauxExecutionParAxe({ programmeId }),
          getNbFormateursParType({ programmeId}),
          getCoutsReelEtPrevu({ programmeId}),
          getFormationAVenir({programmeId}),
          getTauxExecutionParMois({programmeId}),
          getNombreStagesEnCours()
        ]);
        setData({
          tauxExecution,
          statsFormateurs,
          coutsFormation,
          formationsAVenir,
          tauxExecutionMois,
          nbStageEnCours
        });
      } catch (err: any) {
        console.error('Erreur chargement dashboard:', err);
        setError(err.message || 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [programmeId]);

  return { data, isLoading, error };
}
