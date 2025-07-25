import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: AutoEvaluationBesoinInitialData = {
    data: {
        autoEvaluationBesoins: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const autoEvaluationBesoinSlice = createSlice({
    name: "autoEvaluationBesoinSlice",
    initialState,
    reducers: {
        setAutoEvaluationBesoinLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageAutoEvaluationBesoin(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setAutoEvaluationBesoins(state, action: PayloadAction<AutoEvaluationBesoinReturnGetType>) {
            state.data = action.payload;
        },
       createAutoEvaluationBesoinSlice(state, action: PayloadAction<CreateAutoEvaluationBesoinPayload>) {
            const newAutoEvaluation = action.payload.autoEvaluationBesoin;
            
            // Vérifier si l'élément existe déjà (mise à jour d'un élément existant)
            const existingIndex = state.data.autoEvaluationBesoins.findIndex(
                e => e.besoin._id === newAutoEvaluation.besoin._id
            );
            
            if (existingIndex !== -1) {
                // Mettre à jour l'élément existant
                state.data.autoEvaluationBesoins[existingIndex] = newAutoEvaluation;
            }
        },
        updateAutoEvaluationBesoinSlice(state, action: PayloadAction<UpdateAutoEvaluationBesoinPayload>) {
            const { id, autoEvaluationBesoinData } = action.payload;
            const index = state.data.autoEvaluationBesoins.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.autoEvaluationBesoins[index] = { ...state.data.autoEvaluationBesoins[index], ...autoEvaluationBesoinData };
            }
        },

        deleteAutoEvaluationBesoinSlice(state, action: PayloadAction<DeleteAutoEvaluationBesoinPayload>) {
            const { id } = action.payload;
  
            // Trouver l'index de l'élément à réinitialiser
            const index = state.data.autoEvaluationBesoins.findIndex(e => e._id === id);
            if (index !== -1) {
                // Réinitialiser les valeurs de l'auto-évaluation
                state.data.autoEvaluationBesoins[index] = {
                ...state.data.autoEvaluationBesoins[index],
                niveau: 0,
                insuffisancesFr: "",
                insuffisancesEn: "",
                formulationBesoinsFr: "",
                formulationBesoinsEn: "",
                statut: 'NON_EVALUE',
                commentaireAdminFr: "",
                commentaireAdminEn: "",
                };
            }
        }
    },
});

// Actions exportées
export const {
    setAutoEvaluationBesoinLoading,
    setErrorPageAutoEvaluationBesoin,
    setAutoEvaluationBesoins,
    createAutoEvaluationBesoinSlice,
    updateAutoEvaluationBesoinSlice,
    deleteAutoEvaluationBesoinSlice
} = autoEvaluationBesoinSlice.actions;

// Reducer exporté
export default autoEvaluationBesoinSlice.reducer;