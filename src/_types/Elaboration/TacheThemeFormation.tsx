interface TacheThemeFormation{
    _id?:string
    theme?: ThemeFormation
    tache: TacheGenerique
    dateDebut: string
    dateFin: string
    estExecutee?: boolean
    fichierJoint?: string
    donneesEnregistrees?: Record<string, any>,
    dateExecution?: string
}

interface TacheThemeFormationInitialData {
    data: {
        tachesThemeFormation: TacheThemeFormation[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateTacheThemeFormationPayload {
    tacheThemeFormation: TacheThemeFormation; // Données de l'événement à créer
}

interface UpdateTacheThemeFormationPayload {
    id: string; // ID de l'événement à mettre à jour
    tacheThemeFormationData: Partial<TacheThemeFormation>; // Données mises à jour de l'événement
}
interface DeleteTacheThemeFormationPayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    tacheThemeFormationData: Partial<TacheThemeFormation>; // Données mises à jour de l'événement
}

interface TacheThemeFormationReturnGetType {
    tachesThemeFormation: TacheThemeFormation[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}