
interface ThemeFormation{
    _id?:string,
    titreFr: string,
    titreEn: string,
    publicCible?: PosteDeTravail[],
    lieux?: LieuFormation[],
    dateDebut: string,
    dateFin: string,
    formateurs?: {formateur:Utilisateur, interne:boolean}[],
    responsable?:  Utilisateur ,
    supports?: string[],
    formation:Formation,
    nbTachesTotal?:number, //Enregistrer le nombre total de tache du thème
    nbTachesExecutees?:number //Enregistrer le nombre total de tache executée du thème
    budgetEstimatif?:number
    budgetReel?:number
    duree?:number
}


interface ThemeFormationInitialData {
    data: {
        themeFormations: ThemeFormation[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedTheme:ThemeFormation | undefined
}

interface CreateThemeFormationPayload {
    themeFormation: ThemeFormation; // Données de l'événement à créer
}

interface UpdateThemeFormationPayload {
    id: string; // ID de l'événement à mettre à jour
    themeFormationData: Partial<ThemeFormation>; // Données mises à jour de l'événement
}
interface DeleteThemeFormationPayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    themeFormationData: Partial<ThemeFormation>; // Données mises à jour de l'événement
}
interface ThemeFormationReturnGetType {
    themeFormations: ThemeFormation[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}