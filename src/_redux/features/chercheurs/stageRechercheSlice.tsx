import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: StageRechercheInitialData = {
    data: {
        stageRecherches: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const stagerechercheSlice = createSlice({
    name: "stageRechercheSlice",
    initialState,
    reducers: {
        
        setStageRecherchesLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageStageRecherche(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setStageRecherches(state, action: PayloadAction<StageRechercheReturnGetType>) {
            state.data = action.payload;
        },
        createStageRechercheSlice(state, action: PayloadAction<CreateStageRecherchePayload>) {
            state.data.stageRecherches.unshift(action.payload.stageRecherche);
        },


        updateStageRechercheSlice(state, action: PayloadAction<UpdateStageRecherchePayload>) {
            const { id, stageRechercheData } = action.payload;
            const index = state.data.stageRecherches.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.stageRecherches[index] = { ...state.data.stageRecherches[index], ...stageRechercheData };
            }
        },

        deleteStageRechercheSlice(state, action: PayloadAction<DeleteStageRecherchePayload>) {
            const { id } = action.payload;
            state.data.stageRecherches = state.data.stageRecherches.filter(e => e._id !== id);
        },

        setUser: (state, action: PayloadAction<StageRecherche>) => {
            return { ...state, ...action.payload };
        },

        
    },
});

// Actions exportées
export const {
    setStageRecherchesLoading,
    setErrorPageStageRecherche,
    setStageRecherches,
    createStageRechercheSlice,
    updateStageRechercheSlice,
    deleteStageRechercheSlice,
} = stagerechercheSlice.actions;

// Reducer exporté
export default stagerechercheSlice.reducer;