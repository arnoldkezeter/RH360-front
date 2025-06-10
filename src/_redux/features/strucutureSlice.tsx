import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: StructureInitialData = {
    data: {
        structures: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const structureSlice = createSlice({
    name: "structureSlice",
    initialState,
    reducers: {
        setStructureLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageStructure(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setStructures(state, action: PayloadAction<StructureReturnGetType>) {
            state.data = action.payload;
        },
        createStructureSlice(state, action: PayloadAction<CreateStructurePayload>) {
            state.data.structures.unshift(action.payload.structure);
        },
        updateStructureSlice(state, action: PayloadAction<UpdateStructurePayload>) {
            const { id, structureData } = action.payload;
            const index = state.data.structures.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.structures[index] = { ...state.data.structures[index], ...structureData };
            }
        },
        deleteStructureSlice(state, action: PayloadAction<DeleteStructurePayload>) {
            const { id } = action.payload;
            state.data.structures = state.data.structures.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setStructureLoading,
    setErrorPageStructure,
    setStructures,
    createStructureSlice,
    updateStructureSlice,
    deleteStructureSlice
} = structureSlice.actions;

// Reducer exporté
export default structureSlice.reducer;