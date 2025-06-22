interface ObjectifTheme{
    _id?:string
    nomFr:string
    nomEn:string
}


interface ObjectifThemeInitialData {
    data: {
        objectifThemes: ObjectifTheme[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateObjectifThemePayload {
    objectifTheme: ObjectifTheme; // Données de l'événement à créer
}

interface UpdateObjectifThemePayload {
    id: string; // ID de l'événement à mettre à jour
    objectifThemeData: Partial<ObjectifTheme>; // Données mises à jour de l'événement
}
interface DeleteObjectifThemePayload {
    id: string; // ID de l'événement à supprimer
}

interface ObjectifThemeReturnGetType {
    objectifThemes: ObjectifTheme[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}