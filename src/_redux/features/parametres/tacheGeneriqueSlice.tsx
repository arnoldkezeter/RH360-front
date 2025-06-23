import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: TacheGeneriqueInitialData = {
    data: {
        tacheGeneriques: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const tacheGeneriqueSlice = createSlice({
    name: "tacheGeneriqueSlice",
    initialState,
    reducers: {
        setTacheGeneriqueLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageTacheGenerique(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setTacheGeneriques(state, action: PayloadAction<TacheGeneriqueReturnGetType>) {
            state.data = action.payload;
        },
        createTacheGeneriqueSlice(state, action: PayloadAction<CreateTacheGeneriquePayload>) {
            state.data.tacheGeneriques.unshift(action.payload.tacheGenerique);
        },
        updateTacheGeneriqueSlice(state, action: PayloadAction<UpdateTacheGeneriquePayload>) {
            const { id, tacheGeneriqueData } = action.payload;
            const index = state.data.tacheGeneriques.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.tacheGeneriques[index] = { ...state.data.tacheGeneriques[index], ...tacheGeneriqueData };
            }
        },
        deleteTacheGeneriqueSlice(state, action: PayloadAction<DeleteTacheGeneriquePayload>) {
            const { id } = action.payload;
            state.data.tacheGeneriques = state.data.tacheGeneriques.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setTacheGeneriqueLoading,
    setErrorPageTacheGenerique,
    setTacheGeneriques,
    createTacheGeneriqueSlice,
    updateTacheGeneriqueSlice,
    deleteTacheGeneriqueSlice
} = tacheGeneriqueSlice.actions;

// Reducer exporté
export default tacheGeneriqueSlice.reducer;