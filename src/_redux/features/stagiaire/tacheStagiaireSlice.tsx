import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: TacheStagiaireInitialData = {
    data: {
        tachesStagiaire: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const tachesStagiairelice = createSlice({
    name: "tachesStagiairelice",
    initialState,
    reducers: {
        setTacheStagiaireLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageTacheStagiaire(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setTachesStagiaire(state, action: PayloadAction<TacheStagiaireReturnGetType>) {
            state.data = action.payload;
        },
        createTacheStagiaireSlice(state, action: PayloadAction<CreateTacheStagiairePayload>) {
            state.data.tachesStagiaire.unshift(action.payload.tacheStagiaire);
        },
        updateTacheStagiaireSlice(state, action: PayloadAction<UpdateTacheStagiairePayload>) {
            const { id, tacheStagiaireData } = action.payload;
            const index = state.data.tachesStagiaire.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.tachesStagiaire[index] = { ...state.data.tachesStagiaire[index], ...tacheStagiaireData };
            }
        },
        deleteTacheStagiaireSlice(state, action: PayloadAction<DeleteTacheStagiairePayload>) {
            const { id } = action.payload;
            state.data.tachesStagiaire = state.data.tachesStagiaire.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setTacheStagiaireLoading,
    setErrorPageTacheStagiaire,
    setTachesStagiaire,
    createTacheStagiaireSlice,
    updateTacheStagiaireSlice,
    deleteTacheStagiaireSlice
} = tachesStagiairelice.actions;

// Reducer exporté
export default tachesStagiairelice.reducer;