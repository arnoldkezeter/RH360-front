
// ============================
// LieuFormation retour backend (avec nouvelle structure)
// ============================

interface LieuFormation {
    _id?: string;
    lieu: string;
    cohortes: Cohorte[];
    participants: FamilleMetierRestriction[]; // ✅ MODIFIÉ - Structure hiérarchique
    dateDebut: string;
    dateFin: string;
    dateDebutEffective?: string;
    dateFinEffective?: string;
    theme: ThemeFormation | string; // Peut être peuplé ou juste l'ID
    createdAt?: string;
    updatedAt?: string;
}

// ============================
// ✅ Interfaces pour envoi vers backend (création/modification)
// ============================

interface ServiceInput {
    service: string; // ObjectId
}

interface StructureInput {
    structure: string; // ObjectId
    services?: ServiceInput[]; // Si vide/undefined → tous les services
}

interface PosteInput {
    poste: string; // ObjectId
    structures?: StructureInput[]; // Si vide/undefined → toutes les structures
}

interface FamilleMetierInput {
    familleMetier: string; // ObjectId
    postes?: PosteInput[]; // Si vide/undefined → toute la famille
}

interface LieuFormationInput {
    _id?: string;
    lieu: string;
    cohortes?: string[]; // IDs des cohortes
    participants: FamilleMetierInput[]; // ✅ Structure hiérarchique
    dateDebut: string;
    dateFin: string;
    dateDebutEffective?: string;
    dateFinEffective?: string;
    theme?: string; // ID du thème (optionnel si passé dans l'URL)
}

// ============================
// ✅ NOUVELLE: Interface pour l'état du formulaire (UI)
// Permet de gérer facilement les sélections dans le formulaire
// ============================

interface ParticipantsFormState {
    familleMetier: FamilleMetier | null;
    selectedPostes: PosteDeTravail[]; // Vide = toute la famille
    structuresByPoste: Map<string, {
        poste: PosteDeTravail;
        structures: Structure[]; // Vide = toutes les structures
        servicesByStructure: Map<string, Service[]>; // Vide = tous les services
    }>;
}

// ============================
// Interface pour gestion d'état dans Redux/Context
// ============================

interface LieuFormationInitialData {
    data: {
        lieuFormations: LieuFormation[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedLieu?: LieuFormation;
}

// ============================
// Payloads API
// ============================

interface CreateLieuFormationPayload {
    themeId: string; // ID du thème parent
    lieuFormation: LieuFormation
}

interface UpdateLieuFormationPayload {
    id: string; // ID du lieu à mettre à jour
    lieuFormationData: Partial<LieuFormation>;
}

interface DeleteLieuFormationPayload {
    id: string; // ID du lieu à supprimer
}

interface GetLieuxFormationPayload {
    themeId: string; // ID du thème parent
    page?: number;
    limit?: number;
    query?: string; // Recherche par nom de lieu
}

// ============================
// Types de retour API
// ============================

interface LieuFormationReturnGetType {
    lieuFormations: LieuFormation[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

interface LieuFormationDropdownType {
    lieuFormations: Array<{
        _id: string;
        lieu: string;
    }>;
}

// ============================
// ✅ BONUS: Interfaces pour les statistiques et utilisateurs ciblés
// ============================

interface ParticipantStatistique {
    familleMetier: FamilleMetier;
    nombreParticipants: number;
    restrictions: number;
}

interface ParticipantsStatsResponse {
    statistiques: ParticipantStatistique[];
    total: number;
}

interface ParticipantsCiblesResponse {
    utilisateurs: Utilisateur[];
    nombre: number;
}

// ============================
// ✅ Helper types pour la manipulation des participants
// ============================

/**
 * Type pour représenter une sélection partielle dans le formulaire
 */
type ParticipantSelection = 
    | { type: 'famille'; familleMetier: FamilleMetier }
    | { type: 'poste'; familleMetier: FamilleMetier; poste: PosteDeTravail }
    | { type: 'structure'; familleMetier: FamilleMetier; poste: PosteDeTravail; structure: Structure }
    | { type: 'service'; familleMetier: FamilleMetier; poste: PosteDeTravail; structure: Structure; service: Service };

/**
 * Type pour l'état complet du formulaire de participants
 */
interface ParticipantsFormCompleteState {
    selections: ParticipantSelection[];
    publicCibleTheme: FamilleMetierRestriction[]; // Public cible du thème (pour validation)
    isValid: boolean;
    errors: string[];
}

// ============================
// ✅ Utilitaires TypeScript pour conversion
// ============================

/**
 * Convertit une FamilleMetierRestriction (backend) en FamilleMetierInput (frontend → backend)
 */
type ConvertToInput<T> = T extends FamilleMetierRestriction
    ? FamilleMetierInput
    : T extends PosteRestriction
    ? PosteInput
    : T extends StructureRestriction
    ? StructureInput
    : T extends ServiceRestriction
    ? ServiceInput
    : never;

/**
 * Helper pour extraire les IDs depuis une structure peuplée
 */
interface ParticipantsConverter {
    toInput(participants: FamilleMetierRestriction[]): FamilleMetierInput[];
    fromInput(input: FamilleMetierInput[], allData: {
        familles: FamilleMetier[];
        postes: PosteDeTravail[];
        structures: Structure[];
        services: Service[];
    }): FamilleMetierRestriction[];
}

// ============================
// Export des types principaux
// ============================

// export type {
//     // Structures principales
//     LieuFormation,
//     LieuFormationInput,
    
//     // Restrictions (réutilisées)
//     FamilleMetierRestriction,
//     PosteRestriction,
//     StructureRestriction,
//     ServiceRestriction,
    
//     // Inputs pour API
//     FamilleMetierInput,
//     PosteInput,
//     StructureInput,
//     ServiceInput,
    
//     // État du formulaire
//     ParticipantsFormState,
//     ParticipantsFormCompleteState,
//     ParticipantSelection,
    
//     // État Redux/Context
//     LieuFormationInitialData,
    
//     // Payloads API
//     CreateLieuFormationPayload,
//     UpdateLieuFormationPayload,
//     DeleteLieuFormationPayload,
//     GetLieuxFormationPayload,
    
//     // Retours API
//     LieuFormationReturnGetType,
//     LieuFormationDropdownType,
//     ParticipantsStatsResponse,
//     ParticipantsCiblesResponse,
//     ParticipantStatistique,
    
//     // Utilitaires
//     ParticipantsConverter,
//     ConvertToInput
// };