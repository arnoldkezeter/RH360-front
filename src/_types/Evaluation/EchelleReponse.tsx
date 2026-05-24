
interface EchelleReponse {
    _id?: string;
    nomFr: string;
    nomEn: string;
    ordre: number;
    typeEchelle?: TypeEchelleReponse;
}

interface EchelleReponseInitialData {
    data: {
        echelleReponses: EchelleReponse[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateEchelleReponsePayload { echelleReponse: EchelleReponse; }
interface UpdateEchelleReponsePayload { id: string; echelleReponseData: Partial<EchelleReponse>; }
interface DeleteEchelleReponsePayload { id: string; }
interface EchelleReponseReturnGetType {
    echelleReponses: EchelleReponse[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}