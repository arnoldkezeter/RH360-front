// hooks/useFetchRapportEvaluationAChaud.ts
import { useEffect, useState, useCallback, useRef } from 'react';
// CORRECTION : stats déplacées dans evaluationChaudAPI (plus dans evaluationChaudReponseAPI)
import {
    getCommentaires,
    getEvaluationStats,
    getResultatsByRubrique,
} from '../services/evaluations/evaluationChaudAPI';

interface UseFetchRapportEvaluationDataProps {
    evaluationId?: string;
    lang: string;
    limit?: number;
}

interface UseFetchRapportEvaluationDataReturn {
    data: RapportEvaluationData;
    isLoading: boolean;
    isLoadingCommentaires: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useFetchRapportEvaluationData({
    evaluationId,
    lang,
    limit,
}: UseFetchRapportEvaluationDataProps): UseFetchRapportEvaluationDataReturn {

    const [data,                  setData]                  = useState<RapportEvaluationData>({});
    const [isLoading,             setIsLoading]             = useState(false);
    const [isLoadingCommentaires, setIsLoadingCommentaires] = useState(false);
    const [error,                 setError]                 = useState<string | null>(null);

    const isInitialLoadDone = useRef(false);
    const previousLimit     = useRef<number | undefined>(undefined);
    const previousEvalId    = useRef<string | undefined>(undefined);
    const previousLang      = useRef<string>(lang);

    // Charge stats + rubriques + commentaires en parallèle
    const loadInitialData = useCallback(async () => {
        if (!evaluationId) {
            setError("ID d'évaluation manquant");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const [statsResult, rubriquesResult, commentairesResult] = await Promise.allSettled([
                getEvaluationStats(evaluationId, lang),
                getResultatsByRubrique(evaluationId, lang),
                getCommentaires(evaluationId, lang, limit),
            ]);

            const errors: string[] = [];
            const newData: RapportEvaluationData = {};

            if (statsResult.status === 'fulfilled') {
                newData.statsGenerals = statsResult.value;
            } else {
                console.error('Erreur stats générales:', statsResult.reason);
                errors.push('Statistiques générales');
            }

            if (rubriquesResult.status === 'fulfilled') {
                newData.rubriques = rubriquesResult.value;
            } else {
                console.error('Erreur rubriques:', rubriquesResult.reason);
                errors.push('Rubriques');
            }

            if (commentairesResult.status === 'fulfilled') {
                newData.commentaires = commentairesResult.value;
            } else {
                console.error('Erreur commentaires:', commentairesResult.reason);
                errors.push('Commentaires');
            }

            setData(newData);

            if (errors.length === 3) {
                throw new Error('Échec du chargement de toutes les données');
            }
            if (errors.length > 0) {
                setError(`Erreur partielle : ${errors.join(', ')} non chargé(s)`);
            }

            isInitialLoadDone.current = true;
            previousLimit.current     = limit;

        } catch (err: any) {
            setError(err.message || 'Erreur inconnue lors du chargement');
            setData({});
        } finally {
            setIsLoading(false);
        }
    }, [evaluationId, lang, limit]);

    // Charge uniquement les commentaires (quand limit change)
    const loadCommentaires = useCallback(async () => {
        if (!evaluationId) return;

        setIsLoadingCommentaires(true);
        setError(null);

        try {
            const commentaires = await getCommentaires(evaluationId, lang, limit);
            setData(prev => ({ ...prev, commentaires }));
            previousLimit.current = limit;
        } catch (err: any) {
            setError(`Erreur commentaires : ${err.message || 'Erreur inconnue'}`);
        } finally {
            setIsLoadingCommentaires(false);
        }
    }, [evaluationId, lang, limit]);

    // Réinitialiser si evaluationId ou lang changent
    useEffect(() => {
        if (
            previousEvalId.current !== evaluationId ||
            previousLang.current   !== lang
        ) {
            isInitialLoadDone.current = false;
            previousLimit.current     = undefined;
            previousEvalId.current    = evaluationId;
            previousLang.current      = lang;
        }
    }, [evaluationId, lang]);

    useEffect(() => {
        if (!isInitialLoadDone.current) {
            loadInitialData();
        } else if (previousLimit.current !== limit) {
            loadCommentaires();
        }
    }, [loadInitialData, loadCommentaires, limit]);

    const refetch = useCallback(async () => {
        isInitialLoadDone.current = false;
        previousLimit.current     = undefined;
        await loadInitialData();
    }, [loadInitialData]);

    return { data, isLoading, isLoadingCommentaires, error, refetch };
}