// hooks/useStatsAnalyses.ts
import { useEffect, useState, useCallback } from "react";
import {
  getTauxValidationEvaluations,
  getMoyenneNiveauParBesoin,
  getEvaluationsParMois,
  getTopBesoinsAjoutes,
  getStatsParUtilisateur,
  getBesoinsFaiblesPrioritaires,
  getMotsClesInsuffisances,
  repartitionBesoinsParPoste,
  repartitionBesoinsNiveauParPoste,
} from "../services/elaborations/autoEvaluationBesoinAPI.tsx"
import { repartitionBesoinsAjoutesParPoste } from "../services/elaborations/besoinAjouteUtilisateurAPI.tsx";

export function useStatsAnalyses({lang, posteId}:{lang: string, posteId:string|undefined}) {
  

  const [data, setData] = useState<{
    tauxValidation?: any,
    moyenneParBesoin?: any,
    parMois?: any,
    topAjoutes?: any,
    statsUtilisateurs?: any,
    faibles?: any,
    motsCles?: any,
    repartitionBesoinNiveauPoste?:any,
    repartitionBesoinPoste?:any,
    repartitionCompetencePoste?:any,

  }>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        tauxValidation,
        moyenneParBesoin,
        parMois,
        topAjoutes,
        statsUtilisateurs,
        faibles,
        motsCles,
        repartitionBesoinNiveauPoste,
        repartitionBesoinPoste,
        repartitionCompetencePoste,
      ] = await Promise.all([
        getTauxValidationEvaluations(lang),
        getMoyenneNiveauParBesoin(lang),
        getEvaluationsParMois(lang),
        getTopBesoinsAjoutes(lang),
        getStatsParUtilisateur(lang),
        getBesoinsFaiblesPrioritaires(lang),
        getMotsClesInsuffisances(lang),
        repartitionBesoinsNiveauParPoste({lang, posteId}), 
        repartitionBesoinsParPoste(lang),
        repartitionBesoinsAjoutesParPoste(lang)
      ]);
      setData({
        tauxValidation,
        moyenneParBesoin,
        parMois,
        topAjoutes,
        statsUtilisateurs,
        faibles,
        motsCles,
        repartitionBesoinNiveauPoste,
        repartitionBesoinPoste,
        repartitionCompetencePoste,

      });
      console.log(faibles)
    } catch (err: any) {
      setError(err);
      console.error("Erreur lors du chargement des statistiques :", err);
    } finally {
      setLoading(false);
    }
  }, [lang, posteId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll };
}
