// pages/EvaluationForm.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    ChevronLeft, ChevronRight, Save, Send, AlertCircle, CheckCircle,
    Star, MessageSquare, Calendar, Code, Settings, Clock, Wifi, WifiOff, Circle,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatDate, truncateText } from '../../fonctions/fonction';
import BreadcrumbPageDescription from '../../components/BreadcrumbPageDescription';
import createToast from '../../hooks/toastify';
// CORRECTION : imports séparés — saveDraft ≠ submit
import {
    saveDraftEvaluationAChaudReponse,
    submitEvaluationAChaudReponse,
} from '../../services/evaluations/evaluationChaudReponseAPI';

const EvaluationForm = () => {
    const dispatch   = useDispatch();
    const navigate   = useNavigate();
    const { t }      = useTranslation();
    const lang       = useSelector((state: RootState) => state.setting.language);
    const user       = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
    // L'évaluation sélectionnée (enrichie avec les réponses existantes) vient du slice
    const evaluation = useSelector((state: RootState) => state.evaluationAChaudReponseSlice.selectedEvaluation);

    const [currentRubrique,    setCurrentRubrique]    = useState(0);
    const [responses,          setResponses]          = useState<Record<string, string>>({});
    const [commentaires,       setCommentaires]       = useState<Record<string, string>>({});
    const [commentaireGeneral, setCommentaireGeneral] = useState('');
    const [isSubmitting,       setIsSubmitting]       = useState(false);
    const [showValidation,     setShowValidation]     = useState(false);
    const [isDraftLoading,     setIsDraftLoading]     = useState(true);
    const [isSavingDraft,      setIsSavingDraft]      = useState(false);
    const [lastSaved,          setLastSaved]          = useState<Date | undefined>(undefined);
    const [hasUnsavedChanges,  setHasUnsavedChanges]  = useState(false);
    const [draftExists,        setDraftExists]        = useState(false);
    const [autoSaveEnabled,    setAutoSaveEnabled]    = useState(true);
    const [connectionStatus,   setConnectionStatus]   = useState(navigator.onLine);

    const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
    const lastAutoSave     = useRef<Date | null>(null);

    // Surveillance connexion
    useEffect(() => {
        const handleOnline  = () => setConnectionStatus(true);
        const handleOffline = () => setConnectionStatus(false);
        window.addEventListener('online',  handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online',  handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Pré-remplissage depuis les réponses existantes (brouillon)
    useEffect(() => {
        if (!evaluation?._id || !user?._id) {
            navigate('/evaluations/evaluation-a-chaud');
            return;
        }

        setIsDraftLoading(true);
        try {
            const formattedResponses:  Record<string, string> = {};
            const formattedComments:   Record<string, string> = {};

            for (const rubrique of evaluation.rubriques || []) {
                for (const question of rubrique.questions || []) {
                    const qId = question.questionId || question._id || '';

                    // Réponse directe
                    if (question.reponseEchelleId) {
                        formattedResponses[qId] = question.reponseEchelleId;
                    }
                    // Commentaire global
                    if (question.commentaireGlobal) {
                        formattedComments[qId] = question.commentaireGlobal;
                    }
                    // CORRECTION : sousQuestions (pas sousReponses)
                    for (const sq of question.sousQuestions || []) {
                        const sqId = sq.sousQuestionId || sq._id || '';
                        const key  = `${qId}_${sqId}`;
                        if (sq.reponseEchelleId) formattedResponses[key] = sq.reponseEchelleId;
                        if (sq.commentaire)      formattedComments[key]  = sq.commentaire;
                    }
                }
            }

            setResponses(formattedResponses);
            setCommentaires(formattedComments);
            setCommentaireGeneral(evaluation.commentaireGeneral || '');

            // Si statut brouillon ou soumis, il existe déjà une réponse
            if (evaluation.statut === 'brouillon' || evaluation.statut === 'soumis') {
                setDraftExists(true);
                if (evaluation.updatedAt) setLastSaved(new Date(evaluation.updatedAt));
            }
            setHasUnsavedChanges(false);
        } finally {
            setIsDraftLoading(false);
        }
    }, [evaluation?._id, user?._id, navigate]);

    // ── Construction du payload ────────────────────────────────────────────────
    const buildReponseData = useCallback((): EvaluationReponsePayload | null => {
        if (!evaluation || !evaluation._id || !user?._id) return null;

        return {
            utilisateur: user._id,
            modele:      evaluation._id,
            rubriques:   (evaluation.rubriques || []).map(rubrique => ({
                // CORRECTION : rubriqueId est dans rubriqueId (pas _id)
                rubriqueId: rubrique.rubriqueId || rubrique._id || '',
                questions:  (rubrique.questions || []).map(question => {
                    const qId = question.questionId || question._id || '';
                    const hasSousQ = (question.sousQuestions || []).length > 0;
                    // CORRECTION : pas de champ sousQuestions côté question modèle (ce sont les sous-questions du modèle,
                    // pas les réponses) — on reconstruit depuis le state responses
                    const sousQuestionsModel = (question as any).sousQuestionsModel || question.sousQuestions || [];

                    const qData: QuestionReponse = {
                        questionId:        qId,
                        commentaireGlobal: commentaires[qId] || '',
                    };

                    if (hasSousQ && sousQuestionsModel.length > 0) {
                        // CORRECTION : sousQuestions avec sousQuestionId (pas sousReponses)
                        qData.sousQuestions = sousQuestionsModel
                            .map((sq: any) => {
                                const sqId = sq.sousQuestionId || sq._id || '';
                                const key  = `${qId}_${sqId}`;
                                return {
                                    sousQuestionId:   sqId,
                                    reponseEchelleId: responses[key] || '',
                                    commentaire:      commentaires[key] || '',
                                };
                            })
                            .filter((sr: SousQuestionReponse) => sr.reponseEchelleId);
                    } else {
                        qData.reponseEchelleId = responses[qId] || '';
                    }

                    return qData;
                }).filter(q =>
                    q.reponseEchelleId ||
                    (q.sousQuestions && q.sousQuestions.length > 0) ||
                    q.commentaireGlobal
                ),
            })).filter(r => r.questions.length > 0),
            commentaireGeneral: commentaireGeneral || '',
        };
    }, [evaluation, user?._id, responses, commentaires, commentaireGeneral]);

    // ── Calcul de progression ─────────────────────────────────────────────────
    const calculateProgression = useCallback((): number => {
        if (!evaluation) return 0;
        let total = 0, answered = 0;
        for (const rub of evaluation.rubriques || []) {
            for (const q of rub.questions || []) {
                const hasSousQ = (q.sousQuestions || []).length > 0;
                if (hasSousQ) {
                    total    += q.sousQuestions!.length;
                    answered += q.sousQuestions!.filter(sq => {
                        const sqId = sq.sousQuestionId || sq._id || '';
                        return !!responses[`${q.questionId || q._id}_${sqId}`];
                    }).length;
                } else {
                    total += 1;
                    if (responses[q.questionId || q._id || '']) answered += 1;
                }
            }
        }
        return total > 0 ? Math.round((answered / total) * 100) : 0;
    }, [evaluation, responses]);

    // ── Sauvegarde brouillon ──────────────────────────────────────────────────
    // CORRECTION : appelle saveDraftEvaluationAChaudReponse (pas submitEvaluationAChaudReponse)
    const saveDraft = useCallback(async (showToast = false): Promise<boolean> => {
        if (!connectionStatus || isSavingDraft) return false;
        const reponseData = buildReponseData();
        if (!reponseData || Object.keys(responses).length === 0) return false;

        setIsSavingDraft(true);
        try {
            const response = await saveDraftEvaluationAChaudReponse(reponseData, lang);
            if (response.success) {
                const now = new Date();
                setLastSaved(now);
                setHasUnsavedChanges(false);
                setDraftExists(true);
                lastAutoSave.current = now;
                if (showToast) createToast(t('message.brouillon_sauvegarde'), '', 0);
                return true;
            } else {
                if (showToast) createToast(response.message, '', 2);
                return false;
            }
        } catch (error) {
            if (showToast) createToast(t('message.erreur_sauvegarde'), '', 2);
            return false;
        } finally {
            setIsSavingDraft(false);
        }
    }, [connectionStatus, isSavingDraft, buildReponseData, responses, lang, t]);

    // ── Auto-sauvegarde (30s) ─────────────────────────────────────────────────
    useEffect(() => {
        if (!autoSaveEnabled || !connectionStatus || isDraftLoading) return;
        if (autoSaveInterval.current) clearInterval(autoSaveInterval.current);

        autoSaveInterval.current = setInterval(async () => {
            if (hasUnsavedChanges && Object.keys(responses).length > 0) {
                await saveDraft(false);
            }
        }, 30000);

        return () => { if (autoSaveInterval.current) clearInterval(autoSaveInterval.current); };
    }, [autoSaveEnabled, connectionStatus, isDraftLoading, hasUnsavedChanges, responses, saveDraft]);

    // Marquer les changements non sauvegardés
    useEffect(() => {
        if (!isDraftLoading) setHasUnsavedChanges(true);
    }, [responses, commentaires, commentaireGeneral, isDraftLoading]);

    // Validation
    const validateResponses = (): Record<string, boolean> => {
        const errors: Record<string, boolean> = {};
        for (const rub of evaluation?.rubriques || []) {
            for (const q of rub.questions || []) {
                const qId    = q.questionId || q._id || '';
                const hasSousQ = (q.sousQuestions || []).length > 0;
                if (hasSousQ) {
                    for (const sq of q.sousQuestions || []) {
                        const sqId = sq.sousQuestionId || sq._id || '';
                        const key  = `${qId}_${sqId}`;
                        if (!responses[key]) errors[key] = true;
                        if ((sq as any).commentaireObligatoire && !commentaires[key]) errors[`${key}_comment`] = true;
                    }
                } else if ((q as any).echelles?.length > 0) {
                    if (!responses[qId]) errors[qId] = true;
                }
            }
        }
        return errors;
    };

    // Réponses
    const handleResponse = (questionId: string, sousQuestionId: string | null, echelleId: string) => {
        const key = sousQuestionId ? `${questionId}_${sousQuestionId}` : questionId;
        setResponses(prev => ({ ...prev, [key]: echelleId }));
    };

    const handleComment = (questionId: string, sousQuestionId: string | null, value: string) => {
        const key = sousQuestionId ? `${questionId}_${sousQuestionId}` : questionId;
        setCommentaires(prev => ({ ...prev, [key]: value }));
    };

    // Navigation
    const goToNextRubrique = () => {
        if (!evaluation) return;
        if (currentRubrique < evaluation.rubriques.length - 1) setCurrentRubrique(prev => prev + 1);
    };
    const goToPrevRubrique = () => {
        if (currentRubrique > 0) setCurrentRubrique(prev => prev - 1);
    };

    const handleManualSave = async () => {
        const success = await saveDraft(true);
        if (!success && Object.keys(responses).length === 0) {
            createToast(t('message.aucune_donnee_sauvegarder'), '', 1);
        }
    };

    // ── Soumission finale ─────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!evaluation || !evaluation._id || !user?._id) return;

        const errors = validateResponses();
        if (Object.keys(errors).length > 0) {
            setShowValidation(true);
            createToast(t('message.veuillez_completer'), '', 2);
            return;
        }

        const reponseData = buildReponseData();
        if (!reponseData) return;

        setIsSubmitting(true);
        try {
            const response = await submitEvaluationAChaudReponse(reponseData, lang);
            if (response.success) {
                createToast(response.message, '', 0);
                navigate('/evaluations/evaluation-a-chaud');
            } else {
                createToast(response.message, '', 2);
            }
        } catch (error: any) {
            createToast(error.response?.data?.message || t('message.erreur'), '', 2);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Avertissement avant fermeture
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = ''; }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // ── Composants internes ───────────────────────────────────────────────────

    const RatingScale = ({
        echelles, selectedId, onSelect, questionId, sousQuestionId,
    }: {
        echelles?: EchelleReponse[];
        selectedId?: string;
        onSelect: (questionId: string, sousQuestionId: string | null, echelleId: string) => void;
        questionId: string;
        sousQuestionId?: string | null;
    }) => (
        <div className="grid gap-3 my-4"
            style={{ gridTemplateColumns: `repeat(${echelles?.length || 1}, 1fr)` }}>
            {echelles?.map(echelle => (
                <button key={echelle._id}
                    onClick={() => onSelect(questionId, sousQuestionId || null, echelle._id || '')}
                    className={`p-4 rounded-lg border-2 transition-all text-sm ${
                        selectedId === echelle._id
                            ? 'border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8]'
                            : 'border-[#e5e7eb] hover:border-[#d1d5db] text-[#374151]'
                    }`}>
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full mb-2 ${selectedId === echelle._id ? 'bg-[#2563eb]' : 'bg-[#9ca3af]'}`} />
                        <span className="text-xs text-center font-medium">
                            {lang === 'fr' ? echelle.nomFr : echelle.nomEn}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );

    const CommentField = ({
        questionId, sousQuestionId, isRequired = false, placeholder,
    }: {
        questionId: string; sousQuestionId?: string | null; isRequired?: boolean; placeholder?: string;
    }) => {
        const key      = sousQuestionId ? `${questionId}_${sousQuestionId}` : questionId;
        const hasError = showValidation && isRequired && !commentaires[key];
        return (
            <div className="mt-3">
                <textarea value={commentaires[key] || ''}
                    onChange={e => handleComment(questionId, sousQuestionId || null, e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent ${
                        hasError ? 'border-[#f87171] bg-[#fef2f2]' : 'border-[#d1d5db]'
                    }`} />
                {hasError && (
                    <p className="text-[#ef4444] text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {t('label.commentaire_obligatoire')}
                    </p>
                )}
            </div>
        );
    };

    // ── Chargement ────────────────────────────────────────────────────────────
    if (!evaluation || isDraftLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb] mx-auto mb-4" />
                    <p className="text-[#6b7280]">{t('message.chargement_evaluation')}</p>
                </div>
            </div>
        );
    }

    // Progression
    const totalQuestions = evaluation.rubriques.reduce((total, rub) =>
        total + rub.questions.reduce((qTotal, q) =>
            qTotal + ((q.sousQuestions?.length || 0) > 0 ? q.sousQuestions!.length : 1), 0), 0);
    const answeredQuestions   = Object.keys(responses).length;
    const progressPercentage  = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    const currentRubriqueData = evaluation.rubriques[currentRubrique];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">
            <BreadcrumbPageDescription
                pageDescription={t('page_description.evaluation_a_chaud_effectuer')}
                titleColor="text-[#1e3a8a]"
                pageName={t('sub_menu.effectuer_evaluation_a_chaud')}
                breadcrumbItems={[
                    { isActive: false, name: t('sub_menu.evaluation_a_chaud'), path: '/evaluations/evaluation-a-chaud' },
                    { isActive: true,  name: t('sub_menu.effectuer_evaluation_a_chaud'), path: '#' },
                ]}
            />

            {/* Header */}
            <div className="bg-white shadow-sm border-b mt-3">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Statut connexion / sauvegarde */}
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                        <div className="flex items-center space-x-4 flex-wrap gap-2">
                            <div className={`flex items-center text-sm ${connectionStatus ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                                {connectionStatus ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
                                {connectionStatus ? t('label.en_ligne') : t('label.hors_ligne')}
                            </div>
                            {lastSaved && (
                                <div className="flex items-center text-sm text-[#6b7280]">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {t('label.derniere_sauvegarde')}: {formatDate(lastSaved.toString())}
                                </div>
                            )}
                            {isSavingDraft && (
                                <div className="flex items-center text-sm text-[#2563eb]">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2563eb] mr-2" />
                                    {t('label.sauvegarde_en_cours')}
                                </div>
                            )}
                            {hasUnsavedChanges && !isSavingDraft && (
                                <div className="flex items-center text-sm text-[#ea580c]">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {t('label.modifications_non_sauvegardees')}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center text-sm text-[#6b7280]">
                                <input type="checkbox" checked={autoSaveEnabled}
                                    onChange={e => setAutoSaveEnabled(e.target.checked)} className="mr-2" />
                                {t('label.sauvegarde_auto')}
                            </label>
                            <button onClick={handleManualSave} disabled={isSavingDraft || !connectionStatus}
                                className="flex items-center px-3 py-1 text-sm bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] disabled:bg-[#9ca3af]">
                                <Save className="h-4 w-4 mr-1" />
                                {t('button.sauvegarder')}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-[#dbeafe] p-3 rounded-full">
                                <Code className="h-6 w-6 text-[#2563eb]" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[#111827]">
                                    {lang === 'fr' ? evaluation.titreFr : evaluation.titreEn}
                                    {/* CORRECTION : statut 'soumis' (pas 'terminee') */}
                                    {evaluation.statut === 'brouillon' && (
                                        <span className="ml-2 px-2 py-1 text-xs bg-[#fed7aa] text-[#ea580c] rounded-full">
                                            {t('label.brouillon')}
                                        </span>
                                    )}
                                    {evaluation.statut === 'soumis' && (
                                        <span className="ml-2 px-2 py-1 text-xs bg-[#dcfce7] text-[#166534] rounded-full">
                                            {t('label.soumis') || 'Soumis'}
                                        </span>
                                    )}
                                </h1>
                                <p className="text-[#6b7280] text-sm mt-1">
                                    <Settings className="inline h-4 w-4 mr-1" />
                                    {lang === 'fr' ? evaluation.theme?.titreFr || '' : evaluation.theme?.titreEn || ''}
                                </p>
                                <p className="text-[#6b7280] text-sm">
                                    {lang === 'fr' ? evaluation.descriptionFr || '' : evaluation.descriptionEn || ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm text-[#6b7280] mb-2">
                            <span>{t('label.progression')}</span>
                            <span>{Math.round(progressPercentage)}% {t('label.complete')}</span>
                        </div>
                        <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                            <div className="bg-[#2563eb] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation rubriques */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {evaluation.rubriques.map((rubrique, index) => (
                            <button key={rubrique.rubriqueId || rubrique._id || index}
                                onClick={() => setCurrentRubrique(index)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    index === currentRubrique ? 'bg-[#2563eb] text-white'
                                    : index < currentRubrique ? 'bg-[#dcfce7] text-[#166534]'
                                    : 'bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]'
                                }`}>
                                {index + 1}. {truncateText(lang === 'fr' ? rubrique.titreFr || '' : rubrique.titreEn || '', 30)}
                                {index < currentRubrique && <CheckCircle className="inline h-4 w-4 ml-2" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenu rubrique */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#111827] mb-2">
                            {lang === 'fr' ? currentRubriqueData.titreFr : currentRubriqueData.titreEn}
                        </h2>
                        <div className="w-24 h-1 bg-[#2563eb] mx-auto rounded" />
                    </div>

                    <div className="space-y-8">
                        {currentRubriqueData.questions.map(question => {
                            const qId      = question.questionId || question._id || '';
                            const hasSousQ = (question.sousQuestions || []).length > 0;
                            const echelles = (question as any).echelles as EchelleReponse[] | undefined;

                            return (
                                <div key={qId} className="border-b border-[#e5e7eb] pb-8 last:border-b-0">
                                    <h3 className="text-lg font-semibold text-[#111827] mb-6">
                                        {lang === 'fr' ? (question as any).libelleFr || '' : (question as any).libelleEn || ''}
                                    </h3>

                                    {hasSousQ ? (
                                        <div className="space-y-6">
                                            {question.sousQuestions!.map(sousQuestion => {
                                                const sqId     = sousQuestion.sousQuestionId || sousQuestion._id || '';
                                                const key      = `${qId}_${sqId}`;
                                                const hasError = showValidation && !responses[key];
                                                return (
                                                    <div key={sqId} className={`p-6 rounded-lg border ${hasError ? 'border-[#fca5a5] bg-[#fef2f2]' : 'border-[#e5e7eb] bg-[#f9fafb]'}`}>
                                                        <h4 className="font-medium text-[#1f2937] mb-4">
                                                            {lang === 'fr' ? (sousQuestion as any).libelleFr : (sousQuestion as any).libelleEn}
                                                            {(sousQuestion as any).commentaireObligatoire && <span className="text-[#ef4444] ml-1">*</span>}
                                                        </h4>
                                                        {hasError && (
                                                            <div className="flex items-center text-[#dc2626] text-sm mb-3">
                                                                <AlertCircle className="h-4 w-4 mr-2" />
                                                                {t('error.selectionnez_reponse')}
                                                            </div>
                                                        )}
                                                        <RatingScale echelles={echelles} selectedId={responses[key]}
                                                            onSelect={handleResponse} questionId={qId} sousQuestionId={sqId} />
                                                        <CommentField questionId={qId} sousQuestionId={sqId}
                                                            isRequired={(sousQuestion as any).commentaireObligatoire}
                                                            placeholder={t('label.votre_commentaire')} />
                                                    </div>
                                                );
                                            })}
                                            {(question as any).commentaireGlobal && (
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-[#374151] mb-2">
                                                        <MessageSquare className="inline h-4 w-4 mr-2" />
                                                        {t('label.commentaire_general')}
                                                    </label>
                                                    <CommentField questionId={qId} placeholder={t('label.votre_commentaire_general')} />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {showValidation && !responses[qId] && echelles && echelles.length > 0 && (
                                                <div className="flex items-center text-[#dc2626] text-sm mb-3">
                                                    <AlertCircle className="h-4 w-4 mr-2" />
                                                    {t('error.selectionnez_reponse')}
                                                </div>
                                            )}
                                            {echelles && echelles.length > 0 ? (
                                                <RatingScale echelles={echelles} selectedId={responses[qId]}
                                                    onSelect={handleResponse} questionId={qId} />
                                            ) : (
                                                // Texte libre (echelles vide)
                                                <CommentField questionId={qId} placeholder={t('label.votre_reponse') || 'Votre réponse...'} />
                                            )}
                                            {(question as any).commentaireGlobal && echelles && echelles.length > 0 && (
                                                <CommentField questionId={qId} placeholder={t('label.votre_commentaire')} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Commentaire général (dernière rubrique) */}
                {currentRubrique === evaluation.rubriques.length - 1 && (
                    <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
                        <h3 className="text-lg font-semibold text-[#111827] mb-4 flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2 text-[#2563eb]" />
                            {t('label.commentaire_general_formation')}
                        </h3>
                        <textarea value={commentaireGeneral}
                            onChange={e => setCommentaireGeneral(e.target.value)}
                            placeholder={t('label.impression_generale')} rows={4}
                            className="w-full p-4 border border-[#d1d5db] rounded-lg resize-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent" />
                    </div>
                )}

                {/* Navigation bas de page */}
                <div className="flex justify-between items-center mt-8">
                    <button onClick={goToPrevRubrique} disabled={currentRubrique === 0}
                        className="flex items-center px-6 py-3 bg-[#f3f4f6] text-[#6b7280] rounded-lg hover:bg-[#e5e7eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        {t('button.precedent')}
                    </button>

                    <div className="flex items-center space-x-4">
                        <button onClick={handleManualSave} disabled={isSavingDraft || !connectionStatus}
                            className="flex items-center px-4 py-2 bg-[#f3f4f6] text-[#374151] rounded-lg hover:bg-[#e5e7eb] disabled:opacity-50 transition-all">
                            <Save className="h-4 w-4 mr-2" />
                            {isSavingDraft ? t('label.sauvegarde_en_cours') : t('button.sauvegarder')}
                        </button>

                        {currentRubrique === evaluation.rubriques.length - 1 ? (
                            <button onClick={handleSubmit} disabled={isSubmitting}
                                className="flex items-center px-6 py-3 bg-[#059669] text-white rounded-lg hover:bg-[#047857] disabled:bg-[#9ca3af] disabled:cursor-not-allowed transition-all">
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                        {t('label.soumission_en_cours')}
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 mr-2" />
                                        {t('button.soumettre_evaluation')}
                                    </>
                                )}
                            </button>
                        ) : (
                            <button onClick={goToNextRubrique}
                                className="flex items-center px-6 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-all">
                                {t('button.suivant')}
                                <ChevronRight className="h-5 w-5 ml-2" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Indicateur bas */}
                <div className="mt-6 p-4 bg-[#f9fafb] rounded-lg">
                    <div className="flex items-center justify-between text-sm text-[#6b7280] flex-wrap gap-2">
                        <div className="flex items-center space-x-4">
                            <span>{answeredQuestions}/{totalQuestions} {t('label.questions_repondues')}</span>
                            {draftExists && lastSaved && (
                                <span className="flex items-center">
                                    {autoSaveEnabled
                                        ? <CheckCircle className="h-4 w-4 mr-1 text-[#16a34a]" />
                                        : <Circle className="h-4 w-4 mr-1 text-[#6b7280]" />}
                                    {t('label.sauvegarde_automatique_activee')}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {!connectionStatus && (
                                <span className="text-[#ea580c] flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {t('label.mode_hors_ligne')}
                                </span>
                            )}
                            {hasUnsavedChanges && (
                                <span className="text-[#ea580c]">{t('label.changements_non_sauvegardes')}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal validation */}
            {showValidation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-md mx-4">
                        <div className="flex items-center mb-4">
                            <AlertCircle className="h-6 w-6 text-[#dc2626] mr-2" />
                            <h3 className="text-lg font-semibold text-[#111827]">{t('label.validation_requise')}</h3>
                        </div>
                        <p className="text-[#6b7280] mb-6">{t('error.veuillez_completer_tous_champs')}</p>
                        <div className="flex justify-end">
                            <button onClick={() => setShowValidation(false)}
                                className="px-4 py-2 bg-[#e5e7eb] text-[#374151] rounded-lg hover:bg-[#d1d5db] transition-all">
                                {t('button.fermer')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvaluationForm;