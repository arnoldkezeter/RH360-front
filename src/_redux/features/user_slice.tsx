import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// État initial de l'utilisateur
const initialState: UserState = {
    _id: '',
    roles: [],
    role: '',
    genre: '',
    date_creation: null,
    nom: '',
    prenom: '',
    grade: '',
    email: '',
    niveaux: [],
    absences: [],
    categorie: '',
    fonction: '',
    service: '',
    commune: '',
    matricule: '',
    date_naiss: null,
    date_entree: null,
    lieu_naiss: '',
    contact: '',
    photo_profil: '',
    status: '',
    abscence: null,
    historique_connexion: [],
    nationalite: null,
    diplomeEntre: null,
    specialite: null
};

// Création du Slice pour l'utilisateur
export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        // Définir l'utilisateur complet
        setUser: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload };
        },

        setRole: (state, action: PayloadAction<string>) => {
            state.role = action.payload;
        },
        // Définir l'utilisateur avec des propriétés minimales
        setMinimumUser: (state, action: PayloadAction<MinUserState>) => {
            return { ...state, ...action.payload };
        },

        // Mettre à jour l'utilisateur avec de nouvelles propriétés
        updateUser: (state, action: PayloadAction<Partial<UpdateUserPayload>>) => {
            return { ...state, ...action.payload };
        },

        // Mettre à jour uniquement la liste des niveaux de l'utilisateur
        updateUserNiveaux: (state, action: PayloadAction<InscriptionType[]>) => {
            state.niveaux = action.payload;
        },

        //Mettre à jour uniquement la liste des absences
        updateUserAbsences: (state, action: PayloadAction<AbsenceType[]>) => {
            state.absences = action.payload;
        },
    },
});

// Exporter les actions
export const { setUser, setMinimumUser, updateUserNiveaux, updateUserAbsences, updateUser, setRole } = userSlice.actions;

// Exporter le reducer
export default userSlice.reducer;
