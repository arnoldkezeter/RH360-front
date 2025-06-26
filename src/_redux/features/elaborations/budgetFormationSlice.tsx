import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: BudgetFormationInitialData = {
    data: {
        budgetFormations: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    
    pageIsLoading: false,
    pageError: null,
    selectedBugetFormation:undefined
};

// Création du slice
const budgetformationSlice = createSlice({
    name: "budgetFormationSlice",
    initialState,
    reducers: {
        setBudgetFormationSelected(state, action: PayloadAction<BudgetFormation | undefined>) {
            state.selectedBugetFormation = action.payload;
        },
        setBudgetFormationLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageBudgetFormation(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setBudgetFormations(state, action: PayloadAction<BudgetFormationReturnGetType>) {
            state.data = action.payload;
        },
        createBudgetFormationSlice(state, action: PayloadAction<CreateBudgetFormationPayload>) {
            state.data.budgetFormations.unshift(action.payload.budgetFormation);
        },
        updateBudgetFormationSlice(state, action: PayloadAction<UpdateBudgetFormationPayload>) {
            const { id, budgetFormationData } = action.payload;
            const index = state.data.budgetFormations.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.budgetFormations[index] = { ...state.data.budgetFormations[index], ...budgetFormationData };
            }
        },
        deleteBudgetFormationSlice(state, action: PayloadAction<DeleteBudgetFormationPayload>) {
            const { id } = action.payload;
            state.data.budgetFormations = state.data.budgetFormations.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setBudgetFormationSelected,
    setBudgetFormationLoading,
    setErrorPageBudgetFormation,
    setBudgetFormations,
    createBudgetFormationSlice,
    updateBudgetFormationSlice,
    deleteBudgetFormationSlice
} = budgetformationSlice.actions;

// Reducer exporté
export default budgetformationSlice.reducer;