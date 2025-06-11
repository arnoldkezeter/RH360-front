
// Définir le type de données pour une besoinFormationPredefini
interface BesoinFormationPredefini {
    _id?: string;
    titreFr: string;
    titreEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
    posteDeTravail?:PosteDeTravail;
}

interface BesoinFormationPredefiniInitialData {
    data: {
        besoinFormationPredefinis: BesoinFormationPredefini[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateBesoinFormationPredefiniPayload {
    besoinFormationPredefini: BesoinFormationPredefini; // Données de l'événement à créer
}

interface UpdateBesoinFormationPredefiniPayload {
    id: string; // ID de l'événement à mettre à jour
    besoinFormationPredefiniData: Partial<BesoinFormationPredefini>; // Données mises à jour de l'événement
}

interface DeleteBesoinFormationPredefiniPayload {
    id: string; // ID de l'événement à supprimer
}

interface BesoinFormationPredefiniReturnGetType {
    besoinFormationPredefinis: BesoinFormationPredefini[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}