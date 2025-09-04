import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: StageInitialData = {
    data: {
        stages: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    selectedStage:undefined,
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const stageSlice = createSlice({
    name: "stageSlice",
    initialState,
    reducers: {
        setStageSelected(state, action: PayloadAction<Stage | undefined>) {
            state.selectedStage = action.payload;
        },
        setStagesLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageStage(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setStages(state, action: PayloadAction<StageReturnGetType>) {
            state.data = action.payload;
        },
        createStageSlice(state, action: PayloadAction<CreateStagePayload>) {
            state.data.stages.unshift(action.payload.stage);
        },


        updateStageSlice(state, action: PayloadAction<UpdateStagePayload>) {
            const { id, stageData } = action.payload;
            const index = state.data.stages.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.stages[index] = { ...state.data.stages[index], ...stageData };
            }
        },

        deleteStageSlice(state, action: PayloadAction<DeleteStagePayload>) {
            const { id } = action.payload;
            state.data.stages = state.data.stages.filter(e => e._id !== id);
        },

        setUser: (state, action: PayloadAction<Stage>) => {
            return { ...state, ...action.payload };
        },

        
    },
});

// Actions exportées
export const {
    setStageSelected,
    setStagesLoading,
    setErrorPageStage,
    setStages,
    createStageSlice,
    updateStageSlice,
    deleteStageSlice,
} = stageSlice.actions;

// Reducer exporté
export default stageSlice.reducer;