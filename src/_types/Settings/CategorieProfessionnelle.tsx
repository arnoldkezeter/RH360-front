
// Définir le type de données pour une categorieProfessionnelle
interface CategorieProfessionnelle {
    _id?: string;
    nomFr: string;
    nomEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
    grade:Grade;
}

interface CategorieProfessionnelleInitialData {
    data: {
        categorieProfessionnelles: CategorieProfessionnelle[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateCategorieProfessionnellePayload {
    categorieProfessionnelle: CategorieProfessionnelle; // Données de l'événement à créer
}

interface UpdateCategorieProfessionnellePayload {
    id: string; // ID de l'événement à mettre à jour
    categorieProfessionnelleData: Partial<CategorieProfessionnelle>; // Données mises à jour de l'événement
}

interface DeleteCategorieProfessionnellePayload {
    id: string; // ID de l'événement à supprimer
}

interface CategorieProfessionnelleReturnGetType {
    categorieProfessionnelles: CategorieProfessionnelle[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}