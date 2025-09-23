
// Définir le type de données pour une tacheGenerique
interface TacheGenerique {
    _id?: string;
    code?:string;
    nomFr: string;
    nomEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
    type:string;
    obligatoire?:boolean,
}

interface TacheGeneriqueInitialData {
    data: {
        tacheGeneriques: TacheGenerique[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateTacheGeneriquePayload {
    tacheGenerique: TacheGenerique; // Données de l'événement à créer
}

interface UpdateTacheGeneriquePayload {
    id: string; // ID de l'événement à mettre à jour
    tacheGeneriqueData: Partial<TacheGenerique>; // Données mises à jour de l'événement
}

interface DeleteTacheGeneriquePayload {
    id: string; // ID de l'événement à supprimer
}

interface TacheGeneriqueReturnGetType {
    tacheGeneriques: TacheGenerique[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}