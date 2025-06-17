
// Définir le type de données pour une familleMetier
interface FamilleMetier {
    _id?: string;
    nomFr: string;
    nomEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
}

interface FamilleMetierInitialData {
    data: {
        familleMetiers: FamilleMetier[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateFamilleMetierPayload {
    familleMetier: FamilleMetier; // Données de l'événement à créer
}

interface UpdateFamilleMetierPayload {
    id: string; // ID de l'événement à mettre à jour
    familleMetierData: Partial<FamilleMetier>; // Données mises à jour de l'événement
}

interface DeleteFamilleMetierPayload {
    id: string; // ID de l'événement à supprimer
}

interface FamilleMetierReturnGetType {
    familleMetiers: FamilleMetier[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}