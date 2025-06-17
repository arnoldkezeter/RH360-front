interface Theme{
    titreFr: string,
    titreEn: string,
    publicCible: [PosteDeTravail],
    lieux: [{lieu:string, cohorte:Cohorte}],
    dateDebut: string,
    dateFin: string,
    formateurs: [{formateur:Utilisateur, interne:boolean}],
    responsable:  Utilisateur ,
    supports: [string],
    formation:Formation,
    nbTachesTotal:number, //Enregistrer le nombre total de tache du thème
    nbTachesExecutees:number //Enregistrer le nombre total de tache executée du thème
}


interface ThemeInitialData {
    data: {
        themes: Theme[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateThemePayload {
    theme: Theme; // Données de l'événement à créer
}

interface UpdateThemePayload {
    id: string; // ID de l'événement à mettre à jour
    themeData: Partial<Theme>; // Données mises à jour de l'événement
}
interface DeleteThemePayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    themeData: Partial<Theme>; // Données mises à jour de l'événement
}
interface ThemeReturnGetType {
    themes: Theme[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}