import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: DepartementInitialData = {
    data: {
        departements: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const departementSlice = createSlice({
    name: "departementSlice",
    initialState,
    reducers: {
        setDepartementLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageDepartement(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setDepartements(state, action: PayloadAction<DepartementReturnGetType>) {
            state.data = action.payload;
        },
        createDepartementSlice(state, action: PayloadAction<CreateDepartementPayload>) {
            state.data.departements.unshift(action.payload.departement);
        },
        updateDepartementSlice(state, action: PayloadAction<UpdateDepartementPayload>) {
            const { id, departementData } = action.payload;
            const index = state.data.departements.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.departements[index] = { ...state.data.departements[index], ...departementData };
            }
        },
        deleteDepartementSlice(state, action: PayloadAction<DeleteDepartementPayload>) {
            const { id } = action.payload;
            state.data.departements = state.data.departements.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setDepartementLoading,
    setErrorPageDepartement,
    setDepartements,
    createDepartementSlice,
    updateDepartementSlice,
    deleteDepartementSlice
} = departementSlice.actions;

// Reducer exporté
export default departementSlice.reducer;