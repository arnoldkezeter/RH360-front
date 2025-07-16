
interface BudgetFormation{
    _id?:string
    formation?:Formation,
    nomFr:string,
    nomEn:string,
    statut:string,
}


interface BudgetFormationInitialData {
    data: {
        budgetFormations: BudgetFormation[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    
    pageIsLoading: boolean;
    pageError: string | null;
    selectedBugetFormation:BudgetFormation | undefined
}

interface CreateBudgetFormationPayload {
    budgetFormation: BudgetFormation; // Données de l'événement à créer
}

interface UpdateBudgetFormationPayload {
    id: string; // ID de l'événement à mettre à jour
    budgetFormationData: Partial<BudgetFormation>; // Données mises à jour de l'événement
}
interface DeleteBudgetFormationPayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    budgetFormationData: Partial<BudgetFormation>; // Données mises à jour de l'événement
}

interface BudgetFormationReturnGetType {
    budgetFormations: BudgetFormation[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}