
// Définir le type de données pour une axeStrategique
interface AxeStrategique {
    _id?: string;
    nomFr: string;
    nomEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
}

interface AxeStrategiqueInitialData {
    data: {
        axeStrategiques: AxeStrategique[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateAxeStrategiquePayload {
    axeStrategique: AxeStrategique; // Données de l'événement à créer
}

interface UpdateAxeStrategiquePayload {
    id: string; // ID de l'événement à mettre à jour
    axeStrategiqueData: Partial<AxeStrategique>; // Données mises à jour de l'événement
}

interface DeleteAxeStrategiquePayload {
    id: string; // ID de l'événement à supprimer
}

interface AxeStrategiqueReturnGetType {
    axeStrategiques: AxeStrategique[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}