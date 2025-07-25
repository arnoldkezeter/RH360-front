import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: UtilisateurInitialData = {
    data: {
        utilisateurs: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    utilisateur:{
        _id: "",
        role: "",
        nom: "",
        prenom: "",
        email: "",
        photoDeProfil: "",
        genre: "",
        actif: false
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const utilisateurSlice = createSlice({
    name: "utilisateurSlice",
    initialState,
    reducers: {
        setUtilisateursLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageUtilisateur(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setUtilisateurs(state, action: PayloadAction<UtilisateurReturnGetType>) {
            state.data = action.payload;
        },
        createUtilisateurSlice(state, action: PayloadAction<CreateUtilisateurPayload>) {
            state.data.utilisateurs.unshift(action.payload.utilisateur);
        },


        updateUtilisateurSlice(state, action: PayloadAction<UpdateUtilisateurPayload>) {
            const { id, utilisateurData } = action.payload;
            const index = state.data.utilisateurs.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.utilisateurs[index] = { ...state.data.utilisateurs[index], ...utilisateurData };
            }
        },

        deleteUtilisateurSlice(state, action: PayloadAction<DeleteUtilisateurPayload>) {
            const { id } = action.payload;
            state.data.utilisateurs = state.data.utilisateurs.filter(e => e._id !== id);
        },

        setUser: (state, action: PayloadAction<Utilisateur>) => {
            state.utilisateur = action.payload
        },

        setRole: (state, action: PayloadAction<string>) => {
            state.utilisateur.role = action.payload;
        },
        // Définir l'utilisateur avec des propriétés minimales
        setMinimumUser: (state, action: PayloadAction<MinUtilisateurState>) => {
            return { ...state, ...action.payload };
        },

        
    },
});

// Actions exportées
export const {
    setUtilisateursLoading,
    setErrorPageUtilisateur,
    setUtilisateurs,
    setUser,
    setMinimumUser,
    setRole,
    createUtilisateurSlice,
    updateUtilisateurSlice,
    deleteUtilisateurSlice,
} = utilisateurSlice.actions;

// Reducer exporté
export default utilisateurSlice.reducer;