import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: ParticipantFormationInitialData = {
    data: {
        participantFormations: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const participantFormationSlice = createSlice({
    name: "participantFormationSlice",
    initialState,
    reducers: {
        
        setParticipantFormationLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageParticipantFormation(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setParticipantFormations(state, action: PayloadAction<ParticipantFormationReturnGetType>) {
            state.data = action.payload;
        },
        createParticipantFormationSlice(state, action: PayloadAction<CreateParticipantFormationPayload>) {
            state.data.participantFormations.unshift(action.payload.participantFormation);
        },
        updateParticipantFormationSlice(state, action: PayloadAction<UpdateParticipantFormationPayload>) {
            const { id, participantFormationData } = action.payload;
            const index = state.data.participantFormations.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.participantFormations[index] = { ...state.data.participantFormations[index], ...participantFormationData };
            }
        },
        deleteParticipantFormationSlice(state, action: PayloadAction<DeleteParticipantFormationPayload>) {
            const { id } = action.payload;
            state.data.participantFormations = state.data.participantFormations.filter(e => e._id !== id);
        },

       
    
    },
});

// Actions exportées
export const {
    setParticipantFormationLoading,
    setErrorPageParticipantFormation,
    setParticipantFormations,
    createParticipantFormationSlice,
    updateParticipantFormationSlice,
    deleteParticipantFormationSlice,
    
} = participantFormationSlice.actions;

// Reducer exporté
export default participantFormationSlice.reducer;