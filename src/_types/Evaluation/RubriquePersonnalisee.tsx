
/**
 * Sous-question personnalisée
 */
interface SousQuestionPersonnalisee {
    id: string;
    libelleFr: string;
    libelleEn: string;
    commentaireObligatoire: boolean;
    ordre: number;
}

/**
 * Question personnalisée ajoutée par l'utilisateur
 */
interface QuestionPersonnalisee {
    id: string;
    libelleFr: string;
    libelleEn: string;
    typeQuestion: 'simple' | 'avec_sous_questions' | 'texte_libre';
    typeEchelleId: string | null;
    commentaireObligatoire: boolean;
    ordre: number;
    sousQuestions: SousQuestionPersonnalisee[];
}

type RubriqueReference = 'PROFIL' | 'ORGANISATION' | 'CONTENU_PEDAGOGIQUE' | 'APPRENTISSAGE';


/**
 * Configuration d'une rubrique personnalisée
 */
interface RubriqueConfig {
    rubriqueReference: 'PROFIL' | 'ORGANISATION' | 'CONTENU_PEDAGOGIQUE' | 'APPRENTISSAGE';
    titreFr?: string;
    titreEn?: string;
    estActive: boolean;
    ordre?: number;
    questionsPersonnalisees: QuestionPersonnalisee[];
    questionsSupprimees: string[];
    questionsModifiees: QuestionModifiee[];
}

interface RubriqueEditorState {
    rubriqueStatique: RubriqueStatique;
    config: RubriqueConfig;
    isExpanded: boolean;
    isActive: boolean;
}