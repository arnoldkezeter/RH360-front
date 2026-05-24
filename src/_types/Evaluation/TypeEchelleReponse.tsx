
interface TypeEchelleReponse {
    _id?: string;
    nomFr: string;
    nomEn: string;
    descriptionFr?: string;
    descriptionEn?: string;
}

interface TypeEchelleReponseInitialData {
    data: {
        typeEchelleReponses: TypeEchelleReponse[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedTypeEchelleReponse: TypeEchelleReponse | undefined;
}

interface CreateTypeEchelleReponsePayload { typeEchelleReponse: TypeEchelleReponse; }
interface UpdateTypeEchelleReponsePayload { id: string; typeEchelleReponseData: Partial<TypeEchelleReponse>; }
interface DeleteTypeEchelleReponsePayload { id: string; }
interface TypeEchelleReponseReturnGetType {
    typeEchelleReponses: TypeEchelleReponse[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}
