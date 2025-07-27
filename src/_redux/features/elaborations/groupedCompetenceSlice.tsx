import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: GroupedCompetenceInitialData = {
    data: {
        groupedCompetences: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const groupedCompetenceSlice = createSlice({
    name: "groupedCompetenceSlice",
    initialState,
    reducers: {
        setGroupedCompetenceLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageGroupedCompetence(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setGroupedCompetences(state, action: PayloadAction<GroupedCompetenceReturnGetType>) {
            state.data = action.payload;
        },
       createGroupedCompetenceSlice(state, action: PayloadAction<CreateGroupedCompetencePayload>) {
            const newAutoEvaluation = action.payload.groupedCompetence;
            
            // Vérifier si l'élément existe déjà (mise à jour d'un élément existant)
            const existingIndex = state.data.groupedCompetences.findIndex(
                e => e._id === newAutoEvaluation._id
            );
            
            if (existingIndex !== -1) {
                // Mettre à jour l'élément existant
                state.data.groupedCompetences[existingIndex] = newAutoEvaluation;
            }
        },
        updateGroupedCompetenceSlice(state, action: PayloadAction<UpdateGroupedCompetencePayload>) {
            const { id, groupedCompetenceData } = action.payload;
            const index = state.data.groupedCompetences.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.groupedCompetences[index] = { ...state.data.groupedCompetences[index], ...groupedCompetenceData };
            }
        },
    },
});

// Actions exportées
export const {
    setGroupedCompetenceLoading,
    setErrorPageGroupedCompetence,
    setGroupedCompetences,
    createGroupedCompetenceSlice,
    updateGroupedCompetenceSlice,
} = groupedCompetenceSlice.actions;

// Reducer exporté
export default groupedCompetenceSlice.reducer;