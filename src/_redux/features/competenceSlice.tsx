import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: CompetenceInitialData = {
    data: {
        competences: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const competenceSlice = createSlice({
    name: "competenceSlice",
    initialState,
    reducers: {
        setCompetenceLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageCompetence(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setCompetences(state, action: PayloadAction<CompetenceReturnGetType>) {
            state.data = action.payload;
        },
        createCompetenceSlice(state, action: PayloadAction<CreateCompetencePayload>) {
            state.data.competences.unshift(action.payload.competence);
        },
        updateCompetenceSlice(state, action: PayloadAction<UpdateCompetencePayload>) {
            const { id, competenceData } = action.payload;
            const index = state.data.competences.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.competences[index] = { ...state.data.competences[index], ...competenceData };
            }
        },
        deleteCompetenceSlice(state, action: PayloadAction<DeleteCompetencePayload>) {
            const { id } = action.payload;
            state.data.competences = state.data.competences.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setCompetenceLoading,
    setErrorPageCompetence,
    setCompetences,
    createCompetenceSlice,
    updateCompetenceSlice,
    deleteCompetenceSlice
} = competenceSlice.actions;

// Reducer exporté
export default competenceSlice.reducer;