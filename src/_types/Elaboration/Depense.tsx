interface Depense{
    _id?:string;
    budget?:BudgetFormation
    nomFr:string;
    nomEn:string;
    montantUnitairePrevu:number;
    montantUnitaireReel?:number;
    quantite?:number;
    taxes?:Taxe[];
    type:string
}



interface DepenseInitialData {
    data: {
        depenses: Depense[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateDepensePayload {
    depense: Depense; // Données de l'événement à créer
}

interface UpdateDepensePayload {
    id: string; // ID de l'événement à mettre à jour
    depenseData: Partial<Depense>; // Données mises à jour de l'événement
}
interface DeleteDepensePayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    depenseData: Partial<Depense>; // Données mises à jour de l'événement
}

interface DepenseReturnGetType {
    depenses: Depense[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}