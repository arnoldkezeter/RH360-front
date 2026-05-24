// hooks/useEvaluationConfig.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import {
    getEvaluationConfig,
    updateEvaluationConfig,
    regenerateRubriques,
    addObjectifPersonnalise,
    removeObjectifPersonnalise,
} from '../services/evaluations/evaluationChaudAPI.tsx';

interface UseEvaluationConfigProps {
    evaluationId?: string;
    lang: string;
}

interface UseEvaluationConfigReturn {
    // Données
    rubriquesStatiques: RubriqueStatique[];
    objectifsBase: ObjectifTheme[];
    config: TemplateConfig | null;
    
    // États
    isLoading: boolean;
    isSaving: boolean;
    isRegenerating: boolean;
    error: string | null;
    
    // Actions - Configuration générale
    loadConfig: () => Promise<void>;
    updateConfig: (configData: {
        rubriquesConfig?: RubriqueConfig[];
        objectifsConfig?: ObjectifsConfig;
    }) => Promise<boolean>;
    regenerate: () => Promise<boolean>;
    
    // Actions - Rubriques
    toggleRubriqueActive: (rubriqueReference: RubriqueReference, estActive: boolean) => Promise<boolean>;
    updateRubriqueConfig: (rubriqueReference: RubriqueReference, rubriqueConfig: Partial<RubriqueConfig>) => Promise<boolean>;
    addQuestionPersonnalisee: (rubriqueReference: RubriqueReference, question: QuestionPersonnalisee) => Promise<boolean>;
    removeQuestionPersonnalisee: (rubriqueReference: RubriqueReference, questionId: string) => Promise<boolean>;
    toggleQuestionSupprimee: (rubriqueReference: RubriqueReference, questionCode: string, estSupprimee: boolean) => Promise<boolean>;
    
    // Actions - Objectifs
    updateObjectifsConfig: (objectifsConfig: Partial<ObjectifsConfig>) => Promise<boolean>;
    addObjectifPersonnaliseConfig: (objectif: ObjectifPersonnalise) => Promise<boolean>;
    removeObjectifPersonnaliseConfig: (objectifId: string) => Promise<boolean>;
    toggleObjectifBaseSupprime: (objectifId: string, estSupprime: boolean) => Promise<boolean>;
}

export function useEvaluationConfig({
    evaluationId,
    lang,
}: UseEvaluationConfigProps): UseEvaluationConfigReturn {
    const [rubriquesStatiques, setRubriquesStatiques] = useState<RubriqueStatique[]>([]);
    const [objectifsBase, setObjectifsBase] = useState<ObjectifTheme[]>([]);
    const [config, setConfig] = useState<TemplateConfig | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const isInitialized = useRef(false);
    
    // Charger la configuration
    const loadConfig = useCallback(async () => {
        if (!evaluationId) {
            setError("ID d'évaluation manquant");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await getEvaluationConfig(evaluationId, lang);
            setRubriquesStatiques(result.rubriquesStatiques);
            setObjectifsBase(result.objectifsBase);
            setConfig(result.config);
            isInitialized.current = true;
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement de la configuration');
        } finally {
            setIsLoading(false);
        }
    }, [evaluationId, lang]);
    
    // Mettre à jour la configuration
    const updateConfig = useCallback(async (configData: {
        rubriquesConfig?: RubriqueConfig[];
        objectifsConfig?: ObjectifsConfig;
    }): Promise<boolean> => {
        if (!evaluationId) return false;
        
        setIsSaving(true);
        setError(null);
        
        try {
            const result = await updateEvaluationConfig(evaluationId, configData, lang);
            if (result.success) {
                // Recharger la config pour être à jour
                await loadConfig();
                return true;
            }
            setError(result.message || 'Erreur lors de la mise à jour');
            return false;
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la mise à jour');
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [evaluationId, lang, loadConfig]);
    
    // Régénérer les rubriques
    const regenerate = useCallback(async (): Promise<boolean> => {
        if (!evaluationId) return false;
        
        setIsRegenerating(true);
        setError(null);
        
        try {
            const result = await regenerateRubriques(evaluationId, lang);
            if (result.success) {
                // Recharger la config après régénération
                await loadConfig();
                return true;
            }
            setError(result.message || 'Erreur lors de la régénération');
            return false;
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la régénération');
            return false;
        } finally {
            setIsRegenerating(false);
        }
    }, [evaluationId, lang, loadConfig]);
    
    // Actions rubriques
    const toggleRubriqueActive = useCallback(async (
        rubriqueReference: RubriqueReference,
        estActive: boolean
    ): Promise<boolean> => {
        if (!config) return false;
        
        const newRubriquesConfig = [...config.rubriquesConfig];
        const index = newRubriquesConfig.findIndex(r => r.rubriqueReference === rubriqueReference);
        
        if (index !== -1) {
            newRubriquesConfig[index] = { ...newRubriquesConfig[index], estActive };
        } else {
            newRubriquesConfig.push({
                rubriqueReference,
                estActive,
                questionsPersonnalisees: [],
                questionsSupprimees: [],
                questionsModifiees: [],
            });
        }
        
        return updateConfig({ rubriquesConfig: newRubriquesConfig });
    }, [config, updateConfig]);
    
    const updateRubriqueConfig = useCallback(async (
        rubriqueReference: RubriqueReference,
        rubriqueConfig: Partial<RubriqueConfig>
    ): Promise<boolean> => {
        if (!config) return false;
        
        const newRubriquesConfig = [...config.rubriquesConfig];
        const index = newRubriquesConfig.findIndex(r => r.rubriqueReference === rubriqueReference);
        
        if (index !== -1) {
            newRubriquesConfig[index] = { ...newRubriquesConfig[index], ...rubriqueConfig };
        } else {
            newRubriquesConfig.push({
                rubriqueReference,
                estActive: true,
                questionsPersonnalisees: [],
                questionsSupprimees: [],
                questionsModifiees: [],
                ...rubriqueConfig,
            });
        }
        
        return updateConfig({ rubriquesConfig: newRubriquesConfig });
    }, [config, updateConfig]);
    
    const addQuestionPersonnalisee = useCallback(async (
        rubriqueReference: RubriqueReference,
        question: QuestionPersonnalisee
    ): Promise<boolean> => {
        if (!config) return false;
        
        const newRubriquesConfig = [...config.rubriquesConfig];
        const index = newRubriquesConfig.findIndex(r => r.rubriqueReference === rubriqueReference);
        
        if (index !== -1) {
            newRubriquesConfig[index] = {
                ...newRubriquesConfig[index],
                questionsPersonnalisees: [...newRubriquesConfig[index].questionsPersonnalisees, question],
            };
        } else {
            newRubriquesConfig.push({
                rubriqueReference,
                estActive: true,
                questionsPersonnalisees: [question],
                questionsSupprimees: [],
                questionsModifiees: [],
            });
        }
        
        return updateConfig({ rubriquesConfig: newRubriquesConfig });
    }, [config, updateConfig]);
    
    const removeQuestionPersonnalisee = useCallback(async (
        rubriqueReference: RubriqueReference,
        questionId: string
    ): Promise<boolean> => {
        if (!config) return false;
        
        const newRubriquesConfig = [...config.rubriquesConfig];
        const index = newRubriquesConfig.findIndex(r => r.rubriqueReference === rubriqueReference);
        
        if (index !== -1) {
            newRubriquesConfig[index] = {
                ...newRubriquesConfig[index],
                questionsPersonnalisees: newRubriquesConfig[index].questionsPersonnalisees.filter(
                    q => q.id !== questionId
                ),
            };
        }
        
        return updateConfig({ rubriquesConfig: newRubriquesConfig });
    }, [config, updateConfig]);
    
    const toggleQuestionSupprimee = useCallback(async (
        rubriqueReference: RubriqueReference,
        questionCode: string,
        estSupprimee: boolean
    ): Promise<boolean> => {
        if (!config) return false;
        
        const newRubriquesConfig = [...config.rubriquesConfig];
        let rubriqueConfig = newRubriquesConfig.find(r => r.rubriqueReference === rubriqueReference);
        
        if (!rubriqueConfig) {
            rubriqueConfig = {
                rubriqueReference,
                estActive: true,
                questionsPersonnalisees: [],
                questionsSupprimees: [],
                questionsModifiees: [],
            };
            newRubriquesConfig.push(rubriqueConfig);
        }
        
        const index = newRubriquesConfig.findIndex(r => r.rubriqueReference === rubriqueReference);
        if (index !== -1) {
            if (estSupprimee) {
                if (!newRubriquesConfig[index].questionsSupprimees.includes(questionCode)) {
                    newRubriquesConfig[index].questionsSupprimees.push(questionCode);
                }
            } else {
                newRubriquesConfig[index].questionsSupprimees = newRubriquesConfig[index].questionsSupprimees.filter(
                    code => code !== questionCode
                );
            }
        }
        
        return updateConfig({ rubriquesConfig: newRubriquesConfig });
    }, [config, updateConfig]);
    
    // Actions objectifs
    const updateObjectifsConfig = useCallback(async (
        objectifsConfig: Partial<ObjectifsConfig>
    ): Promise<boolean> => {
        if (!config) return false;
        
        const newObjectifsConfig = {
            ...config.objectifsConfig,
            ...objectifsConfig,
        };
        
        return updateConfig({ objectifsConfig: newObjectifsConfig });
    }, [config, updateConfig]);
    
    const addObjectifPersonnaliseConfig = useCallback(async (
        objectif: Omit<ObjectifPersonnalise, 'id'>
    ): Promise<boolean> => {
        if (!config) return false;
        
        // ✅ Générer un ID temporaire
        const newObjectif: ObjectifPersonnalise = {
            ...objectif,
            id: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        };
        
        const newObjectifsConfig = {
            ...config.objectifsConfig,
            estActive: true,
            personnalisationAutorisee: true,
            objectifsPersonnalises: [...(config.objectifsConfig?.objectifsPersonnalises || []), newObjectif],
        };
        
        const result = await updateConfig({ objectifsConfig: newObjectifsConfig });
        if (result) {
            // Recharger pour avoir l'ID généré par le backend
            await loadConfig();
        }
        return result;
    }, [config, updateConfig, loadConfig]);
    
    const removeObjectifPersonnaliseConfig = useCallback(async (
        objectifId: string
    ): Promise<boolean> => {
        if (!evaluationId) return false;
        
        setIsSaving(true);
        setError(null);
        
        try {
            const result = await removeObjectifPersonnalise(evaluationId, objectifId, lang);
            if (result.success) {
                await loadConfig();
                return true;
            }
            setError(result.message || 'Erreur lors de la suppression');
            return false;
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la suppression');
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [evaluationId, lang, loadConfig]);
    
    const toggleObjectifBaseSupprime = useCallback(async (
        objectifId: string,
        estSupprime: boolean
    ): Promise<boolean> => {
        if (!config) return false;
        
        const currentSupprimes = config.objectifsConfig?.objectifsSupprimes || [];
        const newSupprimes = estSupprime
            ? [...currentSupprimes, objectifId]
            : currentSupprimes.filter(id => id !== objectifId);
        
        return updateObjectifsConfig({ objectifsSupprimes: newSupprimes });
    }, [config, updateObjectifsConfig]);
    
    // Initialisation
    useEffect(() => {
        if (evaluationId && !isInitialized.current) {
            loadConfig();
        }
    }, [evaluationId, loadConfig]);
    
    return {
        // Données
        rubriquesStatiques,
        objectifsBase,
        config,
        
        // États
        isLoading,
        isSaving,
        isRegenerating,
        error,
        
        // Actions générales
        loadConfig,
        updateConfig,
        regenerate,
        
        // Actions rubriques
        toggleRubriqueActive,
        updateRubriqueConfig,
        addQuestionPersonnalisee,
        removeQuestionPersonnalisee,
        toggleQuestionSupprimee,
        
        // Actions objectifs
        updateObjectifsConfig,
        addObjectifPersonnaliseConfig,
        removeObjectifPersonnaliseConfig,
        toggleObjectifBaseSupprime,
    };
}