interface Chercheur {
    _id?: string;
    nom: string;
    prenom?: string;
    email: string;
    genre: string;
    telephone?: string;
    dateNaissance?: string ;
    lieuNaissance?: string ;
    photoDeProfil?:string;
    domaineRecherche:string;
    etablissement: Etablissement,
    stage?:StageRecherche
    commune?:Commune;
    actif: boolean,
}

interface ChercheurInitialData {
    data: {
        chercheurs: Chercheur[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateChercheurPayload {
    chercheur: Chercheur; // Données de l'événement à créer
}

interface UpdateChercheurPayload {
    id: string; // ID de l'événement à mettre à jour
    chercheurData: Partial<Chercheur>; // Données mises à jour de l'événement
}
interface DeleteChercheurPayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    chercheurData: Partial<Chercheur>; // Données mises à jour de l'événement
}
interface ChercheurReturnGetType {
    chercheurs: Chercheur[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

// Interface pour les propriétés minimales de l'chercheur
interface PropsChercheursMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}