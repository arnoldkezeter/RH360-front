import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: DepenseInitialData = {
    data: {
        depenses: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const depenseSlice = createSlice({
    name: "depenseSlice",
    initialState,
    reducers: {
        setDepenseLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageDepense(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setDepenses(state, action: PayloadAction<DepenseReturnGetType>) {
            state.data = action.payload;
        },
        createDepenseSlice(state, action: PayloadAction<CreateDepensePayload>) {
            state.data.depenses.unshift(action.payload.depense);
        },
        updateDepenseSlice(state, action: PayloadAction<UpdateDepensePayload>) {
            const { id, depenseData } = action.payload;
            const index = state.data.depenses.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.depenses[index] = { ...state.data.depenses[index], ...depenseData };
            }
        },
        deleteDepenseSlice(state, action: PayloadAction<DeleteDepensePayload>) {
            const { id } = action.payload;
            state.data.depenses = state.data.depenses.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setDepenseLoading,
    setErrorPageDepense,
    setDepenses,
    createDepenseSlice,
    updateDepenseSlice,
    deleteDepenseSlice
} = depenseSlice.actions;

// Reducer exporté
export default depenseSlice.reducer;