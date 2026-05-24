interface SousQuestionReponse {
    _id?: string;
    sousQuestionId: string;
    reponseEchelleId: string;
    commentaire?: string;
    // Champs optionnels pour l'affichage côté frontend (enrichissement)
    commentaireObligatoire?: boolean;
    libelleFr?: string;
    libelleEn?: string;
}

/**
 * Réponse à une question.
 * CORRECTION : sousQuestions (pas sousReponses) — aligné avec le modèle backend
 */
interface QuestionReponse {
    _id?: string;
    questionId: string;
    reponseEchelleId?: string;
    sousQuestions?: SousQuestionReponse[]; // CORRECTION : était sousReponses dans l'ancien système
    commentaireGlobal?: string;
    // Champs optionnels pour l'affichage
    libelleFr?: string;
    libelleEn?: string;
    echelles?: EchelleReponse[];
}

interface RubriqueReponse {
    _id?: string;
    rubriqueId: string;
    titreFr?: string;
    titreEn?: string;
    questions: QuestionReponse[];
}

/**
 * Réponse complète d'un utilisateur à une évaluation.
 * CORRECTION : statut 'soumis' (pas 'terminee')
 */
interface EvaluationAChaudReponse {
    _id?: string;
    utilisateur: string;
    modele: string;
    // Champs enrichis (retournés par getEvaluationsChaudByUtilisateur)
    titreFr?: string;
    titreEn?: string;
    descriptionFr?: string;
    descriptionEn?: string;
    theme?: ThemeFormation;
    rubriques: RubriqueReponse[];
    commentaireGeneral?: string;
    dateSoumission?: Date;
    statut: 'brouillon' | 'soumis'; // CORRECTION : 'terminee' → 'soumis'
    progression: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface EvaluationAChaudReponseInitialData {
    data: {
        evaluationChauds: EvaluationAChaudReponse[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedEvaluation: EvaluationAChaudReponse | undefined;
}

interface CreateEvaluationAChaudReponsePayload { 
    evaluationAChaudReponse: EvaluationAChaudReponse; 
}
interface UpdateEvaluationAChaudReponsePayload { id: string; evaluationAChaudReponseData: Partial<EvaluationAChaudReponse>; }
interface DeleteEvaluationAChaudReponsePayload { id: string; }
interface EvaluationAChaudReponseReturnGetType {
    evaluationChauds: EvaluationAChaudReponse[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

interface EvaluationReponsePayload {
    utilisateur: string;
    modele: string;
    rubriques: RubriqueReponse[];
    commentaireGeneral?: string;
}
