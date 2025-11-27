interface ServiceRestriction {
    service: Service; // Service complet peuplé
}

interface StructureRestriction {
    structure: Structure; // Structure complète peuplée
    services?: ServiceRestriction[]; // Si vide, tous les services
}

interface PosteRestriction {
    poste: PosteDeTravail; // Poste complet peuplé
    structures?: StructureRestriction[]; // Si vide, toutes les structures
}

interface FamilleMetierRestriction {
    familleMetier: FamilleMetier; // Famille complète peuplée
    postes?: PosteRestriction[]; // Si vide, toute la famille
}

// ============================
// ThemeFormation retour backend (avec nouvelle structure)
// ============================

interface ThemeFormation {
    _id?: string;
    titreFr: string;
    titreEn: string;
    publicCible?: FamilleMetierRestriction[]; // ✅ MODIFIÉ
    lieux?: LieuFormation[];
    dateDebut: string;
    dateFin: string;
    formateurs?: { formateur: Utilisateur; interne: boolean }[];
    responsable?: Utilisateur;
    supports?: string[];
    formation: Formation;
    nbTachesTotal?: number;
    nbTachesExecutees?: number;
    budgetEstimatif?: number;
    budgetReel?: number;
    duree?: number;
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

interface ThemeFormationInput {
    _id?: string;
    titreFr: string;
    titreEn: string;
    publicCible?: FamilleMetierInput[]; // ✅ Structure hiérarchique
    lieux?: string[]; // IDs des lieux si nécessaire
    dateDebut: string;
    dateFin: string;
    formateurs?: { formateur: string; interne: boolean }[]; // IDs
    responsable?: string; // ID
    supports?: string[];
    formation: string; // ID
}

// ============================
// ✅ NOUVELLE: Interface pour l'état du formulaire (UI)
// Permet de gérer facilement les sélections dans le formulaire
// ============================

interface PublicCibleFormState {
    familleMetier: FamilleMetier | null;
    selectedPostes: PosteDeTravail[]; // Vide = toute la famille
    structuresByPoste: Map<string, {
        poste: PosteDeTravail;
        structures: Structure[]; // Vide = toutes les structures
        servicesByStructure: Map<string, Service[]>; // Vide = tous les services
    }>;
}

// ============================
// Interfaces pour gestion d'état
// ============================

interface ThemeFormationInitialData {
    data: {
        themeFormations: ThemeFormation[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedTheme?: ThemeFormation;
}

// ============================
// Payloads API
// ============================

interface CreateThemeFormationPayload {
    themeFormation: ThemeFormation;
}

interface UpdateThemeFormationPayload {
    id: string;
    themeFormationData: Partial<ThemeFormation>;
}

interface DeleteThemeFormationPayload {
    id: string;
}

interface UpdateRolePayload {
    id: string;
    themeFormationData: Partial<ThemeFormationInput>;
}

interface ThemeFormationReturnGetType {
    themeFormations: ThemeFormation[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}