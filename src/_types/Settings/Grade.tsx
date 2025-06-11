
// Définir le type de données pour une grade
interface Grade {
    _id?: string;
    nomFr: string;
    nomEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
}

interface GradeInitialData {
    data: {
        grades: Grade[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateGradePayload {
    grade: Grade; // Données de l'événement à créer
}

interface UpdateGradePayload {
    id: string; // ID de l'événement à mettre à jour
    gradeData: Partial<Grade>; // Données mises à jour de l'événement
}

interface DeleteGradePayload {
    id: string; // ID de l'événement à supprimer
}

interface GradeReturnGetType {
    grades: Grade[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}