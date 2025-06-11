
// Définir le type de données pour une departement
interface Departement {
    _id?: string;
    code?:string;
    nomFr: string;
    nomEn: string;
    region: Region;
   
}

interface DepartementInitialData {
    data: {
        departements: Departement[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateDepartementPayload {
    departement: Departement; // Données de l'événement à créer
}

interface UpdateDepartementPayload {
    id: string; // ID de l'événement à mettre à jour
    departementData: Partial<Departement>; // Données mises à jour de l'événement
}

interface DeleteDepartementPayload {
    id: string; // ID de l'événement à supprimer
}

interface DepartementReturnGetType {
    departements: Departement[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}