
interface NoteService{
    _id?:string,
    reference?:string,
    titreFr: string,
    titreEn: string,
    descriptionFr?: string,
    descriptionEn?: string,
    theme?: ThemeFormation,
    stage?: Stage,
    mandat?: StageRecherche,
    typeNote: string,
    sousTypeConvocation?:string,
    designationTuteur?:string,
    miseEnOeuvre?:string,
    dispositions?:string,
    personnesResponsables?:string,
    copieA: string,
    fichierJoint ?:  string,// note signée scannée
    filePath?:string,
    creePar?:Utilisateur
    valideParDG?: Boolean,
    createdAt?:string,
    updatedAt?:string
}


interface NoteServiceInitialData {
    data: {
        noteServices: NoteService[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedTheme:NoteService | undefined
}

interface CreateNoteServicePayload {
    noteService: NoteService; // Données de l'événement à créer
}

interface UpdateNoteServicePayload {
    id: string; // ID de l'événement à mettre à jour
    noteServiceData: Partial<NoteService>; // Données mises à jour de l'événement
}
interface DeleteNoteServicePayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    noteServiceData: Partial<NoteService>; // Données mises à jour de l'événement
}
interface NoteServiceReturnGetType {
    noteServices: NoteService[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

interface CreateNoteInput {
    titreFr: string,
    titreEn: string,
    descriptionFr?: string,
    descriptionEn?: string,
    theme?: string,
    stage?: string,
    mandat?: string,
    typeNote: string,
    designationTuteur?:string,
    miseEnOeuvre?:string,
    dispositions?:string,
    personnesResponsables?:string,
    copieA: string,
    fichierJoint ?:  string,// note signée scannée
    creePar?:string
    valideParDG?: Boolean
    lieuId?:string
}

interface UpdateNoteInput {
    _id:string;
    titreFr: string,
    titreEn: string,
    descriptionFr?: string,
    descriptionEn?: string,
    theme?: string,
    stage?: string,
    mandat?: string,
    typeNote: string,
    copieA: string,
    designationTuteur?:string,
    miseEnOeuvre?:string,
    dispositions?:string,
    personnesResponsables?:string,
    fichierJoint ?: string,// note signée scannée
    creePar?:string
    valideParDG?: Boolean
}