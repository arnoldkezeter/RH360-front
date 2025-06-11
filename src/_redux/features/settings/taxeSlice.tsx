import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: TaxeInitialData = {
    data: {
        taxes: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const taxeSlice = createSlice({
    name: "taxeSlice",
    initialState,
    reducers: {
        setTaxeLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageTaxe(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setTaxes(state, action: PayloadAction<TaxeReturnGetType>) {
            state.data = action.payload;
        },
        createTaxeSlice(state, action: PayloadAction<CreateTaxePayload>) {
            state.data.taxes.unshift(action.payload.taxe);
        },
        updateTaxeSlice(state, action: PayloadAction<UpdateTaxePayload>) {
            const { id, taxeData } = action.payload;
            const index = state.data.taxes.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.taxes[index] = { ...state.data.taxes[index], ...taxeData };
            }
        },
        deleteTaxeSlice(state, action: PayloadAction<DeleteTaxePayload>) {
            const { id } = action.payload;
            state.data.taxes = state.data.taxes.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setTaxeLoading,
    setErrorPageTaxe,
    setTaxes,
    createTaxeSlice,
    updateTaxeSlice,
    deleteTaxeSlice
} = taxeSlice.actions;

// Reducer exporté
export default taxeSlice.reducer;