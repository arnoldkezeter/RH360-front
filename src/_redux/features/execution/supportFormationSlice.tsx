import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: SupportFormationInitialData = {
    data: {
        supportFormations: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const supportFormationSlice = createSlice({
    name: "supportFormationSlice",
    initialState,
    reducers: {
        setSupportFormationLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageSupportFormation(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setSupportFormations(state, action: PayloadAction<SupportFormationReturnGetType>) {
            state.data = action.payload;
        },
        createSupportFormationSlice(state, action: PayloadAction<CreateSupportFormationPayload>) {
            state.data.supportFormations.unshift(action.payload.supportFormation);
        },
        updateSupportFormationSlice(state, action: PayloadAction<UpdateSupportFormationPayload>) {
            const { id, supportFormationData } = action.payload;
            const index = state.data.supportFormations.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.supportFormations[index] = { ...state.data.supportFormations[index], ...supportFormationData };
            }
        },
        deleteSupportFormationSlice(state, action: PayloadAction<DeleteSupportFormationPayload>) {
            const { id } = action.payload;
            state.data.supportFormations = state.data.supportFormations.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setSupportFormationLoading,
    setErrorPageSupportFormation,
    setSupportFormations,
    createSupportFormationSlice,
    updateSupportFormationSlice,
    deleteSupportFormationSlice
} = supportFormationSlice.actions;

// Reducer exporté
export default supportFormationSlice.reducer;