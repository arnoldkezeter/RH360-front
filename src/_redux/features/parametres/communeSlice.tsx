import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: CommuneInitialData = {
    data: {
        communes: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const communeSlice = createSlice({
    name: "communeSlice",
    initialState,
    reducers: {
        setCommuneLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageCommune(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setCommunes(state, action: PayloadAction<CommuneReturnGetType>) {
            state.data = action.payload;
        },
        createCommuneSlice(state, action: PayloadAction<CreateCommunePayload>) {
            state.data.communes.unshift(action.payload.commune);
        },
        updateCommuneSlice(state, action: PayloadAction<UpdateCommunePayload>) {
            const { id, communeData } = action.payload;
            const index = state.data.communes.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.communes[index] = { ...state.data.communes[index], ...communeData };
            }
        },
        deleteCommuneSlice(state, action: PayloadAction<DeleteCommunePayload>) {
            const { id } = action.payload;
            state.data.communes = state.data.communes.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setCommuneLoading,
    setErrorPageCommune,
    setCommunes,
    createCommuneSlice,
    updateCommuneSlice,
    deleteCommuneSlice
} = communeSlice.actions;

// Reducer exporté
export default communeSlice.reducer;