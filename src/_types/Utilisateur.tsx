interface MinUtilisateurState {
    _id?: string;
    role: string;
    nom:string;
    prenom?:string;
    email:string;
    photoDeProfil?:string;
}


interface Utilisateur {
    _id?: string;
    matricule?: string;
    nom: string;
    prenom?: string;
    email: string;
    genre: string;
    role: string;
    telephone?: string;
    dateNaissance?: string ;
    lieuNaissance?: string ;
    dateEntreeEnService?: string,
    photoDeProfil?:string;
    service?: Service;
    categorieProfessionnelle?: CategorieProfessionnelle,
    posteDeTravail?: PosteDeTravail,
    commune?:Commune,
    actif:boolean,

}

interface UtilisateurInitialData {
    data: {
        utilisateurs: Utilisateur[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    utilisateur:Utilisateur;
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateUtilisateurPayload {
    utilisateur: Utilisateur; // Données de l'événement à créer
}

interface UpdateUtilisateurPayload {
    id: string; // ID de l'événement à mettre à jour
    utilisateurData: Partial<Utilisateur>; // Données mises à jour de l'événement
}
interface DeleteUtilisateurPayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    utilisateurData: Partial<Utilisateur>; // Données mises à jour de l'événement
}
interface UtilisateurReturnGetType {
    utilisateurs: Utilisateur[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

// Interface pour les propriétés minimales de l'utilisateur
interface PropsUtilisateursMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}