import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: EvaluationChaudInitialData = {
    data: {
        evaluationChauds: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const evaluationChaudSlice = createSlice({
    name: "evaluationChaudSlice",
    initialState,
    reducers: {
        setEvaluationChaudLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageEvaluationChaud(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setEvaluationChauds(state, action: PayloadAction<EvaluationChaudReturnGetType>) {
            state.data = action.payload;
        },
        createEvaluationChaudSlice(state, action: PayloadAction<CreateEvaluationChaudPayload>) {
            state.data.evaluationChauds.unshift(action.payload.evaluationChaud);
        },
        updateEvaluationChaudSlice(state, action: PayloadAction<UpdateEvaluationChaudPayload>) {
            const { id, evaluationChaudData } = action.payload;
            const index = state.data.evaluationChauds.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.evaluationChauds[index] = { ...state.data.evaluationChauds[index], ...evaluationChaudData };
            }
        },
        deleteEvaluationChaudSlice(state, action: PayloadAction<DeleteEvaluationChaudPayload>) {
            const { id } = action.payload;
            state.data.evaluationChauds = state.data.evaluationChauds.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setEvaluationChaudLoading,
    setErrorPageEvaluationChaud,
    setEvaluationChauds,
    createEvaluationChaudSlice,
    updateEvaluationChaudSlice,
    deleteEvaluationChaudSlice
} = evaluationChaudSlice.actions;

// Reducer exporté
export default evaluationChaudSlice.reducer;