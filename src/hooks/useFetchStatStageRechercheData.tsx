import { useEffect, useState } from 'react';
import { 
  getDureeMoyenneStageRecherches, 
  getMoyenneChercheursParSuperviseur, 
  getNombreChercheursParEtablissement, 
  getRepartitionChercheursParSuperviseur, 
  getTauxStatutStageRecherches, 
  getTotalChercheurs, 
  getTotalStageRecherchesTermines } from '../services/chercheurs/stageRechercheAPI';


type StatsStageRecherchesParams = {
  dateDebut: string | undefined;
  dateFin: string | undefined;
};

export function useStatsStageRecherches({ dateDebut, dateFin }: StatsStageRecherchesParams) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<{
    totalChercheurs?: number;
    totalStageRecherchesTermines?: number;
    moyenneChercheursParSuperviseur?: number;
    dureeMoyenneStageRecherches?: any;
    tauxStatutStageRecherches?: any;
    repartitionParStructure?: any;
    repartitionParSuperviseur?: any;
    chercheursParEtablissement?: any;
    chercheursParStatutEtEtablissement?: any;
  }>({});

  useEffect(() => {
    let isMounted = true;
    
    async function fetchAllStats() {
    if(!dateDebut || !dateFin) return;
      setLoading(true);
      setError(null);

      try {
        
        const [
          totalChercheurs,
          totalStageRecherchesTermines,
          moyenneChercheursParSuperviseur,
          dureeMoyenneStageRecherches,
          tauxStatutStageRecherches,
          // repartitionParStructure,
          repartitionParSuperviseur,
          chercheursParEtablissement,
        //   chercheursParStatutEtEtablissement
        ] = await Promise.all([
          getTotalChercheurs(dateDebut, dateFin),
          getTotalStageRecherchesTermines(dateDebut, dateFin),
          getMoyenneChercheursParSuperviseur(dateDebut, dateFin),
          getDureeMoyenneStageRecherches(dateDebut, dateFin),
          getTauxStatutStageRecherches(dateDebut, dateFin),
          // getRepartitionChercheursParStructure(dateDebut, dateFin),
          getRepartitionChercheursParSuperviseur(dateDebut, dateFin),
          getNombreChercheursParEtablissement(dateDebut, dateFin),
          // getNombreChercheursParStatutEtEtablissement(dateDebut, dateFin),
        ]);
        if (isMounted) {
          setData({
            totalChercheurs,
            totalStageRecherchesTermines,
            moyenneChercheursParSuperviseur,
            dureeMoyenneStageRecherches,
            tauxStatutStageRecherches,
            // repartitionParStructure,
            repartitionParSuperviseur,
            chercheursParEtablissement,
            // chercheursParStatutEtEtablissement
          });
        }
        console.log(chercheursParEtablissement)
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
