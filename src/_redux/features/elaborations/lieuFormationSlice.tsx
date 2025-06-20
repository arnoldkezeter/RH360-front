import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: LieuFormationInitialData = {
    data: {
        lieuFormations: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const lieuFormationSlice = createSlice({
    name: "lieuFormationSlice",
    initialState,
    reducers: {
        
        setLieuFormationLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageLieuFormation(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setLieuFormations(state, action: PayloadAction<LieuFormationReturnGetType>) {
            state.data = action.payload;
        },
        createLieuFormationSlice(state, action: PayloadAction<CreateLieuFormationPayload>) {
            state.data.lieuFormations.unshift(action.payload.lieuFormation);
        },
        updateLieuFormationSlice(state, action: PayloadAction<UpdateLieuFormationPayload>) {
            const { id, lieuFormationData } = action.payload;
            const index = state.data.lieuFormations.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.lieuFormations[index] = { ...state.data.lieuFormations[index], ...lieuFormationData };
            }
        },
        deleteLieuFormationSlice(state, action: PayloadAction<DeleteLieuFormationPayload>) {
            const { id } = action.payload;
            state.data.lieuFormations = state.data.lieuFormations.filter(e => e._id !== id);
        },

       
    
    },
});

// Actions exportées
export const {
    setLieuFormationLoading,
    setErrorPageLieuFormation,
    setLieuFormations,
    createLieuFormationSlice,
    updateLieuFormationSlice,
    deleteLieuFormationSlice,
    
} = lieuFormationSlice.actions;

// Reducer exporté
export default lieuFormationSlice.reducer;