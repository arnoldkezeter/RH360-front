interface MinUtilisateurState {
    _id: string;
    role: string;
}


interface Utilisateur {
    _id: string;
    matricule?: string;
    nom: string;
    prenom?: string;
    email: string;
    genre: string;
    role: string;
    telephone?: string;
    dateNaissaince?: string ;
    lieuNaissaince?: string ;
    dateEntreeEnService?: string,
    photoDeProfil:string;
    service: Service;
    categorieProfessionnelle: CategorieProfessionnelle,
    postesDeTravail: PosteDeTravail,
    actif:boolean,

}


interface UpdateUtilisateursPayload {
    id: string; // ID de l'événement à mettre à jour
    utilisateursData: Partial<Utilisateur>; // Données mises à jour de l'événement
}
interface UtilisateursReturnGetType {
    utilisateurs: Utilisateur[];
}

// Interface pour les propriétés minimales de l'utilisateur
interface PropsUtilisateursMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}