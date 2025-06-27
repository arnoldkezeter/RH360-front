interface ExecutionRateItem {
    id: string,
    titreFr: string,
    titreEn: string,
    nbTaches:number,
    nbTachesExecutees:number,
    tauxExecution:number,
};

interface ExecutionRateResult {
  tauxExecutionGlobal: number;          // Taux global (toutes entités confondues)
  details: ExecutionRateItem[]; // Liste des taux par axe ou thème
};