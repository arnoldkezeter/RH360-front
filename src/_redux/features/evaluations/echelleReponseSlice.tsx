import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: EchelleReponseInitialData = {
    data: {
        echelleReponses: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const echelleReponseSlice = createSlice({
    name: "echelleReponseSlice",
    initialState,
    reducers: {
        setEchelleReponseLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageEchelleReponse(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setEchelleReponses(state, action: PayloadAction<EchelleReponseReturnGetType>) {
            state.data = action.payload;
        },
        createEchelleReponseSlice(state, action: PayloadAction<CreateEchelleReponsePayload>) {
            state.data.echelleReponses.unshift(action.payload.echelleReponse);
        },
        updateEchelleReponseSlice(state, action: PayloadAction<UpdateEchelleReponsePayload>) {
            const { id, echelleReponseData } = action.payload;
            const index = state.data.echelleReponses.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.echelleReponses[index] = { ...state.data.echelleReponses[index], ...echelleReponseData };
            }
        },
        deleteEchelleReponseSlice(state, action: PayloadAction<DeleteEchelleReponsePayload>) {
            const { id } = action.payload;
            state.data.echelleReponses = state.data.echelleReponses.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setEchelleReponseLoading,
    setErrorPageEchelleReponse,
    setEchelleReponses,
    createEchelleReponseSlice,
    updateEchelleReponseSlice,
    deleteEchelleReponseSlice
} = echelleReponseSlice.actions;

// Reducer exporté
export default echelleReponseSlice.reducer;