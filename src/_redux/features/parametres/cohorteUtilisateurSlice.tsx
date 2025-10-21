import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: CohorteUtilisateurInitialData = {
    data: {
        participants: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const cohorteutilisateurSlice = createSlice({
    name: "cohorteUtilisateurSlice",
    initialState,
    reducers: {
        setCohorteUtilisateurLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageCohorteUtilisateur(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setCohorteUtilisateurs(state, action: PayloadAction<CohorteUtilisateurReturnGetType>) {
            state.data = action.payload;
        },
        createCohorteUtilisateurSlice(state, action: PayloadAction<CreateCohorteUtilisateurPayload>) {
            state.data.participants.unshift(action.payload.participant);
        },
        updateCohorteUtilisateurSlice(state, action: PayloadAction<UpdateCohorteUtilisateurPayload>) {
            const { id, participantData } = action.payload;
            const index = state.data.participants.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.participants[index] = { ...state.data.participants[index], ...participantData };
            }
        },
        deleteCohorteUtilisateurSlice(state, action: PayloadAction<DeleteCohorteUtilisateurPayload>) {
            const { id } = action.payload;
            state.data.participants = state.data.participants.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setCohorteUtilisateurLoading,
    setErrorPageCohorteUtilisateur,
    setCohorteUtilisateurs,
    createCohorteUtilisateurSlice,
    updateCohorteUtilisateurSlice,
    deleteCohorteUtilisateurSlice
} = cohorteutilisateurSlice.actions;

// Reducer exporté
export default cohorteutilisateurSlice.reducer;