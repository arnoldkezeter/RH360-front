
// Définir le type de données pour une region
interface Region {
    _id?: string;
    code:string;
    nomFr: string;
    nomEn: string;
   
}

interface RegionInitialData {
    data: {
        regions: Region[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateRegionPayload {
    region: Region; // Données de l'événement à créer
}

interface UpdateRegionPayload {
    id: string; // ID de l'événement à mettre à jour
    regionData: Partial<Region>; // Données mises à jour de l'événement
}

interface DeleteRegionPayload {
    id: string; // ID de l'événement à supprimer
}

interface RegionReturnGetType {
    regions: Region[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}