import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: ChercheurInitialData = {
    data: {
        chercheurs: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const chercheurSlice = createSlice({
    name: "chercheurSlice",
    initialState,
    reducers: {
        setChercheursLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageChercheur(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setChercheurs(state, action: PayloadAction<ChercheurReturnGetType>) {
            state.data = action.payload;
        },
        createChercheurSlice(state, action: PayloadAction<CreateChercheurPayload>) {
            state.data.chercheurs.unshift(action.payload.chercheur);
        },


        updateChercheurSlice(state, action: PayloadAction<UpdateChercheurPayload>) {
            const { id, chercheurData } = action.payload;
            const index = state.data.chercheurs.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.chercheurs[index] = { ...state.data.chercheurs[index], ...chercheurData };
            }
        },

        deleteChercheurSlice(state, action: PayloadAction<DeleteChercheurPayload>) {
            const { id } = action.payload;
            state.data.chercheurs = state.data.chercheurs.filter(e => e._id !== id);
        },

        setUser: (state, action: PayloadAction<Chercheur>) => {
            return { ...state, ...action.payload };
        },

        
    },
});

// Actions exportées
export const {
    setChercheursLoading,
    setErrorPageChercheur,
    setChercheurs,
    createChercheurSlice,
    updateChercheurSlice,
    deleteChercheurSlice,
} = chercheurSlice.actions;

// Reducer exporté
export default chercheurSlice.reducer;