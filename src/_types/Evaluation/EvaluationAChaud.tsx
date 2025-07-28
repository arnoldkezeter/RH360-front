// Interface pour les sous-questions
interface SousQuestion {
  _id?: string;
  libelleFr: string;
  libelleEn: string;
  commentaireObligatoire: boolean;
  ordre: number;
}

// Interface pour les questions
interface Question {
  _id?: string;
  libelleFr: string;
  libelleEn: string;
  echelles: EchelleReponse[];
  sousQuestions: SousQuestion[]; // vide si question simple
  commentaireGlobal: boolean;    // si true, champ commentaire à l'échelle de la question
  ordre: number;
}

// Interface pour les rubriques
interface Rubrique {
  _id?: string;
  titreFr: string;
  titreEn: string;
  ordre: number;
  questions: Question[];
}

// Interface principale pour l'évaluation à chaud
interface EvaluationChaud {
  _id?: string;
  titreFr: string;
  titreEn: string;
  theme: ThemeFormation; // ObjectId du ThemeFormation
  descriptionFr?: string;
  descriptionEn?: string;
  rubriques: Rubrique[];
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EvaluationChaudInitialData {
    data: {
        evaluationChauds: EvaluationChaud[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateEvaluationChaudPayload {
    evaluationChaud: EvaluationChaud; // Données de l'événement à créer
}

interface UpdateEvaluationChaudPayload {
    id: string; // ID de l'événement à mettre à jour
    evaluationChaudData: Partial<EvaluationChaud>; // Données mises à jour de l'événement
}

interface DeleteEvaluationChaudPayload {
    id: string; // ID de l'événement à supprimer
}

interface EvaluationChaudReturnGetType {
    evaluationChauds: EvaluationChaud[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}

