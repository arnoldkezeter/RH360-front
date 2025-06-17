import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// État initial de l'utilisateur
const initialState: Utilisateur = {
    _id: '',
    role: '',
    genre: '',
    nom: '',
    prenom: '',
    email: '',
    actif: true
};

// Création du Slice pour l'utilisateur
export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        // Définir l'utilisateur complet
        setUser: (state, action: PayloadAction<Utilisateur>) => {
            return { ...state, ...action.payload };
        },

        setRole: (state, action: PayloadAction<string>) => {
            state.role = action.payload;
        },
        // Définir l'utilisateur avec des propriétés minimales
        setMinimumUser: (state, action: PayloadAction<MinUtilisateurState>) => {
            return { ...state, ...action.payload };
        },

        
    },
});

// Exporter les actions
export const { setUser, setMinimumUser, setRole } = userSlice.actions;

// Exporter le reducer
export default userSlice.reducer;
