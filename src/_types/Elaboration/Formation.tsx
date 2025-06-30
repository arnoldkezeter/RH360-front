interface Formation{
    _id?:string,
    titreFr: string,
    titreEn: string,
    descriptionFr?:string,
    descriptionEn?:string,
    familleMetier?:[FamilleMetier],
    axeStrategique:AxeStrategique,
    programmeFormation:ProgrammeFormation,
    nbTachesTotal?:number, //Enregistrer le nombre total de tache de la formation
    nbTachesExecutees?:number //Enregistrer le nombre total de tache executée de la formation
    nbTheme?:number//Recevoir le nombre total de theme de la formation
    totalPublicCible?:number//Recevoir le nombre total du public ciblé par la formation
    dateDebut?: string,
    dateFin?: string,
    budgetEstimatif?:number//Recevoir le budget estimatif de la formation
    budgetReel?:number//Recevoir le budget réel de la formation
    themes?:ThemeFormation[]
}


interface FormationInitialData {
    data: {
        formations: Formation[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateFormationPayload {
    formation: Formation; // Données de l'événement à créer
}

interface UpdateFormationPayload {
    id: string; // ID de l'événement à mettre à jour
    formationData: Partial<Formation>; // Données mises à jour de l'événement
}
interface DeleteFormationPayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    formationData: Partial<Formation>; // Données mises à jour de l'événement
}
interface FormationReturnGetType {
    formations: Formation[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}