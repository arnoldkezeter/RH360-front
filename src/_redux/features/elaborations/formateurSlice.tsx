import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: FormateurInitialData = {
    data: {
        formateurs: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const formateurSlice = createSlice({
    name: "formateurSlice",
    initialState,
    reducers: {
        
        setFormateurLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageFormateur(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setFormateurs(state, action: PayloadAction<FormateurReturnGetType>) {
            state.data = action.payload;
        },
        createFormateurSlice(state, action: PayloadAction<CreateFormateurPayload>) {
            state.data.formateurs.unshift(action.payload.formateur);
        },
        updateFormateurSlice(state, action: PayloadAction<UpdateFormateurPayload>) {
            const { id, formateurData } = action.payload;
            const index = state.data.formateurs.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.formateurs[index] = { ...state.data.formateurs[index], ...formateurData };
            }
        },
        deleteFormateurSlice(state, action: PayloadAction<DeleteFormateurPayload>) {
            const { id } = action.payload;
            state.data.formateurs = state.data.formateurs.filter(e => e._id !== id);
        },

       
    
    },
});

// Actions exportées
export const {
    setFormateurLoading,
    setErrorPageFormateur,
    setFormateurs,
    createFormateurSlice,
    updateFormateurSlice,
    deleteFormateurSlice,
    
} = formateurSlice.actions;

// Reducer exporté
export default formateurSlice.reducer;