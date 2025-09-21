interface ParticipantFormation{
    _id?:string
    participant:Utilisateur,
}


interface ParticipantFormationInitialData {
    data: {
        participantFormations: ParticipantFormation[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateParticipantFormationPayload {
    participantFormation: ParticipantFormation; // Données de l'événement à créer
}

interface UpdateParticipantFormationPayload {
    id: string; // ID de l'événement à mettre à jour
    participantFormationData: Partial<ParticipantFormation>; // Données mises à jour de l'événement
}
interface DeleteParticipantFormationPayload {
    id: string; // ID de l'événement à supprimer
}

interface ParticipantFormationReturnGetType {
    participantFormations: ParticipantFormation[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}