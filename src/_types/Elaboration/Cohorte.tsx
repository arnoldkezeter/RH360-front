interface Cohorte{
    nomFr: string,
    nomEn: string,
    descriptionFr?: string,
    descriptionEn?: string,
    utilisateurs: [Utilisateur],
}


interface CohorteInitialData {
    data: {
        cohortes: Cohorte[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateCohortePayload {
    cohorte: Cohorte; // Données de l'événement à créer
}

interface UpdateCohortePayload {
    id: string; // ID de l'événement à mettre à jour
    cohorteData: Partial<Cohorte>; // Données mises à jour de l'événement
}
interface DeleteCohortePayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    cohorteData: Partial<Cohorte>; // Données mises à jour de l'événement
}
interface CohorteReturnGetType {
    cohortes: Cohorte[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}