interface CohorteUtilisateur{
    _id?:string;
    utilisateur:Utilisateur,
    dateAjout:string,
    cohorte:Cohorte
}


interface CohorteUtilisateurInitialData {
    data: {
        participants: CohorteUtilisateur[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateCohorteUtilisateurPayload {
    participant: CohorteUtilisateur; // Données de l'événement à créer
}

interface UpdateCohorteUtilisateurPayload {
    id: string; // ID de l'événement à mettre à jour
    participantData: Partial<CohorteUtilisateur>; // Données mises à jour de l'événement
}
interface DeleteCohorteUtilisateurPayload {
    id: string; // ID de l'événement à supprimer
}

interface CohorteUtilisateurReturnGetType {
    participants: CohorteUtilisateur[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}