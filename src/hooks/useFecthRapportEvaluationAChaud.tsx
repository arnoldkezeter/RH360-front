import { useEffect, useState, useCallback, useRef } from 'react';
import { getCommentaires, getEvaluationStats, getResultatsByRubrique } from '../services/evaluations/evaluationChaudReponseAPI';

// Types pour une meilleure sécurité
interface EvaluationData {
  statsGenerals?: any;
  rubriques?: any;
  commentaires?: any;
}

interface UseFetchRapportEvaluationDataProps {
  evaluationId?: string;
  lang: string;
  limit?: number;
}

interface UseFetchRapportEvaluationDataReturn {
  data: EvaluationData;
  isLoading: boolean;
  isLoadingCommentaires: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFetchRapportEvaluationData({ 
  evaluationId, 
  lang, 
  limit 
}: UseFetchRapportEvaluationDataProps): UseFetchRapportEvaluationDataReturn {
  
  const [data, setData] = useState<EvaluationData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCommentaires, setIsLoadingCommentaires] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref pour tracker si le chargement initial a été fait
  const isInitialLoadDone = useRef(false);
  const previousLimit = useRef<number | undefined>(undefined);

  // Fonction pour charger les données initiales (stats + rubriques + commentaires)
  const loadInitialData = useCallback(async () => {
    if (!evaluationId) {
      setError('ID d\'évaluation manquant');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [statsGenerals, rubriques, commentaires] = await Promise.allSettled([
        getEvaluationStats(evaluationId, lang),
        getResultatsByRubrique(evaluationId, lang),
        getCommentaires(evaluationId, lang, limit)
      ]);

      // Gestion des erreurs individuelles
      const errors: string[] = [];
      let newData: EvaluationData = {};

      if (statsGenerals.status === 'fulfilled') {
        newData.statsGenerals = statsGenerals.value;
      } else {
        console.error('Erreur stats générales:', statsGenerals.reason);
        errors.push('Statistiques générales');
      }

      if (rubriques.status === 'fulfilled') {
        newData.rubriques = rubriques.value;
      } else {
        console.error('Erreur rubriques:', rubriques.reason);
        errors.push('Rubriques');
      }

      if (commentaires.status === 'fulfilled') {
        newData.commentaires = commentaires.value;
      } else {
        console.error('Erreur commentaires:', commentaires.reason);
        errors.push('Commentaires');
      }

      setData(newData);

      // Si toutes les requêtes ont échoué
      if (errors.length === 3) {
        throw new Error('Échec du chargement de toutes les données');
      }

      // Si certaines requêtes ont échoué, afficher un avertissement
      if (errors.length > 0) {
        setError(`Erreur partielle: ${errors.join(', ')} non chargé(s)`);
      }

      isInitialLoadDone.current = true;
      previousLimit.current = limit;

    } catch (err: any) {
      console.error('Erreur chargement dashboard:', err);
      setError(err.message || 'Erreur inconnue lors du chargement');
      setData({}); // Reset data en cas d'erreur complète
    } finally {
      setIsLoading(false);
    }
  }, [evaluationId, lang, limit]);

  // Fonction pour charger uniquement les commentaires
  const loadCommentaires = useCallback(async () => {
    if (!evaluationId) {
      return;
    }

    setIsLoadingCommentaires(true);
    setError(null);

    try {
      const commentaires = await getCommentaires(evaluationId, lang, limit);
      
      setData(prevData => ({
        ...prevData,
        commentaires
      }));

      previousLimit.current = limit;

    } catch (err: any) {
      console.error('Erreur chargement commentaires:', err);
      setError(`Erreur lors du chargement des commentaires: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoadingCommentaires(false);
    }
  }, [evaluationId, lang, limit]);

  useEffect(() => {
    // Premier chargement : charger toutes les données
    if (!isInitialLoadDone.current) {
      loadInitialData();
    } 
    // Chargements suivants : si seul limit a changé, charger uniquement les commentaires
    else if (previousLimit.current !== limit) {
      loadCommentaires();
    }
  }, [loadInitialData, loadCommentaires, limit]);

  // Réinitialiser si evaluationId ou lang change
  useEffect(() => {
    if (isInitialLoadDone.current) {
      isInitialLoadDone.current = false;
      previousLimit.current = undefined;
    }
  }, [evaluationId, lang]);

  // Fonction de refetch pour permettre le rechargement manuel complet
  const refetch = useCallback(async () => {
    isInitialLoadDone.current = false;
    previousLimit.current = undefined;
    await loadInitialData();
  }, [loadInitialData]);

  return { 
    data, 
    isLoading, 
    isLoadingCommentaires,
    error, 
    refetch 
  };
}