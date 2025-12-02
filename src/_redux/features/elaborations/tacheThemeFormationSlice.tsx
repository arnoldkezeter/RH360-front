import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: TacheThemeFormationInitialData = {
    data: {
        tachesThemeFormation: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const tachethemeformationSlice = createSlice({
    name: "tacheThemeFormationSlice",
    initialState,
    reducers: {
        setTacheThemeFormationLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageTacheThemeFormation(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setTacheThemeFormations(state, action: PayloadAction<TacheThemeFormationReturnGetType>) {
            state.data = action.payload;
        },
        createTacheThemeFormationSlice(state, action: PayloadAction<CreateTacheThemeFormationPayload>) {
            state.data.tachesThemeFormation.unshift(action.payload.tacheThemeFormation);
        },
        updateTacheThemeFormationSlice(state, action: PayloadAction<UpdateTacheThemeFormationPayload>) {
            const { id, tacheThemeFormationData } = action.payload;
            const index = state.data.tachesThemeFormation.findIndex(e => e.tache._id === id);
            if (index !== -1) {
                state.data.tachesThemeFormation[index] = { ...state.data.tachesThemeFormation[index], ...tacheThemeFormationData };
            }
        },
        deleteTacheThemeFormationSlice(state, action: PayloadAction<DeleteTacheThemeFormationPayload>) {
            const { id } = action.payload;
            state.data.tachesThemeFormation = state.data.tachesThemeFormation.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setTacheThemeFormationLoading,
    setErrorPageTacheThemeFormation,
    setTacheThemeFormations,
    createTacheThemeFormationSlice,
    updateTacheThemeFormationSlice,
    deleteTacheThemeFormationSlice
} = tachethemeformationSlice.actions;

// Reducer exporté
export default tachethemeformationSlice.reducer;