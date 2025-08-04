
// Définir le type de données pour une echelleReponse
interface EchelleReponse {
    _id?: string;
    nomFr: string;
    nomEn: string;
    ordre: number;
    typeEchelle?:TypeEchelleReponse;
}

interface EchelleReponseInitialData {
    data: {
        echelleReponses: EchelleReponse[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateEchelleReponsePayload {
    echelleReponse: EchelleReponse; // Données de l'événement à créer
}

interface UpdateEchelleReponsePayload {
    id: string; // ID de l'événement à mettre à jour
    echelleReponseData: Partial<EchelleReponse>; // Données mises à jour de l'événement
}

interface DeleteEchelleReponsePayload {
    id: string; // ID de l'événement à supprimer
}

interface EchelleReponseReturnGetType {
    echelleReponses: EchelleReponse[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}