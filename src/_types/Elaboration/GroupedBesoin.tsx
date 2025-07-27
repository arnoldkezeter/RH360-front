interface EvaluationItem {
  utilisateurNom: string;
  utilisateurPrenom: string;
  utilisateurEmail: string;
  utilisateurId: string;
  niveau: number;
  
  // Insuffisances - versions originales et localisée
  insuffisancesFr?: string;
  insuffisancesEn?: string;
  insuffisances?: string;
  
  // Formulation des besoins - versions originales et localisée
  formulationBesoinsFr?: string;
  formulationBesoinsEn?: string;
  formulationBesoins?: string;
  
  // Commentaires admin - versions originales et localisée
  commentaireAdminFr?: string;
  commentaireAdminEn?: string;
  commentaireAdmin?: string;
  
  // Timestamps
  createdAt: string; // ou Date si vous transformez en objet Date
  updatedAt: string; // ou Date si vous transformez en objet Date
  
  // Statut et identifiant
  statut: string;
  evaluationId: string;
}


interface GroupedBesoin {
  besoinId: string;
  titreFr: string;
  titreEn: string;
  niveau: number;
  count: number;
  evaluations: EvaluationItem[];
}

interface GroupedBesoinInitialData {
    data: {
        groupedBesoins: GroupedBesoin[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateGroupedBesoinPayload {
    groupedBesoin: GroupedBesoin; // Données de l'événement à créer
}

interface UpdateGroupedBesoinPayload {
    id: string; // ID de l'événement à mettre à jour
    groupedBesoinData: Partial<GroupedBesoin>; // Données mises à jour de l'événement
}

interface DeleteGroupedBesoinPayload {
    id: string; // ID de l'événement à supprimer
}

interface GroupedBesoinReturnGetType {
    groupedBesoins: GroupedBesoin[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}