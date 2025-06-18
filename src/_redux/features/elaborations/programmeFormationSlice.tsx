import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: ProgrammeFormationInitialData = {
    data: {
        programmeFormations: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const programmeformationSlice = createSlice({
    name: "programmeFormationSlice",
    initialState,
    reducers: {
        setProgrammeFormationLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageProgrammeFormation(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setProgrammeFormations(state, action: PayloadAction<ProgrammeFormationReturnGetType>) {
            state.data = action.payload;
        },
        createProgrammeFormationSlice(state, action: PayloadAction<CreateProgrammeFormationPayload>) {
            state.data.programmeFormations.unshift(action.payload.programmeFormation);
        },
        updateProgrammeFormationSlice(state, action: PayloadAction<UpdateProgrammeFormationPayload>) {
            const { id, programmeFormationData } = action.payload;
            const index = state.data.programmeFormations.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.programmeFormations[index] = { ...state.data.programmeFormations[index], ...programmeFormationData };
            }
        },
        deleteProgrammeFormationSlice(state, action: PayloadAction<DeleteProgrammeFormationPayload>) {
            const { id } = action.payload;
            state.data.programmeFormations = state.data.programmeFormations.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setProgrammeFormationLoading,
    setErrorPageProgrammeFormation,
    setProgrammeFormations,
    createProgrammeFormationSlice,
    updateProgrammeFormationSlice,
    deleteProgrammeFormationSlice
} = programmeformationSlice.actions;

// Reducer exporté
export default programmeformationSlice.reducer;