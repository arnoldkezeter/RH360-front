
// Définir le type de données pour une service
interface Service {
    _id?: string;
    nomFr: string;
    nomEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
    structure:Structure,
    nbPlaceStage:number;
}

interface ServiceInitialData {
    data: {
        services: Service[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateServicePayload {
    service: Service; // Données de l'événement à créer
}

interface UpdateServicePayload {
    id: string; // ID de l'événement à mettre à jour
    serviceData: Partial<Service>; // Données mises à jour de l'événement
}

interface DeleteServicePayload {
    id: string; // ID de l'événement à supprimer
}

interface ServiceReturnGetType {
    services: Service[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}