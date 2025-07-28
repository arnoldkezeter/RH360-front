
// Définir le type de données pour une typeEchelleReponse
interface TypeEchelleReponse {
    _id?: string;
    nomFr: string;
    nomEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
    
}

interface TypeEchelleReponseInitialData {
    data: {
        typeEchelleReponses: TypeEchelleReponse[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedTypeEchelleReponse:TypeEchelleReponse|undefined
}

interface CreateTypeEchelleReponsePayload {
    typeEchelleReponse: TypeEchelleReponse; // Données de l'événement à créer
}

interface UpdateTypeEchelleReponsePayload {
    id: string; // ID de l'événement à mettre à jour
    typeEchelleReponseData: Partial<TypeEchelleReponse>; // Données mises à jour de l'événement
}

interface DeleteTypeEchelleReponsePayload {
    id: string; // ID de l'événement à supprimer
}

interface TypeEchelleReponseReturnGetType {
    typeEchelleReponses: TypeEchelleReponse[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}