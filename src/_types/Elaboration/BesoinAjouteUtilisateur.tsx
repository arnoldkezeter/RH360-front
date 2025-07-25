 interface BesoinUtilisateur {
  titre: string;
  pointsAAmeliorer?: string;
  statut: string; // adapte selon tes enums
  createdAt: string;
}

interface GroupedCompetence {
  utilisateurId: string;
  nom: string;
  prenom: string;
  email: string;
  count: number;
  besoins: BesoinUtilisateur[];
}

// Définir le type de données pour une besoinAjouteUtilisateur
interface BesoinAjouteUtilisateur {
    _id?: string;
    utilisateur: Utilisateur,
    titreFr: string,
    titreEn: string,
    descriptionFr?: string,
    descriptionEn?: string,
    pointsAAmeliorerFr?: string,
    pointsAAmeliorerEn?: string,
    statut: string,
    commentaireAdminFr?: string,
    commentaireAdminEn?: string,
}

interface BesoinAjouteUtilisateurInitialData {
    data: {
        besoinAjouteUtilisateurs: BesoinAjouteUtilisateur[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateBesoinAjouteUtilisateurPayload {
    besoinAjouteUtilisateur: BesoinAjouteUtilisateur; // Données de l'événement à créer
}

interface UpdateBesoinAjouteUtilisateurPayload {
    id: string; // ID de l'événement à mettre à jour
    besoinAjouteUtilisateurData: Partial<BesoinAjouteUtilisateur>; // Données mises à jour de l'événement
}

interface DeleteBesoinAjouteUtilisateurPayload {
    id: string; // ID de l'événement à supprimer
}

interface BesoinAjouteUtilisateurReturnGetType {
    besoinAjouteUtilisateurs: BesoinAjouteUtilisateur[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}