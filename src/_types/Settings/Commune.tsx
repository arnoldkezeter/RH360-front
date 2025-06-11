
// Définir le type de données pour une commune
interface Commune {
    _id?: string;
    code?:string;
    nomFr: string;
    nomEn: string;
    departement: Departement;
   
}

interface CommuneInitialData {
    data: {
        communes: Commune[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateCommunePayload {
    commune: Commune; // Données de l'événement à créer
}

interface UpdateCommunePayload {
    id: string; // ID de l'événement à mettre à jour
    communeData: Partial<Commune>; // Données mises à jour de l'événement
}

interface DeleteCommunePayload {
    id: string; // ID de l'événement à supprimer
}

interface CommuneReturnGetType {
    communes: Commune[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}