import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: FamilleMetierInitialData = {
    data: {
        familleMetiers: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const famillemetierSlice = createSlice({
    name: "famillemetierSlice",
    initialState,
    reducers: {
        setFamilleMetierLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageFamilleMetier(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setFamilleMetiers(state, action: PayloadAction<FamilleMetierReturnGetType>) {
            state.data = action.payload;
        },
        createFamilleMetierSlice(state, action: PayloadAction<CreateFamilleMetierPayload>) {
            state.data.familleMetiers.unshift(action.payload.familleMetier);
        },
        updateFamilleMetierSlice(state, action: PayloadAction<UpdateFamilleMetierPayload>) {
            const { id, familleMetierData } = action.payload;
            const index = state.data.familleMetiers.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.familleMetiers[index] = { ...state.data.familleMetiers[index], ...familleMetierData };
            }
        },
        deleteFamilleMetierSlice(state, action: PayloadAction<DeleteFamilleMetierPayload>) {
            const { id } = action.payload;
            state.data.familleMetiers = state.data.familleMetiers.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setFamilleMetierLoading,
    setErrorPageFamilleMetier,
    setFamilleMetiers,
    createFamilleMetierSlice,
    updateFamilleMetierSlice,
    deleteFamilleMetierSlice
} = famillemetierSlice.actions;

// Reducer exporté
export default famillemetierSlice.reducer;