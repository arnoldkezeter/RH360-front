
// Définir le type de données pour une taxe
interface Taxe {
    _id?: string;
    natureFr: string;
    natureEn: string;
    taux:number
}

interface TaxeInitialData {
    data: {
        taxes: Taxe[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateTaxePayload {
    taxe: Taxe; // Données de l'événement à créer
}

interface UpdateTaxePayload {
    id: string; // ID de l'événement à mettre à jour
    taxeData: Partial<Taxe>; // Données mises à jour de l'événement
}

interface DeleteTaxePayload {
    id: string; // ID de l'événement à supprimer
}

interface TaxeReturnGetType {
    taxes: Taxe[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}