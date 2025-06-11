
// Définir le type de données pour une posteDeTravail
interface PosteDeTravail {
    _id?: string;
    nomFr: string;
    nomEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
    familleMetier:FamilleMetier;
}

interface PosteDeTravailInitialData {
    data: {
        posteDeTravails: PosteDeTravail[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreatePosteDeTravailPayload {
    posteDeTravail: PosteDeTravail; // Données de l'événement à créer
}

interface UpdatePosteDeTravailPayload {
    id: string; // ID de l'événement à mettre à jour
    posteDeTravailData: Partial<PosteDeTravail>; // Données mises à jour de l'événement
}

interface DeletePosteDeTravailPayload {
    id: string; // ID de l'événement à supprimer
}

interface PosteDeTravailReturnGetType {
    posteDeTravails: PosteDeTravail[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}