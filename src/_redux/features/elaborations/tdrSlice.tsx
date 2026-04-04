import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const emptyPrefill: TDRPrefill = {
    themeId: "",
    titreFr: "",
    titreEn: "",
    dateDebut: null,
    dateFin: null,
    duree: null,
    responsable: null,
    lieu: null,
    lieux: [],
    formateurs: [],
    objectifsSpecifiques: [],
    nombreParticipants: 0,
    nombreGroupes:0,
    nombreParticipantsParGroupe:0,
    budget: { lignes: [], totalPrevuHT: 0, totalPrevuTTC: 0 },
    objectifGeneral: "",
    contexte: "",
    modules: [],
    responsabilitesDGI: "",
    responsabilitesPartieExterne: "",
    nomPartieExterne: "",
    resultatsAttendus: "",
    methodologie: "",
    decoupageHoraire: { jours:[] },
    organisationGroupes: "",
};

const initialState: TDRFormState = {
    ...emptyPrefill,
    isLoading: false,
    isGenerating: false,
    error: null,
    isDirty: false,
};
const tdrSlice = createSlice({
    name: "tdrSlice",
    initialState,
    reducers: {
        // Chargement du prefill depuis l'API
        setTDRLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setTDRGenerating(state, action: PayloadAction<boolean>) {
            state.isGenerating = action.payload;
        },
        setTDRError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setTDRPrefill(state, action: PayloadAction<TDRPrefill>) {
            return { ...state, ...action.payload, isDirty: false };
        },
        resetTDR() {
            return initialState;
        },

        // Mise à jour champ par champ (pour le formulaire)
        updateTDRField<K extends keyof TDRPrefill>(
            state: TDRFormState,
            action: PayloadAction<{ field: K; value: TDRPrefill[K] }>
        ) {
            (state as TDRPrefill)[action.payload.field] = action.payload.value;
            state.isDirty = true;
        },

        // Modules (liste)
        addModule(state, action: PayloadAction<string>) {
            state.modules.push(action.payload);
            state.isDirty = true;
        },
        updateModule(state, action: PayloadAction<{ index: number; value: string }>) {
            state.modules[action.payload.index] = action.payload.value;
            state.isDirty = true;
        },
        removeModule(state, action: PayloadAction<number>) {
            state.modules.splice(action.payload, 1);
            state.isDirty = true;
        },

        // Objectifs spécifiques
        addObjectif(state, action: PayloadAction<ObjectifTDR>) {
            state.objectifsSpecifiques.push(action.payload);
            state.isDirty = true;
        },
        updateObjectif(state, action: PayloadAction<{ index: number; value: ObjectifTDR }>) {
            state.objectifsSpecifiques[action.payload.index] = action.payload.value;
            state.isDirty = true;
        },
        removeObjectif(state, action: PayloadAction<number>) {
            state.objectifsSpecifiques.splice(action.payload, 1);
            state.isDirty = true;
        },

        // Formateurs
        setFormateurs(state, action: PayloadAction<FormateurTDR[]>) {
            state.formateurs = action.payload;
            state.isDirty = true;
        },

        addJour(state) {
            const num = state.decoupageHoraire.jours.length + 1;
            state.decoupageHoraire.jours.push({
                id: Date.now().toString(),
                label: `Jour ${num}`,
                plages: [],
            });
            state.isDirty = true;
        },
        updateJourLabel(state, action: PayloadAction<{ id: string; label: string }>) {
            const jour = state.decoupageHoraire.jours.find(j => j.id === action.payload.id);
            if (jour) { jour.label = action.payload.label; state.isDirty = true; }
        },
        removeJour(state, action: PayloadAction<string>) {
            state.decoupageHoraire.jours = state.decoupageHoraire.jours.filter(j => j.id !== action.payload);
            state.isDirty = true;
        },

        // ── Plages (dans un jour) ────────────────────────────────────
        addPlage(state, action: PayloadAction<{ jourId: string }>) {
            const jour = state.decoupageHoraire.jours.find(j => j.id === action.payload.jourId);
            if (jour) {
                jour.plages.push({
                    id: Date.now().toString(),
                    horaire: "",
                    modules: [],
                });
                state.isDirty = true;
            }
        },
        updatePlage(state, action: PayloadAction<{ jourId: string; plageId: string; horaire: string }>) {
            const jour = state.decoupageHoraire.jours.find(j => j.id === action.payload.jourId);
            if (jour) {
                const plage = jour.plages.find(p => p.id === action.payload.plageId);
                if (plage) { plage.horaire = action.payload.horaire; state.isDirty = true; }
            }
        },
        removePlage(state, action: PayloadAction<{ jourId: string; plageId: string }>) {
            const jour = state.decoupageHoraire.jours.find(j => j.id === action.payload.jourId);
            if (jour) {
                jour.plages = jour.plages.filter(p => p.id !== action.payload.plageId);
                state.isDirty = true;
            }
        },
        setPausePlage(state, action: PayloadAction<{ jourId: string; plageId: string; pause: string }>) {
            const jour = state.decoupageHoraire.jours.find(j => j.id === action.payload.jourId);
            if (jour) {
                const plage = jour.plages.find(p => p.id === action.payload.plageId);
                if (plage) { plage.pauseApres = action.payload.pause; state.isDirty = true; }
            }
        },

        // ── Modules/Activités (dans une plage d'un jour) ─────────────
        addModuleToPlage(state, action: PayloadAction<{ jourId: string; plageId: string }>) {
            const jour = state.decoupageHoraire.jours.find(j => j.id === action.payload.jourId);
            if (jour) {
                const plage = jour.plages.find(p => p.id === action.payload.plageId);
                if (plage) {
                    plage.modules.push({ id: Date.now().toString(), texte: "", termePrefere: "module" });
                    state.isDirty = true;
                }
            }
        },
        updateModuleDansPlage(state, action: PayloadAction<{
            jourId: string; plageId: string; moduleId: string;
            texte?: string; termePrefere?: 'module' | 'activite'
        }>) {
            const jour = state.decoupageHoraire.jours.find(j => j.id === action.payload.jourId);
            if (jour) {
                const plage = jour.plages.find(p => p.id === action.payload.plageId);
                if (plage) {
                    const mod = plage.modules.find(m => m.id === action.payload.moduleId);
                    if (mod) {
                        if (action.payload.texte !== undefined) mod.texte = action.payload.texte;
                        if (action.payload.termePrefere !== undefined) mod.termePrefere = action.payload.termePrefere;
                        state.isDirty = true;
                    }
                }
            }
        },
        removeModuleDansPlage(state, action: PayloadAction<{ jourId: string; plageId: string; moduleId: string }>) {
            const jour = state.decoupageHoraire.jours.find(j => j.id === action.payload.jourId);
            if (jour) {
                const plage = jour.plages.find(p => p.id === action.payload.plageId);
                if (plage) {
                    plage.modules = plage.modules.filter(m => m.id !== action.payload.moduleId);
                    state.isDirty = true;
                }
            }
        },
    },
});

export const {
    setTDRLoading,
    setTDRGenerating,
    setTDRError,
    setTDRPrefill,
    resetTDR,
    updateTDRField,
    addModule,
    updateModule,
    removeModule,
    addObjectif,
    updateObjectif,
    removeObjectif,
    setFormateurs,
    addPlage, 
    updatePlage, 
    removePlage, 
    addModuleToPlage, 
    updateModuleDansPlage, 
    removeModuleDansPlage,
    updateJourLabel,
    removeJour,
    setPausePlage,
    addJour
} = tdrSlice.actions;

export default tdrSlice.reducer;