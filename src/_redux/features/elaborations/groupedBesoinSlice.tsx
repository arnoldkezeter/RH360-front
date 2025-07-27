import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: GroupedBesoinInitialData = {
    data: {
        groupedBesoins: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const groupedBesoinSlice = createSlice({
    name: "groupedBesoinSlice",
    initialState,
    reducers: {
        setGroupedBesoinLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageGroupedBesoin(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setGroupedBesoins(state, action: PayloadAction<GroupedBesoinReturnGetType>) {
            state.data = action.payload;
        },
       createGroupedBesoinSlice(state, action: PayloadAction<CreateGroupedBesoinPayload>) {
            const newAutoEvaluation = action.payload.groupedBesoin;
            
            // Vérifier si l'élément existe déjà (mise à jour d'un élément existant)
            const existingIndex = state.data.groupedBesoins.findIndex(
                e => e.besoinId === newAutoEvaluation.besoinId
            );
            
            if (existingIndex !== -1) {
                // Mettre à jour l'élément existant
                state.data.groupedBesoins[existingIndex] = newAutoEvaluation;
            }
        },
        updateGroupedBesoinSlice(state, action: PayloadAction<UpdateGroupedBesoinPayload>) {
            const { id, groupedBesoinData } = action.payload;
            const index = state.data.groupedBesoins.findIndex(e => e.besoinId === id);
            if (index !== -1) {
                state.data.groupedBesoins[index] = { ...state.data.groupedBesoins[index], ...groupedBesoinData };
            }
        },
    },
});

// Actions exportées
export const {
    setGroupedBesoinLoading,
    setErrorPageGroupedBesoin,
    setGroupedBesoins,
    createGroupedBesoinSlice,
    updateGroupedBesoinSlice,
} = groupedBesoinSlice.actions;

// Reducer exporté
export default groupedBesoinSlice.reducer;