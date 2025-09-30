interface NoteDeService{
    reference:string;
    theme: ThemeFormation,
    typeNote: string;
    titreFr:string;
    titreEn:string;
    participants?: [Utilisateur],
    stagiaires?: [Stagiaire],
    responsables?: [Utilisateur],
    copieA: [string],
    fichierJoint :  string,// note signée scannée
    creePar:Utilisateur,
    valideParDG: boolean

}



interface NoteDeServiceInitialData {
    data: {
        noteDeServices: NoteDeService[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateNoteDeServicePayload {
    noteDeService: NoteDeService; // Données de l'événement à créer
}

interface UpdateNoteDeServicePayload {
    id: string; // ID de l'événement à mettre à jour
    noteDeServiceData: Partial<NoteDeService>; // Données mises à jour de l'événement
}
interface DeleteNoteDeServicePayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    noteDeServiceData: Partial<NoteDeService>; // Données mises à jour de l'événement
}
interface NoteDeServiceReturnGetType {
    noteDeServices: NoteDeService[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}