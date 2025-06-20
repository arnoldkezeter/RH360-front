import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: CohorteInitialData = {
    data: {
        cohortes: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const cohorteSlice = createSlice({
    name: "cohorteSlice",
    initialState,
    reducers: {
        setCohorteLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageCohorte(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setCohortes(state, action: PayloadAction<CohorteReturnGetType>) {
            state.data = action.payload;
        },
        createCohorteSlice(state, action: PayloadAction<CreateCohortePayload>) {
            state.data.cohortes.unshift(action.payload.cohorte);
        },
        updateCohorteSlice(state, action: PayloadAction<UpdateCohortePayload>) {
            const { id, cohorteData } = action.payload;
            const index = state.data.cohortes.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.cohortes[index] = { ...state.data.cohortes[index], ...cohorteData };
            }
        },
        deleteCohorteSlice(state, action: PayloadAction<DeleteCohortePayload>) {
            const { id } = action.payload;
            state.data.cohortes = state.data.cohortes.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setCohorteLoading,
    setErrorPageCohorte,
    setCohortes,
    createCohorteSlice,
    updateCohorteSlice,
    deleteCohorteSlice
} = cohorteSlice.actions;

// Reducer exporté
export default cohorteSlice.reducer;