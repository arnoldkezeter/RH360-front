import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: TacheThemeFormationInitialData = {
    data: {
        tachesThemeFormation: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
     progressionExecutee: 0,
    progressionEnAttente: 0,
};

// ✅ Fonction utilitaire de calcul de progression
const calculerProgression = (taches: TacheThemeFormation[]) => {
    const total = taches.length;
    if (total === 0) return { progressionExecutee: 0, progressionEnAttente: 0 };

    const executees = taches.filter(t => t.estExecutee).length;
    const enAttente = taches.filter(t => !t.estExecutee && t.statut === 'EN_ATTENTE').length;

    return {
        progressionExecutee: Math.round((executees / total) * 100),
        progressionEnAttente: Math.round((enAttente / total) * 100),
    };
};

// Création du slice
const tachethemeformationSlice = createSlice({
    name: "tacheThemeFormationSlice",
    initialState,
    reducers: {
        setTacheThemeFormationLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageTacheThemeFormation(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setTacheThemeFormations(state, action: PayloadAction<TacheThemeFormationReturnGetType>) {
            state.data = action.payload;
            
        },
        createTacheThemeFormationSlice(state, action: PayloadAction<CreateTacheThemeFormationPayload>) {
            state.data.tachesThemeFormation.unshift(action.payload.tacheThemeFormation);
        },
        updateTacheThemeFormationSlice(state, action: PayloadAction<UpdateTacheThemeFormationPayload>) {
            const { id, tacheThemeFormationData } = action.payload;
            const index = state.data.tachesThemeFormation.findIndex(e => e.tache._id === id);
            
            if (index !== -1) {
                state.data.tachesThemeFormation[index] = { ...state.data.tachesThemeFormation[index], ...tacheThemeFormationData };
            }
          
        },
        deleteTacheThemeFormationSlice(state, action: PayloadAction<DeleteTacheThemeFormationPayload>) {
            const { id } = action.payload;
            state.data.tachesThemeFormation = state.data.tachesThemeFormation.filter(e => e._id !== id);
        },
        setProgression(state, action: PayloadAction<ProgressionTacheThemeFormationPayload>) {
            const { progressionExecutee, progressionEnAttente } = action.payload;
            state.progressionExecutee = progressionExecutee??state.progressionExecutee;
            state.progressionEnAttente = progressionEnAttente??state.progressionExecutee;
            
        },
    },
});

// Actions exportées
export const {
    setTacheThemeFormationLoading,
    setErrorPageTacheThemeFormation,
    setTacheThemeFormations,
    createTacheThemeFormationSlice,
    updateTacheThemeFormationSlice,
    deleteTacheThemeFormationSlice,
    setProgression
} = tachethemeformationSlice.actions;

// Reducer exporté
export default tachethemeformationSlice.reducer;