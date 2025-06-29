
// Définir le type de données pour une supportFormation
interface SupportFormation {
    _id?: string;
    nomFr: string;
    nomEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
    taille?:number;
    fichier?:string; //chemin backend du fichier
    theme:ThemeFormation;
}

interface SupportFormationInitialData {
    data: {
        supportFormations: SupportFormation[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateSupportFormationPayload {
    supportFormation: SupportFormation; // Données de l'événement à créer
}

interface UpdateSupportFormationPayload {
    id: string; // ID de l'événement à mettre à jour
    supportFormationData: Partial<SupportFormation>; // Données mises à jour de l'événement
}

interface DeleteSupportFormationPayload {
    id: string; // ID de l'événement à supprimer
}

interface SupportFormationReturnGetType {
    supportFormations: SupportFormation[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}