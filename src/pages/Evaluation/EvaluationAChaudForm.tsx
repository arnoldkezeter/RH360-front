import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Save, Send, AlertCircle, CheckCircle, Star, MessageSquare, User, Calendar, BookOpen, Code, Settings, Clock, Wifi, WifiOff, Trash2, Circle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatDate, truncateText } from '../../fonctions/fonction';
import BreadcrumbPageDescription from '../../components/BreadcrumbPageDescription';
import createToast from '../../hooks/toastify';
import { submitEvaluationAChaudReponse } from '../../services/evaluations/evaluationChaudReponseAPI';



const EvaluationForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language);
    const user = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
    const evaluation = useSelector((state: RootState) => state.evaluationAChaudReponseSlice.selectedEvaluation);
    
    // États existants
    const [currentRubrique, setCurrentRubrique] = useState(0);
    const [responses, setResponses] = useState<Record<string, string>>({});
    const [commentaires, setCommentaires] = useState<Record<string, string>>({});
    const [commentaireGeneral, setCommentaireGeneral] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    
    // Nouveaux états pour le système de brouillon
    const [isDraftLoading, setIsDraftLoading] = useState(true);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [draftExists, setDraftExists] = useState(false);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState(navigator.onLine);
    
    // Références pour la sauvegarde automatique
    const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
    const lastAutoSave = useRef<Date | null>(null);

    // Surveillance de la connexion internet
    useEffect(() => {
        const handleOnline = () => setConnectionStatus(true);
        const handleOffline = () => setConnectionStatus(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Chargement du brouillon au démarrage
    useEffect(() => {
        const loadDraft = async () => {
            if (!evaluation?._id || !user?._id) {
                navigate('/evaluations/evaluation-a-chaud');
                return;
            }

            setIsDraftLoading(true);
            try {
                // Convertir le brouillon en format du formulaire
                const formattedResponses: Record<string, string> = {};
                const formattedComments: Record<string, string> = {};
                
                evaluation.rubriques.forEach((rubrique) => {
                    rubrique.questions.forEach((question) => {
                        if (question.reponseEchelleId && question._id) {
                            formattedResponses[question._id] = question.reponseEchelleId;
                        }
                        if (question.commentaireGlobal && question._id) {
                            formattedComments[question._id] = question.commentaireGlobal;
                        }
                        if (question.sousQuestions && question.sousQuestions.length > 0) {
                            question.sousQuestions.forEach((sr) => {
                                const key = `${question._id}_${sr._id}`;
                                if (sr.reponseEchelleId) {
                                    formattedResponses[key] = sr.reponseEchelleId;
                                }
                                if (sr.commentaire) {
                                    formattedComments[key] = sr.commentaire;
                                }
                            });
                        }
                    });
                });
               

                setResponses(formattedResponses);
                setCommentaires(formattedComments);
                setCommentaireGeneral(evaluation.commentaireGeneral || '');
                setDraftExists(true);
                if (evaluation.updatedAt) {
                    setLastSaved(new Date(evaluation.updatedAt));
                }
                setHasUnsavedChanges(false);
                
                
            } catch (error) {
                setDraftExists(false);
            } finally {
                setIsDraftLoading(false);
            }
        };

        loadDraft();
    }, [evaluation?._id, user?._id, lang, navigate, t]);

    // Construction des données de réponse
    const buildReponseData = useCallback(() => {
        if (!evaluation || !evaluation._id || !user?._id) return null;

        const data = {
            utilisateur: user._id,
            modele: evaluation._id,
            rubriques: evaluation.rubriques.map((rubrique) => ({
                rubriqueId: rubrique._id || "",
                questions: rubrique.questions.map(question => {
                    const questionReponse: any = {
                        questionId: question._id || "",
                        commentaireGlobal: commentaires[question._id || ""] || undefined
                    };

                    if (question.sousQuestions && question.sousQuestions.length > 0) {
                        questionReponse.sousQuestions = question.sousQuestions.map((sq) => ({
                            sousQuestionId: sq._id || "",
                            reponseEchelleId: responses[`${question._id}_${sq._id}`] || undefined,
                            commentaire: commentaires[`${question._id}_${sq._id}`] || undefined
                        })).filter((sr: any) => sr.reponseEchelleId);
                        
                        // Ne pas inclure reponseEchelleId pour les questions avec sous-questions
                        questionReponse.reponseEchelleId = undefined;
                    } else {
                        questionReponse.reponseEchelleId = responses[question._id || ""] || undefined;
                        questionReponse.sousQuestions = undefined;
                    }

                    return questionReponse;
                }).filter((q: any) => q.reponseEchelleId || (q.sousQuestions && q.sousQuestions.length > 0) || q.commentaireGlobal)
            })).filter((r: any) => r.questions.length > 0),
            commentaireGeneral: commentaireGeneral || undefined,
            progression: calculateProgression()
        };

        return data;
    }, [evaluation, user?._id, responses, commentaires, commentaireGeneral]);

    // Calcul de la progression
    const calculateProgression = useCallback(() => {
        if (!evaluation) return 0;
        
        const totalQuestions = evaluation.rubriques.reduce((total,rubrique) => {
            return total + rubrique.questions.reduce((qTotal, question) => {
                return qTotal + (question.sousQuestions && question.sousQuestions.length > 0 ? question.sousQuestions.length : 1);
            }, 0);
        }, 0);

        const answeredQuestions = Object.keys(responses).length;
        return Math.round((answeredQuestions / totalQuestions) * 100);
    }, [evaluation, responses]);

    // Sauvegarde manuelle du brouillon
    const saveDraft = useCallback(async (showToast = false) => {
        if (!connectionStatus || isSavingDraft) return false;

        const reponseData = buildReponseData();
        if (!reponseData || Object.keys(responses).length === 0) return false;

        setIsSavingDraft(true);
        try {
            // Simulation de sauvegarde - remplacez par votre API
            const response = await submitEvaluationAChaudReponse(reponseData, lang);
            
            const now = new Date();
            setLastSaved(now);
            setHasUnsavedChanges(false);
            setDraftExists(true);
            lastAutoSave.current = now;
            
            if (showToast) {
                createToast(t('message.brouillon_sauvegarde'), '', 0);
            }
            return true;
            
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            if (showToast) {
                createToast(t('message.erreur_sauvegarde'), '', 2);
            }
        } finally {
            setIsSavingDraft(false);
        }
        return false;
    }, [connectionStatus, isSavingDraft, buildReponseData, responses, t]);
    
    // Sauvegarde automatique
    useEffect(() => {
        if (!autoSaveEnabled || !connectionStatus || isDraftLoading) return;

        // Nettoyer l'interval précédent
        if (autoSaveInterval.current) {
            clearInterval(autoSaveInterval.current);
        }

        // Nouveau timer de sauvegarde automatique
        autoSaveInterval.current = setInterval(async () => {
            if (hasUnsavedChanges && Object.keys(responses).length > 0) {
                await saveDraft(false);
            }
        }, 5000); // 30 secondes

        return () => {
            if (autoSaveInterval.current) {
                clearInterval(autoSaveInterval.current);
            }
        };
    }, [autoSaveEnabled, connectionStatus, isDraftLoading, hasUnsavedChanges, responses, saveDraft]);

    // Marquer les changements non sauvegardés
    useEffect(() => {
        if (!isDraftLoading) {
            setHasUnsavedChanges(true);
        }
    }, [responses, commentaires, commentaireGeneral, isDraftLoading]);

    // Validation des réponses
    const validateResponses = (): Record<string, boolean> => {
        const errors: Record<string, boolean> = {};
        
        evaluation?.rubriques.forEach((rubrique) => {
            rubrique.questions.forEach(question => {
                if (question.sousQuestions && question.sousQuestions.length > 0) {
                    question.sousQuestions.forEach((sousQuestion) => {
                        const key = `${question._id}_${sousQuestion._id}`;
                        if (!responses[key]) {
                            errors[key] = true;
                        }
                        if (sousQuestion.commentaireObligatoire && !commentaires[key]) {
                            errors[`${key}_comment`] = true;
                        }
                    });
                } else {
                    if (!responses[question._id || ""]) {
                        errors[question._id || ""] = true;
                    }
                }
            });
        });
        
        return errors;
    };

    const validateReponseData = (data: any): boolean => {
        return data.rubriques.every((rubrique: any) => 
            rubrique.questions.every((question: any) => {
                if (question.sousQuestions && question.sousQuestions.length > 0) {
                    return question.sousQuestions.every((sr: any) => sr.reponseEchelleId);
                } else {
                    return !!question.reponseEchelleId;
                }
            })
        );
    };

    // Gestion des réponses
    const handleResponse = (questionId: string, sousQuestionId: string | null, echelleId: string) => {
        const key = sousQuestionId ? `${questionId}_${sousQuestionId}` : questionId;
        console.log("key === "+`${questionId}_${sousQuestionId}`)
        setResponses(prev => ({
            ...prev,
            [key]: echelleId
        }));
    };

    const handleComment = (questionId: string, sousQuestionId: string | null, value: string) => {
        const key = sousQuestionId ? `${questionId}_${sousQuestionId}` : questionId;
        setCommentaires(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Navigation
    const goToNextRubrique = () => {
        if (!evaluation) return;
        if (currentRubrique < evaluation.rubriques.length - 1) {
            setCurrentRubrique(currentRubrique + 1);
        }
    };

    const goToPrevRubrique = () => {
        if (currentRubrique > 0) {
            setCurrentRubrique(currentRubrique - 1);
        }
    };

    // Sauvegarde manuelle avec toast
    const handleManualSave = async () => {
        const success = await saveDraft(true);
        if (!success && Object.keys(responses).length === 0) {
            createToast(t('message.aucune_donnee_sauvegarder'), '', 1);
        }
    };

    // Soumission finale
    const handleSubmit = async () => {
        if (!evaluation || !evaluation._id || !user?._id) return;

        const reponseData = buildReponseData();
        if (!reponseData) return;

        const errors = validateResponses();
        if (Object.keys(errors).length > 0) {
            setShowValidation(true);
            createToast(t('message.veuillez_completer'), '', 2);
            return;
        }

        if (!validateReponseData(reponseData)) {
            setShowValidation(true);
            createToast(t('message.donnees_invalides'), '', 2);
            return;
        }

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

    // Gestion de la fermeture de page avec données non sauvegardées
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // Écran de chargement
    if (!evaluation || isDraftLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
                    <p className="text-[#6B7280]">{t('message.chargement_evaluation')}</p>
                </div>
            </div>
        );
    }

    // Calcul de progression
    const totalQuestions = evaluation.rubriques.reduce((total,rubrique) => {
        return total + rubrique.questions.reduce((qTotal, question) => {
            return qTotal + (question.sousQuestions && question.sousQuestions.length > 0 ? question.sousQuestions.length : 1);
        }, 0);
    }, 0);

    const answeredQuestions = Object.keys(responses).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;

    const RatingScale = ({ echelles, selectedId, onSelect, questionId, sousQuestionId }: {
        echelles: EchelleReponse[] | undefined;
        selectedId?: string;
        onSelect: (questionId: string, sousQuestionId: string | null, echelleId: string) => void;
        questionId: string;
        sousQuestionId?: string | null;
    }) => (
        
        <div className="grid gap-3 my-4" style={{ gridTemplateColumns: `repeat(${echelles?.length || 0}, 1fr)` }}>
            {echelles && echelles.map((echelle) => (
                
                <button
                    key={echelle._id}
                    onClick={() => {onSelect(questionId, sousQuestionId || null, echelle._id || "")}}
                    className={`p-4 rounded-lg border-2 transition-all text-sm ${
                        selectedId === echelle._id
                            ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                            : 'border-[#E5E7EB] hover:border-[#D1D5DB] text-[#374151]'
                    }`}
                >
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full mb-2 ${
                            selectedId === echelle._id ? 'bg-[#2563EB]' : 'bg-[#9CA3AF]'
                        }`}></div>
                        <span className="text-xs text-center font-medium">
                            {lang === 'fr' ? echelle.nomFr : echelle.nomEn}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );

    const CommentField = ({ questionId, sousQuestionId, isRequired = false, placeholder }: {
        questionId: string;
        sousQuestionId?: string | null;
        isRequired?: boolean;
        placeholder?: string;
    }) => {
        const key = sousQuestionId ? `${questionId}_${sousQuestionId}` : questionId;
        const hasError = showValidation && isRequired && !commentaires[key];
        
        return (
            <div className="mt-3">
                <textarea
                    value={commentaires[key] || ''}
                    onChange={(e) => handleComment(questionId, sousQuestionId || null, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent ${
                        hasError ? 'border-[#F87171] bg-[#FEF2F2]' : 'border-[#D1D5DB]'
                    }`}
                    rows={3}
                />
                {hasError && (
                    <p className="text-[#EF4444] text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {t('label.commentaire_obligatoire')}
                    </p>
                )}
            </div>
        );
    };

    const currentRubriqueData = evaluation.rubriques[currentRubrique];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE]">
            <BreadcrumbPageDescription 
                pageDescription={t('page_description.evaluation_a_chaud_effectuer')} 
                titleColor="text-[#1e3a8a]" 
                pageName={t('sub_menu.effectuer_evaluation_a_chaud')} 
                breadcrumbItems={[{
                    isActive: false,
                    name: t('sub_menu.evaluation_a_chaud'),
                    path: "/evaluations/evaluation-a-chaud"
                },{
                    isActive: true,
                    name: t('sub_menu.effectuer_evaluation_a_chaud'),
                    path: "#"
                }]}
            />

            {/* Header avec statut de sauvegarde */}
            <div className="bg-[#FFFFFF] shadow-sm border-b mt-3">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Statut de connexion et sauvegarde */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center text-sm ${connectionStatus ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                                {connectionStatus ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
                                {connectionStatus ? t('label.en_ligne') : t('label.hors_ligne')}
                            </div>
                            
                            {lastSaved && (
                                <div className="flex items-center text-sm text-[#6B7280]">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {t('label.derniere_sauvegarde')}: {formatDate(lastSaved.toString())}
                                </div>
                            )}
                            
                            {isSavingDraft && (
                                <div className="flex items-center text-sm text-[#2563EB]">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2563EB] mr-2"></div>
                                    {t('label.sauvegarde_en_cours')}
                                </div>
                            )}
                            
                            {hasUnsavedChanges && !isSavingDraft && (
                                <div className="flex items-center text-sm text-[#EA580C]">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {t('label.modifications_non_sauvegardees')}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center text-sm text-[#6B7280]">
                                <input
                                    type="checkbox"
                                    checked={autoSaveEnabled}
                                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                                    className="mr-2"
                                />
                                {t('label.sauvegarde_auto')}
                            </label>
                            
                            <button
                                onClick={handleManualSave}
                                disabled={isSavingDraft || !connectionStatus}
                                className="flex items-center px-3 py-1 text-sm bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] disabled:bg-[#9CA3AF]"
                            >
                                <Save className="h-4 w-4 mr-1" />
                                {t('button.sauvegarder')}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-[#DBEAFE] p-3 rounded-full">
                                <Code className="h-6 w-6 text-[#2563EB]" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[#111827]">
                                    {lang === 'fr' ? evaluation.titreFr : evaluation.titreEn}
                                    {draftExists && (
                                        <span className="ml-2 px-2 py-1 text-xs bg-[#FED7AA] text-[#EA580C] rounded-full">
                                            {t('label.brouillon')}
                                        </span>
                                    )}
                                </h1>
                                <p className="text-[#6B7280] text-sm mt-1">
                                    <Settings className="inline h-4 w-4 mr-1" />
                                    {lang === 'fr' ? evaluation?.theme?.titreFr || "" : evaluation?.theme?.titreEn || ""}
                                </p>
                                <p className="text-[#6B7280] text-sm">
                                    {lang === 'fr' ? evaluation?.descriptionFr || "" : evaluation?.descriptionEn || ""}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm text-[#6B7280] mb-2">
                            <span>{t('label.progression')}</span>
                            <span>{Math.round(progressPercentage)}% {t('label.complete')}</span>
                        </div>
                        <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                            <div 
                                className="bg-[#2563EB] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation des rubriques */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {evaluation.rubriques.map((rubrique, index) => (
                            <button
                                key={rubrique._id}
                                onClick={() => setCurrentRubrique(index)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    index === currentRubrique
                                        ? 'bg-[#2563EB] text-[#FFFFFF]'
                                        : index < currentRubrique
                                        ? 'bg-[#DCFCE7] text-[#166534]'
                                        : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                                }`}
                            >
                                {index + 1}. {truncateText(lang === 'fr' ? rubrique?.titreFr || "" : rubrique?.titreEn || "", 30)}
                                {index < currentRubrique && (
                                    <CheckCircle className="inline h-4 w-4 ml-2" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenu de la rubrique */}
                <div className="bg-[#FFFFFF] rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#111827] mb-2">
                            {lang === 'fr' ? currentRubriqueData.titreFr : currentRubriqueData.titreEn}
                        </h2>
                        <div className="w-24 h-1 bg-[#2563EB] mx-auto rounded"></div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-8">
                        {currentRubriqueData.questions.map((question) => (
                            <div key={question._id} className="border-b border-[#E5E7EB] pb-8 last:border-b-0">
                                <h3 className="text-lg font-semibold text-[#111827] mb-6">
                                    {lang === 'fr' ? question?.libelleFr || "" : question?.libelleEn || ""}
                                </h3>

                                {question.sousQuestions && question.sousQuestions.length > 0 ? (
                                    // Question avec sous-questions
                                    <div className="space-y-6">
                                        {question.sousQuestions.map((sousQuestion) => {
                                            const key = `${question._id}_${sousQuestion._id}`;
                                            const hasError = showValidation && !responses[key];
                                            return (
                                                <div key={sousQuestion._id} className={`p-6 rounded-lg border ${
                                                    hasError ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-[#E5E7EB] bg-[#F9FAFB]'
                                                }`}>
                                                    <h4 className="font-medium text-[#1F2937] mb-4">
                                                        {lang === 'fr' ? sousQuestion.libelleFr : sousQuestion.libelleEn}
                                                        {sousQuestion.commentaireObligatoire && (
                                                            <span className="text-[#EF4444] ml-1">*</span>
                                                        )}
                                                    </h4>
                                                    
                                                    {hasError && (
                                                        <div className="flex items-center text-[#DC2626] text-sm mb-3">
                                                            <AlertCircle className="h-4 w-4 mr-2" />
                                                            {t('error.selectionnez_reponse')}
                                                        </div>
                                                    )}

                                                    <RatingScale
                                                        echelles={question.echelles}
                                                        selectedId={responses[key]}
                                                        onSelect={handleResponse}
                                                        questionId={question._id || ""}
                                                        sousQuestionId={sousQuestion._id}
                                                    />

                                                    <CommentField
                                                        questionId={question._id || ""}
                                                        sousQuestionId={sousQuestion._id}
                                                        isRequired={sousQuestion.commentaireObligatoire}
                                                        placeholder={t('label.votre_commentaire')}
                                                    />
                                                </div>
                                            );
                                        })}

                                        {/* Commentaire global pour la question */}
                                        {question.commentaireGlobal && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-[#374151] mb-2">
                                                    <MessageSquare className="inline h-4 w-4 mr-2" />
                                                    {t('label.commentaire_general')}
                                                </label>
                                                <CommentField
                                                    questionId={question._id || ""}
                                                    placeholder={t('label.votre_commentaire_general')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Question simple
                                    <div>
                                        
                                        {showValidation && !responses[question._id || ""] && (
                                            <div className="flex items-center text-[#DC2626] text-sm mb-3">
                                                <AlertCircle className="h-4 w-4 mr-2" />
                                                {t('error.selectionnez_reponse')}
                                            </div>
                                        )}

                                        <RatingScale
                                            echelles={question.echelles}
                                            selectedId={responses[question._id || ""]}
                                            onSelect={handleResponse}
                                            questionId={question._id || ""}
                                        />

                                        {question.commentaireGlobal && (
                                            <CommentField
                                                questionId={question._id || ""}
                                                placeholder={t('label.votre_commentaire')}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Commentaire général (dernière rubrique) */}
                {currentRubrique === evaluation.rubriques.length - 1 && (
                    <div className="bg-[#FFFFFF] rounded-xl shadow-lg p-8 mt-6">
                        <h3 className="text-lg font-semibold text-[#111827] mb-4 flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2 text-[#2563EB]" />
                            {t('label.commentaire_general_formation')}
                        </h3>
                        <textarea
                            value={commentaireGeneral}
                            onChange={(e) => setCommentaireGeneral(e.target.value)}
                            placeholder={t('label.impression_generale')}
                            className="w-full p-4 border border-[#D1D5DB] rounded-lg resize-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                            rows={4}
                        />
                    </div>
                )}

                {/* Boutons de navigation */}
                <div className="flex justify-between items-center mt-8">
                    <button
                        onClick={goToPrevRubrique}
                        disabled={currentRubrique === 0}
                        className="flex items-center px-6 py-3 bg-[#F3F4F6] text-[#6B7280] rounded-lg hover:bg-[#E5E7EB] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        {t('button.precedent')}
                    </button>

                    <div className="flex items-center space-x-4">
                        {/* Bouton de sauvegarde manuel supplémentaire */}
                        <button
                            onClick={handleManualSave}
                            disabled={isSavingDraft || !connectionStatus}
                            className="flex items-center px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-lg hover:bg-[#E5E7EB] disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF] transition-all"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isSavingDraft ? t('label.sauvegarde_en_cours') : t('button.sauvegarder')}
                        </button>

                        {currentRubrique === evaluation.rubriques.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center px-6 py-3 bg-[#059669] text-[#FFFFFF] rounded-lg hover:bg-[#047857] disabled:bg-[#9CA3AF] disabled:cursor-not-allowed transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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
                            <button
                                onClick={goToNextRubrique}
                                className="flex items-center px-6 py-3 bg-[#2563EB] text-[#FFFFFF] rounded-lg hover:bg-[#1D4ED8] transition-all"
                            >
                                {t('button.suivant')}
                                <ChevronRight className="h-5 w-5 ml-2" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Indicateur de statut en bas */}
                <div className="mt-6 p-4 bg-[#F9FAFB] rounded-lg">
                    <div className="flex items-center justify-between text-sm text-[#6B7280]">
                        <div className="flex items-center space-x-4">
                            <span>
                                {answeredQuestions}/{totalQuestions} {t('label.questions_repondues')}
                            </span>
                            {draftExists && lastSaved && (
                                <span className="flex items-center">
                                    {autoSaveEnabled?<CheckCircle className="h-4 w-4 mr-1 text-[#16A34A]" />
                                        :<Circle className="h-4 w-4 mr-1 text-[#16A34A]" />}
                                    {t('label.sauvegarde_automatique_activee')}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            {!connectionStatus && (
                                <span className="text-[#EA580C] flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {t('label.mode_hors_ligne')}
                                </span>
                            )}
                            
                            {hasUnsavedChanges && (
                                <span className="text-[#EA580C]">
                                    {t('label.changements_non_sauvegardes')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmation si nécessaire */}
            {showValidation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-md mx-4">
                        <div className="flex items-center mb-4">
                            <AlertCircle className="h-6 w-6 text-[#DC2626] mr-2" />
                            <h3 className="text-lg font-semibold text-[#111827]">
                                {t('label.validation_requise')}
                            </h3>
                        </div>
                        <p className="text-[#6B7280] mb-6">
                            {t('error.veuillez_completer_tous_champs')}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowValidation(false)}
                                className="px-4 py-2 bg-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#D1D5DB] transition-all"
                            >
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