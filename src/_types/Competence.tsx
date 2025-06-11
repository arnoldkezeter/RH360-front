
// Définir le type de données pour une competence
interface Competence {
    _id?: string;
    code:string;
    nomFr: string;
    nomEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
    familleMetier:FamilleMetier;
}

interface CompetenceInitialData {
    data: {
        competences: Competence[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateCompetencePayload {
    competence: Competence; // Données de l'événement à créer
}

interface UpdateCompetencePayload {
    id: string; // ID de l'événement à mettre à jour
    competenceData: Partial<Competence>; // Données mises à jour de l'événement
}

interface DeleteCompetencePayload {
    id: string; // ID de l'événement à supprimer
}

interface CompetenceReturnGetType {
    competences: Competence[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}