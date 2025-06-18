
interface RepartitionProgramme{
    programmeId: string,
    annee: number,
    nombreFormationPrevue: number,
    nombreFormationExecutee: number
}
interface ProgrammeFormation{
    _id?:string
    annee: number;
    titreFr?: string;
    titreEn?: string;
    nombreFormationPrevue?:number;
    nombreFormationExecutee?:number;
    etat?:string;
    creePar:Utilisateur;
}


interface ProgrammeFormationInitialData {
    data: {
        programmeFormations: ProgrammeFormation[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateProgrammeFormationPayload {
    programmeFormation: ProgrammeFormation; // Données de l'événement à créer
}

interface UpdateProgrammeFormationPayload {
    id: string; // ID de l'événement à mettre à jour
    programmeFormationData: Partial<ProgrammeFormation>; // Données mises à jour de l'événement
}
interface DeleteProgrammeFormationPayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    programmeFormationData: Partial<ProgrammeFormation>; // Données mises à jour de l'événement
}

interface ProgrammeFormationReturnGetType {
    programmeFormations: ProgrammeFormation[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}