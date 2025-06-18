import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: AxeStrategiqueInitialData = {
    data: {
        axeStrategiques: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const axeStrategiqueSlice = createSlice({
    name: "axeStrategiqueSlice",
    initialState,
    reducers: {
        setAxeStrategiqueLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageAxeStrategique(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setAxeStrategiques(state, action: PayloadAction<AxeStrategiqueReturnGetType>) {
            state.data = action.payload;
        },
        createAxeStrategiqueSlice(state, action: PayloadAction<CreateAxeStrategiquePayload>) {
            state.data.axeStrategiques.unshift(action.payload.axeStrategique);
        },
        updateAxeStrategiqueSlice(state, action: PayloadAction<UpdateAxeStrategiquePayload>) {
            const { id, axeStrategiqueData } = action.payload;
            const index = state.data.axeStrategiques.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.axeStrategiques[index] = { ...state.data.axeStrategiques[index], ...axeStrategiqueData };
            }
        },
        deleteAxeStrategiqueSlice(state, action: PayloadAction<DeleteAxeStrategiquePayload>) {
            const { id } = action.payload;
            state.data.axeStrategiques = state.data.axeStrategiques.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setAxeStrategiqueLoading,
    setErrorPageAxeStrategique,
    setAxeStrategiques,
    createAxeStrategiqueSlice,
    updateAxeStrategiqueSlice,
    deleteAxeStrategiqueSlice
} = axeStrategiqueSlice.actions;

// Reducer exporté
export default axeStrategiqueSlice.reducer;