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
} from "../services/elaborations/autoEvaluationBesoinAPI";
import { repartitionBesoinsAjoutesParPoste } from "../services/elaborations/besoinAjouteUtilisateurAPI";

// Types pour améliorer la sécurité du code
interface StatsData {
  tauxValidation?: {
    tauxValidation: number;
    valides: number;
    rejetees: number;
    enAttente: number;
    total: number;
  };
  moyenneParBesoin?: Array<{
    titreFr: string;
    titreEn: string;
    moyenneNiveau: number;
  }>;
  parMois?: {
    data: Array<{
      _id: { month: number; year: number };
      total: number;
    }>;
  };
  topAjoutes?: Array<{
    titre: string;
    count: number;
  }>;
  statsUtilisateurs?: Array<{
    utilisateurId: string;
    nom: string;
    prenom: string;
    totalEvaluations: number;
  }>;
  faibles?: {
    data: Array<{
      titre: string;
      niveau: number;
      count: number;
      postes?: Array<{ nom: string }>;
    }>;
  };
  motsCles?: Array<{
    mot: string;
    frequence: number;
  }>;
  repartitionBesoinNiveauPoste?: Array<{
    titreFr: string;
    titreEn: string;
    niveau1: number;
    niveau2: number;
    niveau3: number;
    niveau4: number;
  }>;
  repartitionBesoinPoste?: Array<{
    nomFr: string;
    nomEn: string;
    nombreBesoins: number;
  }>;
  repartitionCompetencePoste?: Array<{
    nomFr: string;
    nomEn: string;
    nombreBesoins: number;
  }>;
}

interface UseStatsAnalysesParams {
  lang: string;
  posteId?: string | undefined;
}

interface UseStatsAnalysesReturn {
  data: StatsData;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useStatsAnalyses({ 
  lang, 
  posteId 
}: UseStatsAnalysesParams): UseStatsAnalysesReturn {
  const [data, setData] = useState<StatsData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // État pour éviter les appels multiples
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const fetchAll = useCallback(async () => {
    // Éviter les appels multiples simultanés
    if (isExecuting) {
      console.log('Appel déjà en cours, ignorer...');
      return;
    }

    setIsExecuting(true);
    setLoading(true);
    setError(null);
    
    try {
      console.log('Chargement des statistiques...', { lang, posteId });
      
      // Utilisation de Promise.allSettled pour une meilleure gestion des erreurs
      const results = await Promise.allSettled([
        getTauxValidationEvaluations(lang),
        getMoyenneNiveauParBesoin(lang),
        getEvaluationsParMois(lang),
        getTopBesoinsAjoutes(lang),
        getStatsParUtilisateur(lang),
        getBesoinsFaiblesPrioritaires(lang),
        getMotsClesInsuffisances(lang),
        repartitionBesoinsNiveauParPoste({ lang, posteId }), 
        repartitionBesoinsParPoste(lang),
        repartitionBesoinsAjoutesParPoste(lang)
      ]);

      // Traitement des résultats avec gestion des erreurs individuelles
      const [
        tauxValidationResult,
        moyenneParBesoinResult,
        parMoisResult,
        topAjoutesResult,
        statsUtilisateursResult,
        faiblesResult,
        motsClesResult,
        repartitionBesoinNiveauPosteResult,
        repartitionBesoinPosteResult,
        repartitionCompetencePosteResult,
      ] = results;

      // Construction des données avec vérification de succès
      const newData: StatsData = {
        tauxValidation: tauxValidationResult.status === 'fulfilled' ? tauxValidationResult.value : undefined,
        moyenneParBesoin: moyenneParBesoinResult.status === 'fulfilled' ? moyenneParBesoinResult.value : undefined,
        parMois: parMoisResult.status === 'fulfilled' ? parMoisResult.value : undefined,
        topAjoutes: topAjoutesResult.status === 'fulfilled' ? topAjoutesResult.value : undefined,
        statsUtilisateurs: statsUtilisateursResult.status === 'fulfilled' ? statsUtilisateursResult.value : undefined,
        faibles: faiblesResult.status === 'fulfilled' ? faiblesResult.value : undefined,
        motsCles: motsClesResult.status === 'fulfilled' ? motsClesResult.value : undefined,
        repartitionBesoinNiveauPoste: repartitionBesoinNiveauPosteResult.status === 'fulfilled' ? repartitionBesoinNiveauPosteResult.value : undefined,
        repartitionBesoinPoste: repartitionBesoinPosteResult.status === 'fulfilled' ? repartitionBesoinPosteResult.value : undefined,
        repartitionCompetencePoste: repartitionCompetencePosteResult.status === 'fulfilled' ? repartitionCompetencePosteResult.value : undefined,
      };

      setData(newData);
      setHasInitialized(true);

      // Log des erreurs individuelles sans faire échouer tout le hook
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const apiNames = [
            'getTauxValidationEvaluations',
            'getMoyenneNiveauParBesoin',
            'getEvaluationsParMois',
            'getTopBesoinsAjoutes',
            'getStatsParUtilisateur',
            'getBesoinsFaiblesPrioritaires',
            'getMotsClesInsuffisances',
            'repartitionBesoinsNiveauParPoste',
            'repartitionBesoinsParPoste',
            'repartitionBesoinsAjoutesParPoste'
          ];
          console.warn(`Erreur dans ${apiNames[index]}:`, result.reason);
        }
      });


    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue lors du chargement des statistiques');
      setError(error);
      setHasInitialized(true);
      console.error("Erreur critique lors du chargement des statistiques :", error);
    } finally {
      setLoading(false);
      setIsExecuting(false);
    }
  }, [lang, posteId, isExecuting]);

  // useEffect avec contrôle d'initialisation
  useEffect(() => {
    // Ne charger que si pas encore initialisé ou si les paramètres ont changé
    if (!hasInitialized) {
      fetchAll();
    }
  }, [hasInitialized, fetchAll]);

  // useEffect séparé pour gérer les changements de paramètres après l'initialisation
  useEffect(() => {
    if (hasInitialized) {
      setHasInitialized(false); // Réinitialiser pour permettre un nouveau chargement
    }
  }, [lang, posteId]);

  // Fonction refetch qui force un nouveau chargement
  const refetch = useCallback(async () => {
    setHasInitialized(false);
    await fetchAll();
  }, [fetchAll]);

  return { 
    data, 
    loading, 
    error, 
    refetch 
  };
}