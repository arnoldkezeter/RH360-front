import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: BesoinFormationPredefiniInitialData = {
    data: {
        besoinsFormationPredefinis: [],
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
            state.data.besoinsFormationPredefinis.unshift(action.payload.besoinFormationPredefini);
        },
        updateBesoinFormationPredefiniSlice(state, action: PayloadAction<UpdateBesoinFormationPredefiniPayload>) {
            const { id, besoinFormationPredefiniData } = action.payload;
            console.log(state.data.besoinsFormationPredefinis)
            const index = state.data.besoinsFormationPredefinis.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.besoinsFormationPredefinis[index] = { ...state.data.besoinsFormationPredefinis[index], ...besoinFormationPredefiniData };
            }
        },
        deleteBesoinFormationPredefiniSlice(state, action: PayloadAction<DeleteBesoinFormationPredefiniPayload>) {
            const { id } = action.payload;
            state.data.besoinsFormationPredefinis = state.data.besoinsFormationPredefinis.filter(e => e._id !== id);
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