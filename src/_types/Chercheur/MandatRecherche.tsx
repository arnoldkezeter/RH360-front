

interface StageRecherche {
    _id?:string,
    nomFr:string;
    nomEn:string;
    nom?:string;
    chercheur:Chercheur,
    statut: string,
    superviseur:Utilisateur;
    structure:Structure;
    dateDebut:string;
    dateFin: string;
    anneeStage:number;
    noteService?:Service,
    createdAt?:string
}


interface StageRechercheInitialData {
    data: {
        stageRecherches: StageRecherche[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateStageRecherchePayload {
    stageRecherche: StageRecherche; // Données de l'événement à créer
}

interface UpdateStageRecherchePayload {
    id: string; // ID de l'événement à mettre à jour
    stageRechercheData: Partial<StageRecherche>; // Données mises à jour de l'événement
}
interface DeleteStageRecherchePayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    stageRechercheData: Partial<StageRecherche>; // Données mises à jour de l'événement
}
interface StageRechercheReturnGetType {
    stageRecherches: StageRecherche[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

// Interface pour les propriétés minimales de l'stageRecherche
interface PropsStageRecherchesMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}

interface CreateStageRechercheInput {
    nomFr:string;
    nomEn:string;
    chercheur?: string; // _id pour individuel
    dateDebut: string;
    dateFin: string;
    anneeStage: number;
    statut: string;
    superviseur:string;
    structure:string;
}