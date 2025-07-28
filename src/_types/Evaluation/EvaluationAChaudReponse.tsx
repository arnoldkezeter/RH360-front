// Interface pour les réponses aux sous-questions
interface SousQuestionReponse {
  sousQuestionId: string; // ObjectId de la sous-question
  reponseEchelleId: string; // ObjectId de la valeur d'échelle sélectionnée
  commentaire?: string;
}

// Interface pour les réponses aux questions
interface QuestionReponse {
  questionId: string; // ObjectId de la question
  reponseEchelleId?: string; // ObjectId de la valeur d'échelle (si pas de sous-question)
  sousReponses: SousQuestionReponse[];
  commentaireGlobal?: string;
}

// Interface pour les réponses aux rubriques
interface RubriqueReponse {
  rubriqueId: string; // ObjectId de la rubrique
  questions: QuestionReponse[];
}

// Interface principale pour la réponse à l'évaluation à chaud
interface EvaluationAChaudReponse {
  _id?: string;
  utilisateur: string; // ObjectId de l'utilisateur
  modele: string; // ObjectId du modèle EvaluationAChaud
  rubriques: RubriqueReponse[];
  commentaireGeneral?: string;
  dateSoumission: Date;
  createdAt: Date;
  updatedAt: Date;
}
