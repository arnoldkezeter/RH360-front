interface Formateur{
    _id?:string
    utilisateur:Utilisateur,
    interne:boolean
}


interface FormateurInitialData {
    data: {
        formateurs: Formateur[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateFormateurPayload {
    formateur: Formateur; // Données de l'événement à créer
}

interface UpdateFormateurPayload {
    id: string; // ID de l'événement à mettre à jour
    formateurData: Partial<Formateur>; // Données mises à jour de l'événement
}
interface DeleteFormateurPayload {
    id: string; // ID de l'événement à supprimer
}

interface FormateurReturnGetType {
    formateurs: Formateur[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}