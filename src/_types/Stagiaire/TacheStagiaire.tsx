
// Définir le type de données pour une tacheStagiaire
interface TacheStagiaire {
    _id?: string;
    nomFr: string;
    nomEn: string;
    date:string;
    status:string;
    descriptionFr?:string;
    descriptionEn?:string;
    stagiaire?:Stagiaire;
}

interface TacheStagiaireInitialData {
    data: {
        tachesStagiaire: TacheStagiaire[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateTacheStagiairePayload {
    tacheStagiaire: TacheStagiaire; // Données de l'événement à créer
}

interface UpdateTacheStagiairePayload {
    id: string; // ID de l'événement à mettre à jour
    tacheStagiaireData: Partial<TacheStagiaire>; // Données mises à jour de l'événement
}

interface DeleteTacheStagiairePayload {
    id: string; // ID de l'événement à supprimer
}

interface TacheStagiaireReturnGetType {
    tachesStagiaire: TacheStagiaire[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}