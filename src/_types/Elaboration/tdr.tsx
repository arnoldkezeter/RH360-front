interface BudgetLigne {
    nature: string;
    type: string;
    quantite: number;
    prixUnitaireHT: number;
    tauxTaxes: number;
    montantTTC: number;
}

interface BudgetTDR {
    lignes: BudgetLigne[];
    totalPrevuHT: number;
    totalPrevuTTC: number;
}

interface FormateurTDR {
    _id?: string;
    utilisateur: string | { _id: string; nom: string; prenom?: string; email?: string; matricule?: string };
    interne: boolean;
}

interface ObjectifTDR {
    _id?: string;
    nomFr: string;
    nomEn: string;
}

interface LieuResume {
    _id: string;
    lieu: string;
    dateDebut?: string;
    dateFin?: string;
}

interface Module {
    id: string;
    texte: string;
    termePrefere: 'module' | 'activite';
}

interface Plage {
    id: string;
    horaire: string;       // ex: "09h00 - 12h30"
    modules: Module[];
    pauseApres?: string;   // pause APRÈS cette plage, avant la suivante
}

interface Jour {
    id: string;
    label: string;         // ex: "Jour 1", "Lundi 05 janvier", ou saisi librement
    plages: Plage[];
}

interface DecoupageHoraire {
    jours: Jour[];         // ← remplace horaireGlobal + plages à plat
}

interface TDRPrefill {
    themeId: string;
    titreFr: string;
    titreEn: string;
    dateDebut: string | null;
    dateFin: string | null;
    duree: number | null;
    responsable: { _id: string; nom: string; prenom?: string; email?: string; matricule?: string } | null;
    lieu: string | null;
    lieux: LieuResume[];
    formateurs: FormateurTDR[];
    objectifsSpecifiques: ObjectifTDR[];
    nombreParticipants: number;
    nombreGroupes: number;
    nombreParticipantsParGroupe: number;
    budget: BudgetTDR;
    // Champs libres
    objectifGeneral: string;
    contexte: string;
    modules: string[];
    responsabilitesDGI: string;
    responsabilitesPartieExterne: string;
    nomPartieExterne: string;
    resultatsAttendus: string;
    methodologie: string;
    decoupageHoraire: DecoupageHoraire;
    organisationGroupes: string;
}

interface TDRFormState extends TDRPrefill {
    // État UI
    isLoading: boolean;
    isGenerating: boolean;
    error: string | null;
    isDirty: boolean; // true si des champs ont été modifiés par l'utilisateur
}

interface TDRGeneratePayload {
    titreFr?: string;
    titreEn?: string;
    dateDebut?: string | null;
    dateFin?: string | null;
    duree?: number | null;
    responsable?: string | null;
    lieu?: string | null;
    formateurs?: Array<{ utilisateur: string; interne: boolean }>;
    objectifsSpecifiques?: Array<{ nomFr: string; nomEn: string }>;
    nombreParticipants?: number;
    objectifGeneral?: string;
    contexte?: string;
    modules?: string[];
    responsabilitesDGI?: string;
    responsabilitesPartieExterne?: string;
    nomPartieExterne?: string;
    resultatsAttendus?: string;
    methodologie?: string;
    decoupageHoraire?: string;
    organisationGroupes?: string;
    creePar: string;
}




