/**
 * Objectif personnalisé ajouté par l'utilisateur
 */
interface ObjectifPersonnalise {
    id: string;
    libelleFr: string;
    libelleEn: string;
    ordre: number;
}

/**
 * Configuration des objectifs (3.2 et 3.3)
 */
interface ObjectifsConfig {
    estActive: boolean;
    personnalisationAutorisee: boolean;
    objectifsPersonnalises: ObjectifPersonnalise[];
    objectifsSupprimes: string[]; // IDs des objectifs de base supprimés
    objectifsPersonnalisesSupprimes: string[]; // IDs des objectifs perso supprimés
}



interface UpdateTemplateConfigPayload {
    rubriquesConfig?: RubriqueConfig[];
    objectifsConfig?: ObjectifsConfig;
}

interface AddObjectifPersonnalisePayload {
    libelleFr: string;
    libelleEn?: string;
    ordre?: number;
}

interface ObjectifEditorState {
    objectifsBase: ObjectifTheme[];
    objectifsPersonnalises: ObjectifPersonnalise[];
    objectifsSupprimes: string[];
    objectifsPersonnalisesSupprimes: string[];
    isActive: boolean;
}

// Type pour la configuration locale (sans les champs MongoDB)
interface LocalTemplateConfig {
    rubriquesConfig: {
        rubriqueReference: 'PROFIL' | 'ORGANISATION' | 'CONTENU_PEDAGOGIQUE' | 'APPRENTISSAGE';
        titreFr?: string;
        titreEn?: string;
        estActive: boolean;
        ordre?: number;
        questionsPersonnalisees: QuestionPersonnalisee[];
        questionsSupprimees: string[];
        questionsModifiees: QuestionModifiee[];
    }[];
    objectifsConfig: {
        estActive: boolean;
        personnalisationAutorisee: boolean;
        objectifsPersonnalises: ObjectifPersonnalise[];
        objectifsSupprimes: string[];
        objectifsPersonnalisesSupprimes: string[];
    };
}

