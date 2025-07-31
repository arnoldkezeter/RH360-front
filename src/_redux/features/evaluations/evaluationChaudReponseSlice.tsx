import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: EvaluationAChaudReponseInitialData = {
    data: {
        evaluationChauds: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
    selectedEvaluation : undefined
};

// Création du slice
const evaluationAChaudReponseSlice = createSlice({
    name: "evaluationAChaudReponseSlice",
    initialState,
    reducers: {
        setEvaluationSelected(state, action: PayloadAction<EvaluationAChaudReponse | undefined>) {
            state.selectedEvaluation = action.payload;
        },
        setEvaluationAChaudReponseLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageEvaluationAChaudReponse(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setEvaluationAChaudReponses(state, action: PayloadAction<EvaluationAChaudReponseReturnGetType>) {
            state.data = action.payload;
        },
        
        createEvaluationAChaudReponseSlice(state, action: PayloadAction<CreateEvaluationAChaudReponsePayload>) {
            state.data.evaluationChauds.unshift(action.payload.evaluationAChaudReponse);
        },
        updateEvaluationAChaudReponseSlice(state, action: PayloadAction<UpdateEvaluationAChaudReponsePayload>) {
            const { id, evaluationAChaudReponseData } = action.payload;
            const index = state.data.evaluationChauds.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.evaluationChauds[index] = { ...state.data.evaluationChauds[index], ...evaluationAChaudReponseData };
            }
        },
        deleteEvaluationAChaudReponseSlice(state, action: PayloadAction<DeleteEvaluationAChaudReponsePayload>) {
            const { id } = action.payload;
            state.data.evaluationChauds = state.data.evaluationChauds.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setEvaluationSelected,
    setEvaluationAChaudReponseLoading,
    setErrorPageEvaluationAChaudReponse,
    setEvaluationAChaudReponses,
    createEvaluationAChaudReponseSlice,
    updateEvaluationAChaudReponseSlice,
    deleteEvaluationAChaudReponseSlice
} = evaluationAChaudReponseSlice.actions;

// Reducer exporté
export default evaluationAChaudReponseSlice.reducer;