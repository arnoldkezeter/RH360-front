import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: CategorieProfessionnelleInitialData = {
    data: {
        categorieProfessionnelles: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const categorieProfessionnelleSlice = createSlice({
    name: "categorieProfessionnelleSlice",
    initialState,
    reducers: {
        setCategorieProfessionnelleLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageCategorieProfessionnelle(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setCategorieProfessionnelles(state, action: PayloadAction<CategorieProfessionnelleReturnGetType>) {
            state.data = action.payload;
        },
        createCategorieProfessionnelleSlice(state, action: PayloadAction<CreateCategorieProfessionnellePayload>) {
            state.data.categorieProfessionnelles.unshift(action.payload.categorieProfessionnelle);
        },
        updateCategorieProfessionnelleSlice(state, action: PayloadAction<UpdateCategorieProfessionnellePayload>) {
            const { id, categorieProfessionnelleData } = action.payload;
            const index = state.data.categorieProfessionnelles.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.categorieProfessionnelles[index] = { ...state.data.categorieProfessionnelles[index], ...categorieProfessionnelleData };
            }
        },
        deleteCategorieProfessionnelleSlice(state, action: PayloadAction<DeleteCategorieProfessionnellePayload>) {
            const { id } = action.payload;
            state.data.categorieProfessionnelles = state.data.categorieProfessionnelles.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setCategorieProfessionnelleLoading,
    setErrorPageCategorieProfessionnelle,
    setCategorieProfessionnelles,
    createCategorieProfessionnelleSlice,
    updateCategorieProfessionnelleSlice,
    deleteCategorieProfessionnelleSlice
} = categorieProfessionnelleSlice.actions;

// Reducer exporté
export default categorieProfessionnelleSlice.reducer;