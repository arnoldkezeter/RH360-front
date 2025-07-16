import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: FormationInitialData = {
    data: {
        formations: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
    selectedFormation:undefined
};

// Création du slice
const formationSlice = createSlice({
    name: "formationSlice",
    initialState,
    reducers: {
        setFormationSelected(state, action: PayloadAction<Formation | undefined>) {
            state.selectedFormation = action.payload;
        },
        setFormationLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageFormation(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setFormations(state, action: PayloadAction<FormationReturnGetType>) {
            state.data = action.payload;
        },
        createFormationSlice(state, action: PayloadAction<CreateFormationPayload>) {
            state.data.formations.unshift(action.payload.formation);
        },
        updateFormationSlice(state, action: PayloadAction<UpdateFormationPayload>) {
            const { id, formationData } = action.payload;
            const index = state.data.formations.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.formations[index] = { ...state.data.formations[index], ...formationData };
            }
        },
        deleteFormationSlice(state, action: PayloadAction<DeleteFormationPayload>) {
            const { id } = action.payload;
            state.data.formations = state.data.formations.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setFormationSelected,
    setFormationLoading,
    setErrorPageFormation,
    setFormations,
    createFormationSlice,
    updateFormationSlice,
    deleteFormationSlice
} = formationSlice.actions;

// Reducer exporté
export default formationSlice.reducer;