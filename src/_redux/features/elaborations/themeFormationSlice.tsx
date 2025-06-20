import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: ThemeFormationInitialData = {
    data: {
        themeFormations: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
    selectedTheme:undefined
};

// Création du slice
const themeFormationSlice = createSlice({
    name: "themeFormationSlice",
    initialState,
    reducers: {
        setThemeFormationSelected(state, action: PayloadAction<ThemeFormation | undefined>) {
            state.selectedTheme = action.payload;
        },
        setThemeFormationLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageThemeFormation(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setThemeFormations(state, action: PayloadAction<ThemeFormationReturnGetType>) {
            state.data = action.payload;
        },
        createThemeFormationSlice(state, action: PayloadAction<CreateThemeFormationPayload>) {
            state.data.themeFormations.unshift(action.payload.themeFormation);
        },
        updateThemeFormationSlice(state, action: PayloadAction<UpdateThemeFormationPayload>) {
            const { id, themeFormationData } = action.payload;
            const index = state.data.themeFormations.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.themeFormations[index] = { ...state.data.themeFormations[index], ...themeFormationData };
            }
        },
        deleteThemeFormationSlice(state, action: PayloadAction<DeleteThemeFormationPayload>) {
            const { id } = action.payload;
            state.data.themeFormations = state.data.themeFormations.filter(e => e._id !== id);
        },

       
    
    },
});

// Actions exportées
export const {
    setThemeFormationSelected,
    setThemeFormationLoading,
    setErrorPageThemeFormation,
    setThemeFormations,
    createThemeFormationSlice,
    updateThemeFormationSlice,
    deleteThemeFormationSlice,
    
} = themeFormationSlice.actions;

// Reducer exporté
export default themeFormationSlice.reducer;