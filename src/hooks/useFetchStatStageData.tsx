import { useEffect, useState } from 'react';

import {
  getTotalStagiaires,
  getTotalStagesTermines,
  getMoyenneStagiairesParSuperviseur,
  getDureeMoyenneStages,
  getTauxStatutStages,
  getRepartitionStagiairesParService,
  getRepartitionStagiairesParSuperviseur,
  getNombreStagiairesParEtablissement,
  getNombreStagiairesParStatutEtEtablissement,
} from '../services/stagiaires/stageAPI'; // adapte selon ton arborescence

type StatsStagesParams = {
  dateDebut: string | undefined;
  dateFin: string | undefined;
};

export function useStatsStages({ dateDebut, dateFin }: StatsStagesParams) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<{
    totalStagiaires?: number;
    totalStagesTermines?: number;
    moyenneStagiairesParSuperviseur?: number;
    dureeMoyenneStages?: any;
    tauxStatutStages?: any;
    repartitionParService?: any;
    repartitionParSuperviseur?: any;
    stagiairesParEtablissement?: any;
    stagiairesParStatutEtEtablissement?: any;
  }>({});

  useEffect(() => {
    let isMounted = true;
    
    async function fetchAllStats() {
    if(!dateDebut || !dateFin) return;
      setLoading(true);
      setError(null);

      try {
        
        const [
          totalStagiaires,
          totalStagesTermines,
          moyenneStagiairesParSuperviseur,
          dureeMoyenneStages,
          tauxStatutStages,
          repartitionParService,
          repartitionParSuperviseur,
          stagiairesParEtablissement,
        //   stagiairesParStatutEtEtablissement
        ] = await Promise.all([
          getTotalStagiaires(dateDebut, dateFin),
          getTotalStagesTermines(dateDebut, dateFin),
          getMoyenneStagiairesParSuperviseur(dateDebut, dateFin),
          getDureeMoyenneStages(dateDebut, dateFin),
          getTauxStatutStages(dateDebut, dateFin),
          getRepartitionStagiairesParService(dateDebut, dateFin),
          getRepartitionStagiairesParSuperviseur(dateDebut, dateFin),
          getNombreStagiairesParEtablissement(dateDebut, dateFin),
          // getNombreStagiairesParStatutEtEtablissement(dateDebut, dateFin),
        ]);
        if (isMounted) {
          setData({
            totalStagiaires,
            totalStagesTermines,
            moyenneStagiairesParSuperviseur,
            dureeMoyenneStages,
            tauxStatutStages,
            repartitionParService,
            repartitionParSuperviseur,
            stagiairesParEtablissement,
            // stagiairesParStatutEtEtablissement
          });
        }
        console.log(stagiairesParEtablissement)
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAllStats();

    return () => {
      isMounted = false;
    };
  }, [dateDebut, dateFin]);

  return { loading, error, data };
}
