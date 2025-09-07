
// Définir le type de données pour une structure
interface Structure {
    _id?: string;
    nomFr: string;
    nomEn: string;
    descriptionFr?:string;
    descriptionEn?:string;
}

interface StructureInitialData {
    data: {
        structures: Structure[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateStructurePayload {
    structure: Structure; // Données de l'événement à créer
}

interface UpdateStructurePayload {
    id: string; // ID de l'événement à mettre à jour
    structureData: Partial<Structure>; // Données mises à jour de l'événement
}

interface DeleteStructurePayload {
    id: string; // ID de l'événement à supprimer
}

interface StructureReturnGetType {
    structures: Structure[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}

interface StructureAssignment {
  structureId?: string;
  superviseurId?: string;
  dateDebut?: string;
  dateFin?: string;
  _structureRef?:Structure;
  _superviseurRef?:Utilisateur;
}


interface StructureGroupAssignment extends Structure {
  superviseur?: Utilisateur;
}