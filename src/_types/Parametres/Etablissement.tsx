
// Définir le type de données pour une etablissement
interface Etablissement {
    _id?: string;
    nomFr: string;
    nomEn: string;
}

interface EtablissementInitialData {
    data: {
        etablissements: Etablissement[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateEtablissementPayload {
    etablissement: Etablissement; // Données de l'événement à créer
}

interface UpdateEtablissementPayload {
    id: string; // ID de l'événement à mettre à jour
    etablissementData: Partial<Etablissement>; // Données mises à jour de l'événement
}

interface DeleteEtablissementPayload {
    id: string; // ID de l'événement à supprimer
}

interface EtablissementReturnGetType {
    etablissements: Etablissement[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}