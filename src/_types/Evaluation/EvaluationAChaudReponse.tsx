// Interface pour les réponses aux sous-questions
interface SousQuestionReponse {
  _id?:string;
  sousQuestionId: string; // ObjectId de la sous-question
  reponseEchelleId: string; // ObjectId de la valeur d'échelle sélectionnée
  commentaire?: string;
  commentaireObligatoire?:boolean;
  libelleFr?:string;
  libelleEn?:string;
}

// Interface pour les réponses aux questions
interface QuestionReponse {
  _id?:string;
  questionId: string; // ObjectId de la question
  reponseEchelleId?: string; // ObjectId de la valeur d'échelle (si pas de sous-question)
  sousQuestions?: SousQuestionReponse[]; // ✅ Optionnel car peut être un tableau vide
  commentaireGlobal?: string;
  libelleFr?:string;
  libelleEn?:string;
  echelles?:EchelleReponse[];
}

// Interface pour les réponses aux rubriques
interface RubriqueReponse {
  _id?:string;
  rubriqueId: string; // ObjectId de la rubrique
  titreFr?:string;
  titreEn?:string;
  questions: QuestionReponse[];
}

// Interface principale pour la réponse à l'évaluation à chaud
interface EvaluationAChaudReponse {
  _id?: string;
  utilisateur: string;
  modele: string;
  titreFr?:string;
  titreEn?:string;
  descriptionFr?:string;
  descriptionEn?:string;
  theme?:ThemeFormation,
  rubriques: RubriqueReponse[];
  commentaireGeneral?: string;
  dateSoumission?: Date;
  statut: 'brouillon' | 'terminee';
  dateFinition?: Date;
  progression: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DraftSummary {
  id: string;
  evaluation: {
    id: string;
    titre: string;
    theme: string;
  };
  progression: number;
  derniereSauvegarde: Date;
}

// Interface pour les données de création (sans les champs auto-générés)
interface CreateEvaluationAChaudReponse {
  utilisateur: string;
  modele: string;
  rubriques: RubriqueReponse[];
  commentaireGeneral?: string;
}

// Interface pour les données de mise à jour
interface UpdateEvaluationAChaudReponse {
  rubriques?: RubriqueReponse[];
  commentaireGeneral?: string;
}

interface EvaluationAChaudReponseInitialData {
    data: {
        evaluationChauds: EvaluationAChaudReponse[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedEvaluation:EvaluationAChaudReponse | undefined
}


interface CreateEvaluationAChaudReponsePayload {
    evaluationAChaudReponse: EvaluationAChaudReponse; // Données de l'événement à créer
}

interface UpdateEvaluationAChaudReponsePayload {
    id: string; // ID de l'événement à mettre à jour
    evaluationAChaudReponseData: Partial<EvaluationAChaudReponse>; // Données mises à jour de l'événement
}

interface DeleteEvaluationAChaudReponsePayload {
    id: string; // ID de l'événement à supprimer
}

interface EvaluationAChaudReponseReturnGetType {
    evaluationChauds: EvaluationAChaudReponse[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}
