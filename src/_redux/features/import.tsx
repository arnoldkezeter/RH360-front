import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ── Types ─────────────────────────────────────────────────────────────────────

type StatutImport = "idle" | "en_cours" | "succes" | "erreur";

interface ImportPersonnelState {
  statut: StatutImport;
  message: string | null;
  erreur: string | null;
  stats: StatsImport | null;
  utilisateursNonTraites: UtilisateurNonTraite[];
}

// ── State initial ─────────────────────────────────────────────────────────────

const initialState: ImportPersonnelState = {
  statut: "idle",
  message: null,
  erreur: null,
  stats: null,
  utilisateursNonTraites: [],
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const importPersonnelSlice = createSlice({
  name: "importPersonnelSlice",
  initialState,
  reducers: {
    importDebut(state) {
      state.statut = "en_cours";
      state.message = null;
      state.erreur = null;
      state.stats = null;
      state.utilisateursNonTraites = [];
    },

    importSucces(state, action: PayloadAction<ResultatImport>) {
      state.statut = "succes";
      state.message = action.payload.message;
      state.stats = action.payload.stats;
      state.utilisateursNonTraites = action.payload.utilisateursNonTraites;
      state.erreur = null;
    },

    importErreur(state, action: PayloadAction<string>) {
      state.statut = "erreur";
      state.erreur = action.payload;
      state.message = null;
    },

    importReinitialiser(state) {
      state.statut = "idle";
      state.message = null;
      state.erreur = null;
      state.stats = null;
      state.utilisateursNonTraites = [];
    },
  },
});

export const {
  importDebut,
  importSucces,
  importErreur,
  importReinitialiser,
} = importPersonnelSlice.actions;

export default importPersonnelSlice.reducer;