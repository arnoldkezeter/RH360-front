
/**
 * Sous-question statique (stockée en base)
 */
interface SousQuestionStatique {
    id: string;
    libelleFr: string;
    libelleEn: string;
    ordre: number;
    commentaireObligatoire: boolean;
}

/**
 * Question statique (stockée en base)
 */
interface QuestionStatique {
    _id?: string;
    code: string;
    libelleFr: string;
    libelleEn: string;
    type: 'simple' | 'avec_sous_questions' | 'texte_libre' | 'objectifs_comprehension' | 'objectifs_atteinte';
    typeEchelle: TypeEchelleReponse | null;  // ✅ Référence vers TypeEchelleReponse
    commentaireGlobal: boolean;
    ordre: number;
    supprimable: boolean;
    duplicable: boolean;
    actif: boolean;
    sousQuestions: SousQuestionStatique[];
}

/**
 * Rubrique statique (stockée en base)
 */
interface RubriqueStatique {
    _id?: string;
    code: 'PROFIL' | 'ORGANISATION' | 'CONTENU_PEDAGOGIQUE' | 'APPRENTISSAGE';
    titreFr: string;
    titreEn: string;
    descriptionFr?: string;
    descriptionEn?: string;
    ordre: number;
    masquable: boolean;
    questionsPersonnalisables: boolean;
    questionsSupprimables: boolean;
    actif: boolean;
    version: number;
    questions: QuestionStatique[];
}