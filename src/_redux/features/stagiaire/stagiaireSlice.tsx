import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: StagiaireInitialData = {
    data: {
        stagiaires: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    selectedStagiaire:undefined,
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const stagiaireSlice = createSlice({
    name: "stagiaireSlice",
    initialState,
    reducers: {
        setStagiaireSelected(state, action: PayloadAction<Stagiaire | undefined>) {
            state.selectedStagiaire = action.payload;
        },
        setStagiairesLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageStagiaire(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setStagiaires(state, action: PayloadAction<StagiaireReturnGetType>) {
            state.data = action.payload;
        },
        createStagiaireSlice(state, action: PayloadAction<CreateStagiairePayload>) {
            state.data.stagiaires.unshift(action.payload.stagiaire);
        },


        updateStagiaireSlice(state, action: PayloadAction<UpdateStagiairePayload>) {
            const { id, stagiaireData } = action.payload;
            const index = state.data.stagiaires.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.stagiaires[index] = { ...state.data.stagiaires[index], ...stagiaireData };
            }
        },

        deleteStagiaireSlice(state, action: PayloadAction<DeleteStagiairePayload>) {
            const { id } = action.payload;
            state.data.stagiaires = state.data.stagiaires.filter(e => e._id !== id);
        },

        setUser: (state, action: PayloadAction<Stagiaire>) => {
            return { ...state, ...action.payload };
        },

        
    },
});

// Actions exportées
export const {
    setStagiaireSelected,
    setStagiairesLoading,
    setErrorPageStagiaire,
    setStagiaires,
    createStagiaireSlice,
    updateStagiaireSlice,
    deleteStagiaireSlice,
} = stagiaireSlice.actions;

// Reducer exporté
export default stagiaireSlice.reducer;