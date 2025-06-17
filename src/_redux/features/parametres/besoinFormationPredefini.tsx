import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: BesoinFormationPredefiniInitialData = {
    data: {
        besoinFormationPredefinis: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const besoinFormationPredefiniSlice = createSlice({
    name: "besoinFormationPredefiniSlice",
    initialState,
    reducers: {
        setBesoinFormationPredefiniLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageBesoinFormationPredefini(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setBesoinFormationPredefinis(state, action: PayloadAction<BesoinFormationPredefiniReturnGetType>) {
            state.data = action.payload;
        },
        createBesoinFormationPredefiniSlice(state, action: PayloadAction<CreateBesoinFormationPredefiniPayload>) {
            state.data.besoinFormationPredefinis.unshift(action.payload.besoinFormationPredefini);
        },
        updateBesoinFormationPredefiniSlice(state, action: PayloadAction<UpdateBesoinFormationPredefiniPayload>) {
            const { id, besoinFormationPredefiniData } = action.payload;
            const index = state.data.besoinFormationPredefinis.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.besoinFormationPredefinis[index] = { ...state.data.besoinFormationPredefinis[index], ...besoinFormationPredefiniData };
            }
        },
        deleteBesoinFormationPredefiniSlice(state, action: PayloadAction<DeleteBesoinFormationPredefiniPayload>) {
            const { id } = action.payload;
            state.data.besoinFormationPredefinis = state.data.besoinFormationPredefinis.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setBesoinFormationPredefiniLoading,
    setErrorPageBesoinFormationPredefini,
    setBesoinFormationPredefinis,
    createBesoinFormationPredefiniSlice,
    updateBesoinFormationPredefiniSlice,
    deleteBesoinFormationPredefiniSlice
} = besoinFormationPredefiniSlice.actions;

// Reducer exporté
export default besoinFormationPredefiniSlice.reducer;