interface LieuFormation{
    _id?:string
    lieu:string,
    cohortes:Cohorte[]
    participants:ParticipantFormation[];
    dateDebut:string;
    dateFin:string;
    dateDebutEffective?:string;
    dateFinEffective?:string;
}


interface LieuFormationInitialData {
    data: {
        lieuFormations: LieuFormation[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateLieuFormationPayload {
    lieuFormation: LieuFormation; // Données de l'événement à créer
}

interface UpdateLieuFormationPayload {
    id: string; // ID de l'événement à mettre à jour
    lieuFormationData: Partial<LieuFormation>; // Données mises à jour de l'événement
}
interface DeleteLieuFormationPayload {
    id: string; // ID de l'événement à supprimer
}

interface LieuFormationReturnGetType {
    lieuFormations: LieuFormation[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}