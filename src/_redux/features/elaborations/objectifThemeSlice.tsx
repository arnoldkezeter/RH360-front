import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: ObjectifThemeInitialData = {
    data: {
        objectifThemes: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const objectifThemeSlice = createSlice({
    name: "objectifThemeSlice",
    initialState,
    reducers: {
        
        setObjectifThemeLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageObjectifTheme(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setObjectifThemes(state, action: PayloadAction<ObjectifThemeReturnGetType>) {
            state.data = action.payload;
        },
        createObjectifThemeSlice(state, action: PayloadAction<CreateObjectifThemePayload>) {
            state.data.objectifThemes.unshift(action.payload.objectifTheme);
        },
        updateObjectifThemeSlice(state, action: PayloadAction<UpdateObjectifThemePayload>) {
            const { id, objectifThemeData } = action.payload;
            const index = state.data.objectifThemes.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.objectifThemes[index] = { ...state.data.objectifThemes[index], ...objectifThemeData };
            }
        },
        deleteObjectifThemeSlice(state, action: PayloadAction<DeleteObjectifThemePayload>) {
            const { id } = action.payload;
            state.data.objectifThemes = state.data.objectifThemes.filter(e => e._id !== id);
        },

       
    
    },
});

// Actions exportées
export const {
    setObjectifThemeLoading,
    setErrorPageObjectifTheme,
    setObjectifThemes,
    createObjectifThemeSlice,
    updateObjectifThemeSlice,
    deleteObjectifThemeSlice,
    
} = objectifThemeSlice.actions;

// Reducer exporté
export default objectifThemeSlice.reducer;