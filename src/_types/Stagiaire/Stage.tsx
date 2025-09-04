
// Affectation finale pour un stagiaire (dans un stage individuel)
interface AffectationFinale {
  stagiaire: Stagiaire;        // _id du stagiaire
  dateDebut: string;        // ISO string
  dateFin: string;          // ISO string
  superviseur?: Utilisateur;     // _id du superviseur
  service?: Service;         // _id du service (optionnel)
}

// Rotation : affectation temporaire d'un stagiaire ou groupe à un service et superviseur pendant une période donnée
interface Rotation {
  _id: string;
  stage: Stage;          // _id du stage (INDIVIDUEL ou GROUPE)
  service: Service;        // _id du service
  superviseur: Utilisateur;    // _id du superviseur

  // Soit stagiaire (stage individuel), soit groupe (stage groupe)
  stagiaire?: Stagiaire;     // _id du stagiaire (optionnel, uniquement stage individuel)
  groupe?: Groupe;        // _id du groupe (optionnel, uniquement stage groupe)

  dateDebut: string;      // ISO string
  dateFin: string;        // ISO string
}


// Service final pour un groupe (période + superviseur + service)
interface ServiceFinal {
  service: Service;          // _id du service
  superviseur?: Utilisateur;     // _id du superviseur
  dateDebut: string;        // ISO string
  dateFin: string;          // ISO string
}

// Groupe (stages groupe)
interface Groupe {
  _id?: string;
  nom: string;
  stagiaires: Stagiaire[];     // Liste des _id des stagiaires dans ce groupe
  stage?: Stage;            // _id du stage parent
  serviceFinal?: ServiceFinal;
}

interface GroupeParams {
  dateDebut: string,
  dateFin: string,
  stagiaireParGroupe:string,
  joursRotation: string
}



// Stage
interface Stage {
  _id: string;
  nomFr:string;
  nomEn:string;
  nom?:string;
  type: string;
  statut: string;  // selon ton enum backend
  affectationsFinales?: AffectationFinale[];  // seulement pour INDIVIDUEL
  groupes?: Groupe[];                        // uniquement pour GROUPE
  rotations?:Rotation[];
  stagiaire?:Stagiaire;
  dateDebut:string,
  dateFin:string,
  anneeStage:number,
  nombreStagiaires?: number,
  nombreGroupes?: number,
  createdAt?:string
}


interface StageInitialData {
    data: {
        stages: Stage[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    selectedStage:Stage|undefined;
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateStagePayload {
    stage: Stage; // Données de l'événement à créer
}

interface UpdateStagePayload {
    id: string; // ID de l'événement à mettre à jour
    stageData: Partial<Stage>; // Données mises à jour de l'événement
}
interface DeleteStagePayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    stageData: Partial<Stage>; // Données mises à jour de l'événement
}
interface StageReturnGetType {
    stages: Stage[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

// Interface pour les propriétés minimales de l'stage
interface PropsStagesMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}

interface CreateStageInput {
  nomFr:string;
  nomEn:string;
  type: string;
  stagiaire?: string; // _id pour individuel
  groupes?: Array<{
    numero: number;
    stagiaires: string[]; // liste _id stagiaires
  }>;
  rotations?: Array<{
    groupe?: string;       // _id groupe (pour groupe)
    stagiaire?: string;    // _id stagiaire (pour individuel)
    service: string;       // _id service
    superviseur: string;   // _id superviseur
    dateDebut: string;     // ISO date string
    dateFin: string;       // ISO date string
  }>;
  affectationsFinales?: Array<{
    groupe?: string;
    stagiaire?: string;
    service: string;
    superviseur?: string;
    dateDebut: string;
    dateFin: string;
  }>;
  dateDebut: string;
  dateFin: string;
  anneeStage: number;
  statut: string;
}