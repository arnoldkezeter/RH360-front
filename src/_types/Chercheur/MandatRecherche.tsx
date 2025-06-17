

interface MandatRecherche {
    chercheur:Chercheur,
    statut: string,
    superviseur:Utilisateur;
    structure:Structure;
    dateDebut:string;
    dateFin: string;
    noteService:Service
}


interface MandatRechercheInitialData {
    data: {
        mandatRecherches: MandatRecherche[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateMandatRecherchePayload {
    mandatRecherche: MandatRecherche; // Données de l'événement à créer
}

interface UpdateMandatRecherchePayload {
    id: string; // ID de l'événement à mettre à jour
    mandatRechercheData: Partial<MandatRecherche>; // Données mises à jour de l'événement
}
interface DeleteMandatRecherchePayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    mandatRechercheData: Partial<MandatRecherche>; // Données mises à jour de l'événement
}
interface MandatRechercheReturnGetType {
    mandatRecherches: MandatRecherche[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

// Interface pour les propriétés minimales de l'mandatRecherche
interface PropsMandatRecherchesMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}