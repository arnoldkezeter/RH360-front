interface Parcour {
  annee?: number,
  etablissement?: Etablissement,
  filiere:string,
  option?: string,
  niveau: string
}

interface Stagiaire {
    _id?: string;
    nom: string;
    prenom?: string;
    email: string;
    genre: string;
    telephone?: string;
    dateNaissance?: string ;
    lieuNaissance?: string ;
    photoDeProfil?:string;
    commune?:Commune;
    parcours:[Parcour];
    stages?:[Stage]
    actif: boolean,

}

interface StagiaireInitialData {
    data: {
        stagiaires: Stagiaire[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateStagiairePayload {
    stagiaire: Stagiaire; // Données de l'événement à créer
}

interface UpdateStagiairePayload {
    id: string; // ID de l'événement à mettre à jour
    stagiaireData: Partial<Stagiaire>; // Données mises à jour de l'événement
}
interface DeleteStagiairePayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    stagiaireData: Partial<Stagiaire>; // Données mises à jour de l'événement
}
interface StagiaireReturnGetType {
    stagiaires: Stagiaire[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

// Interface pour les propriétés minimales de l'stagiaire
interface PropsStagiairesMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}