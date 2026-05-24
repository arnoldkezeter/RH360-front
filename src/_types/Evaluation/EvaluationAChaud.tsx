interface SousQuestionEvaluation {
    _id?: string;
    code: string;
    libelleFr: string;
    libelleEn: string;
    ordre: number;
    commentaireObligatoire: boolean;
}



interface QuestionEvaluation {
    _id?: string;
    code: string;
    libelleFr: string;
    libelleEn: string;
    type: 'simple' | 'avec_sous_questions' | 'texte_libre' | 'objectifs_comprehension' | 'objectifs_atteinte';
    typeEchelle: TypeEchelleReponse | null;  // ✅ Référence vers le type
    echellesPersonnalisees?: EchelleReponse[]; // Pour cas exceptionnels
    commentaireGlobal: boolean;
    ordre: number;
    sousQuestions: SousQuestionEvaluation[];
    // Pour l'affichage (enrichi)
    echelles?: EchelleReponse[]; // Résolu dynamiquement
}

interface QuestionModifiee {
    questionOriginaleId: string;
    libelleFr: string;
    libelleEn: string;
    typeQuestion: 'simple' | 'avec_sous_questions' | 'texte_libre';
    typeEchelleId: string | null;
    commentaireObligatoire: boolean;
    ordre: number;
    sousQuestions: SousQuestionPersonnalisee[];
}

interface RubriqueEvaluation {
    _id?: string;
    code: string;
    titreFr: string;
    titreEn: string;
    ordre: number;
    questions: QuestionEvaluation[];
}

/**
 * Objectif pédagogique — source des rubriques 3.2 et 3.3.
 * L'admin saisit ces objectifs, le backend les convertit en rubriques.
 */
interface ObjectifPedagogique {
    _id?: string;
    libelleFr: string;
    libelleEn: string;
    ordre: number;
}

/**
 * Rubrique personnalisée envoyée par l'admin en complément des 4 rubriques standard.
 * Le backend les fusionne dans rubriques[] à partir de l'ordre 5.
 */
interface RubriquePersonnalisee {
    titreFr: string;
    titreEn: string;
    ordre?: number;
    questions: {
        libelleFr: string;
        libelleEn: string;
        type?: string;
        commentaireGlobal?: boolean;
        echelles?: string[];
        sousQuestions?: {
            libelleFr: string;
            libelleEn: string;
            commentaireObligatoire?: boolean;
        }[];
    }[];
}

interface TemplateConfig {
    _id?: string;
    evaluationId: string;
    rubriquesConfig: RubriqueConfig[];
    objectifsConfig: {
        estActive: boolean;
        personnalisationAutorisee: boolean;
        objectifsPersonnalises: ObjectifPersonnalise[];
        objectifsSupprimes: string[];
        objectifsPersonnalisesSupprimes: string[];
    };
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

interface EvaluationChaud {
    _id?: string;
    titreFr: string;
    titreEn: string;
    theme: string | ThemeFormation; // ID ou objet peuplé
    descriptionFr?: string;
    descriptionEn?: string;
    dateFormation?: Date;
    
    // Versionnage des objectifs (capture au moment de la création)
    objectifsVersionnes?: ObjectifTheme[];
    
    // Rubriques générées (le résultat final)
    rubriques: RubriqueEvaluation[];
    
    // Référence vers la configuration personnalisée
    templateConfig?: string | TemplateConfig;
    
    // Version du template
    version: number;
    
    actif: boolean;
    progression?: number;
    statut?: 'non_commence' | 'brouillon' | 'soumis';
    createdAt: Date;
    updatedAt: Date;
}

interface EvaluationChaudInitialData {
    data: {
        evaluationChauds: EvaluationChaud[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedEvaluation: EvaluationChaud | undefined;
}

interface CreateEvaluationChaudPayload {
    evaluationChaud: Omit<EvaluationChaud, '_id' | 'createdAt' | 'updatedAt' | 'version' | 'rubriques' | 'objectifsVersionnes'> & {
        rubriquesPersonnalisees?: RubriquePersonnalisee[];
    };
}

interface UpdateEvaluationChaudPayload {
    id: string;
    evaluationChaudData: Partial<Omit<EvaluationChaud, '_id' | 'createdAt' | 'updatedAt' | 'rubriques'>> & {
        rubriquesPersonnalisees?: RubriquePersonnalisee[];
    };
}


interface DeleteEvaluationChaudPayload { id: string; }
interface EvaluationChaudReturnGetType {
    evaluationChauds: EvaluationChaud[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}


// ═══════════════════════════════════════════════════════════════════════════════
// STATISTIQUES (rapport)
// ═══════════════════════════════════════════════════════════════════════════════

interface StatsSousQuestion {
    sousQuestionId: string;
    libelle: string;
    moyenne: number;
    totalReponses: number;
    min?: number;
    max?: number;
    count?: number;
    repartition?: { echelle: string; valeur: number; couleur: string }[];
}

interface StatsQuestion {
    id: string;
    libelleFr: string;
    libelleEn: string;
    moyenne: number;
    repartition: { echelle: string; valeur: number; couleur: string }[];
    sousQuestions: StatsSousQuestion[];
}

interface StatsRubrique {
    id: string;
    titreFr: string;
    titreEn: string;
    moyenne: number;
    questions: StatsQuestion[];
}



interface StatsGenerales {
    statistiques: {
        moyenneGlobale: number;
        nombreParticipants: number;
        nombreCommentaires: number;
        nombreReponsesQuestions: number;
        tauxReponse: number;
        minimum: number;
        maximum: number;
    };
    evaluation: {
        id: string;
        titre: string;
        description: string;
        theme: string;
    };
}

interface RapportEvaluationData {
    statsGenerals?: StatsGenerales;
    rubriques?: StatsRubrique[];
    commentaires?: { questionId: string; question: string; commentaires: string[] }[];
}

interface TemplateConfigReturnType {
    evaluation: {
        id: string;
        titreFr: string;
        titreEn: string;
        theme: string | ThemeFormation;
    };
    rubriquesStatiques: RubriqueStatique[];
    objectifsBase: ObjectifTheme[];
    config: TemplateConfig;
}