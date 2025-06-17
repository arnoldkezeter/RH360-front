import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: EtablissementInitialData = {
    data: {
        etablissements: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const etablissementSlice = createSlice({
    name: "etablissementSlice",
    initialState,
    reducers: {
        setEtablissementLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageEtablissement(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setEtablissements(state, action: PayloadAction<EtablissementReturnGetType>) {
            state.data = action.payload;
        },
        createEtablissementSlice(state, action: PayloadAction<CreateEtablissementPayload>) {
            state.data.etablissements.unshift(action.payload.etablissement);
        },
        updateEtablissementSlice(state, action: PayloadAction<UpdateEtablissementPayload>) {
            const { id, etablissementData } = action.payload;
            const index = state.data.etablissements.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.etablissements[index] = { ...state.data.etablissements[index], ...etablissementData };
            }
        },
        deleteEtablissementSlice(state, action: PayloadAction<DeleteEtablissementPayload>) {
            const { id } = action.payload;
            state.data.etablissements = state.data.etablissements.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setEtablissementLoading,
    setErrorPageEtablissement,
    setEtablissements,
    createEtablissementSlice,
    updateEtablissementSlice,
    deleteEtablissementSlice
} = etablissementSlice.actions;

// Reducer exporté
export default etablissementSlice.reducer;