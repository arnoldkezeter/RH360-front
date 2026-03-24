
interface UtilisateurNonTraite {
  numeroLigne: number;
  matricule: string | null;
  nom: string | null;
  email: string | null;
  raisons: string[];
  avertissements?: string[];
}

interface StatsImport {
  utilisateursCrees: number;
  utilisateursMisAJour: number;
  utilisateursIgnores: number;
  nouvellesRegions: number;
  nouveauxDepartements: number;
  nouvellesCommunes: number;
  nouveauxGrades: number;
  nouvellesCategories: number;
  nouvellesStructures: number;
  nouveauxServices: number;
  nouveauxPostes: number;
}

interface ResultatImport {
  success: boolean;
  message: string;
  stats: StatsImport;
  utilisateursNonTraites: UtilisateurNonTraite[];
}
