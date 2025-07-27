// Définir le type de données pour une autoEvaluationBesoin
interface AutoEvaluationBesoin {
    _id?: string;
    utilisateur: Utilisateur,
    besoin: BesoinFormationPredefini,
    niveau: number, // niveau d'auto-évaluation
    insuffisancesFr?: string,
    insuffisancesEn?: string,
    formulationBesoinsFr?: string,
    formulationBesoinsEn?: string,
    statut: string,
    commentaireAdminFr?: string,
    commentaireAdminEn?: string,
}

interface AutoEvaluationBesoinInitialData {
    data: {
        autoEvaluationBesoins: AutoEvaluationBesoin[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateAutoEvaluationBesoinPayload {
    autoEvaluationBesoin: AutoEvaluationBesoin; // Données de l'événement à créer
}

interface UpdateAutoEvaluationBesoinPayload {
    id: string; // ID de l'événement à mettre à jour
    autoEvaluationBesoinData: Partial<AutoEvaluationBesoin>; // Données mises à jour de l'événement
}

interface DeleteAutoEvaluationBesoinPayload {
    id: string; // ID de l'événement à supprimer
}

interface AutoEvaluationBesoinReturnGetType {
    autoEvaluationBesoins: AutoEvaluationBesoin[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}