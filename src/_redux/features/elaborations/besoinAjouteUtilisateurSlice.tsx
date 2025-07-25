import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: BesoinAjouteUtilisateurInitialData = {
    data: {
        besoinAjouteUtilisateurs: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const besoinAjouteUtilisateurSlice = createSlice({
    name: "besoinAjouteUtilisateurSlice",
    initialState,
    reducers: {
        setBesoinAjouteUtilisateurLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageBesoinAjouteUtilisateur(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setBesoinAjouteUtilisateurs(state, action: PayloadAction<BesoinAjouteUtilisateurReturnGetType>) {
            state.data = action.payload;
        },
        createBesoinAjouteUtilisateurSlice(state, action: PayloadAction<CreateBesoinAjouteUtilisateurPayload>) {
            state.data.besoinAjouteUtilisateurs.unshift(action.payload.besoinAjouteUtilisateur);
        },
        updateBesoinAjouteUtilisateurSlice(state, action: PayloadAction<UpdateBesoinAjouteUtilisateurPayload>) {
            const { id, besoinAjouteUtilisateurData } = action.payload;
            const index = state.data.besoinAjouteUtilisateurs.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.besoinAjouteUtilisateurs[index] = { ...state.data.besoinAjouteUtilisateurs[index], ...besoinAjouteUtilisateurData };
            }
        },
        deleteBesoinAjouteUtilisateurSlice(state, action: PayloadAction<DeleteBesoinAjouteUtilisateurPayload>) {
            const { id } = action.payload;
            state.data.besoinAjouteUtilisateurs = state.data.besoinAjouteUtilisateurs.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setBesoinAjouteUtilisateurLoading,
    setErrorPageBesoinAjouteUtilisateur,
    setBesoinAjouteUtilisateurs,
    createBesoinAjouteUtilisateurSlice,
    updateBesoinAjouteUtilisateurSlice,
    deleteBesoinAjouteUtilisateurSlice
} = besoinAjouteUtilisateurSlice.actions;

// Reducer exporté
export default besoinAjouteUtilisateurSlice.reducer;