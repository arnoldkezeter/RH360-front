
interface Services {
    service:Service,
    annee:number,
    dateDebut:string,
    dateFin:string,
    superviseurs:[Utilisateur]
}

interface Stagiaires {
    stagiaire : Stagiaire;
    servicesAffectes:[Services]
}

interface Stage {
    typeStage: string,
    stagiaires: [Stagiaires],//Utilisé uniquement pour des stages individuels
    noteService: NoteDeService,
    statut:string,
}


interface StageInitialData {
    data: {
        stages: Stage[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateStagePayload {
    stage: Stage; // Données de l'événement à créer
}

interface UpdateStagePayload {
    id: string; // ID de l'événement à mettre à jour
    stageData: Partial<Stage>; // Données mises à jour de l'événement
}
interface DeleteStagePayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    stageData: Partial<Stage>; // Données mises à jour de l'événement
}
interface StageReturnGetType {
    stages: Stage[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

// Interface pour les propriétés minimales de l'stage
interface PropsStagesMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}