interface MinUserState {
    _id: string;
    roles: string[];
    role: string;
}




interface UserState {
    _id: string;

    roles: string[];
    role: string;
    genre: string;
    date_creation?: Date | null;
    date_entree: string | null;
    date_naiss: string | null;

    nom: string;
    prenom: string | null;
    email: string;
    matricule: string | null;
    nationalite: string | null;
    diplomeEntre: string | null;

    lieu_naiss: string | null;
    contact: string | null;
    status?: string;
    historique_connexion?: Date[];
    photo_profil: string | null;

    // son tous des objectId
    abscence: string | null;
    absences: AbsenceType[];
    niveaux: InscriptionType[];
    categorie: string | null;
    fonction: string | null;
    service: string | null;
    specialite: string | null;
    commune: string | null;
    grade: string | null;

}

interface InscriptionType {
    niveau: string,
    annee: number
}

// interface Absence {
//     date_abscence: Date | null;
//     heure_debut: string | null;
//     heure_fin: string | null;
//     semestre: string | null;
//     annee: string | null;
// }

interface UpdateUserPayload {
    id: string; // ID de l'événement à mettre à jour
    userData: Partial<UserState>; // Données mises à jour de l'événement
}
interface UserReturnGetType {
    users: UserState[];
}

// Interface pour les propriétés minimales de l'utilisateur
interface PropsUserMinState {
    _id: string;
    roles: string[];
    role: string;
    nom: string;
    prenom: string | null;
}