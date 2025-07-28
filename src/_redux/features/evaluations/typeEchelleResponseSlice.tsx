import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: TypeEchelleReponseInitialData = {
    data: {
        typeEchelleReponses: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
    selectedTypeEchelleReponse:undefined
};

// Création du slice
const typeEchelleReponseSlice = createSlice({
    name: "typeEchelleReponseSlice",
    initialState,
    reducers: {
        setTypeEchelleReponseSelected(state, action: PayloadAction<TypeEchelleReponse | undefined>) {
            state.selectedTypeEchelleReponse = action.payload;
        },
        setTypeEchelleReponseLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageTypeEchelleReponse(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setTypeEchelleReponses(state, action: PayloadAction<TypeEchelleReponseReturnGetType>) {
            state.data = action.payload;
        },
        createTypeEchelleReponseSlice(state, action: PayloadAction<CreateTypeEchelleReponsePayload>) {
            state.data.typeEchelleReponses.unshift(action.payload.typeEchelleReponse);
        },
        updateTypeEchelleReponseSlice(state, action: PayloadAction<UpdateTypeEchelleReponsePayload>) {
            const { id, typeEchelleReponseData } = action.payload;
            const index = state.data.typeEchelleReponses.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.typeEchelleReponses[index] = { ...state.data.typeEchelleReponses[index], ...typeEchelleReponseData };
            }
        },
        deleteTypeEchelleReponseSlice(state, action: PayloadAction<DeleteTypeEchelleReponsePayload>) {
            const { id } = action.payload;
            state.data.typeEchelleReponses = state.data.typeEchelleReponses.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setTypeEchelleReponseSelected,
    setTypeEchelleReponseLoading,
    setErrorPageTypeEchelleReponse,
    setTypeEchelleReponses,
    createTypeEchelleReponseSlice,
    updateTypeEchelleReponseSlice,
    deleteTypeEchelleReponseSlice
} = typeEchelleReponseSlice.actions;

// Reducer exporté
export default typeEchelleReponseSlice.reducer;