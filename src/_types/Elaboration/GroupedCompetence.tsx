interface BesoinUtilisateur {
  besoinId: string;
  titreFr: string;
  titreEn: string;
  titre: string; // Version localisée selon la langue
  pointsAAmeliorerFr?: string;
  pointsAAmeliorerEn?: string;
  pointsAAmeliorer?: string; // Version localisée selon la langue
  commentaireAdminFr?: string;
  commentaireAdminEn?: string;
  commentaireAdmin?: string; // Version localisée selon la langue
  statut: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface GroupedCompetence {
    _id?:string,
    utilisateurId: string;
    nom: string;
    prenom: string;
    email: string;
    count: number;
    besoins: BesoinUtilisateur[];
}

interface GroupedCompetenceInitialData {
    data: {
        groupedCompetences: GroupedCompetence[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateGroupedCompetencePayload {
    groupedCompetence: GroupedCompetence; // Données de l'événement à créer
}

interface UpdateGroupedCompetencePayload {
    id: string; // ID de l'événement à mettre à jour
    groupedCompetenceData: Partial<GroupedCompetence>; // Données mises à jour de l'événement
}

interface DeleteGroupedCompetencePayload {
    id: string; // ID de l'événement à supprimer
}

interface GroupedCompetenceReturnGetType {
    groupedCompetences: GroupedCompetence[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}