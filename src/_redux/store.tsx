import { configureStore } from "@reduxjs/toolkit";
import settingReducer from "./features/setting.tsx";
import structureReducer from "./features/parametres/strucutureSlice.tsx";
import serviceReducer from "./features/parametres/serviceSlice.tsx";
import categorieProfessionnelleReducer from "./features/parametres/categorieProfessionnelleSlice.tsx";
import besoinFormationPredefiniReducer from "./features/parametres/besoinFormationPredefini.tsx";
import etablissementReducer from "./features/parametres/etablissementSlice.tsx";
import gradeReducer from "./features/parametres/gradeSlice.tsx";
import posteDeTravailReducer from "./features/parametres/posteDeTravailSlice.tsx";
import regionReducer from "./features/parametres/regionSlice.tsx";
import departementReducer from "./features/parametres/departementSlice.tsx";
import communeeReducer from "./features/parametres/communeSlice.tsx";
import taxeReducer from "./features/parametres/taxeSlice.tsx";
import familleMetierReducer from "./features/elaborations/familleMetierSlice.tsx";
import competenceReducer from "./features/elaborations/competenceSlice.tsx";
import axeStrategiqueReducer from "./features/elaborations/axeStrategiqueSlice.tsx";
import utilisateurReducer from "./features/utilisateurs/utilisateurSlice.tsx";
import stagiaireReducer from "./features/stagiaireSlice.tsx";
import chercheurRededucer from "./features/chercheurSlice.tsx";
import programmeFormationReducer from "./features/elaborations/programmeFormationSlice.tsx";
import formationReducer from "./features/elaborations/formationSlice.tsx"


const store = configureStore({
  reducer: {
    setting: settingReducer,
    structureSlice:structureReducer,
    gradeSlice:gradeReducer,
    serviceSlice:serviceReducer,
    categorieProfessionnelleSlice:categorieProfessionnelleReducer,
    posteDeTavailSlice:posteDeTravailReducer,
    regionSlice:regionReducer,
    communeSlice:communeeReducer,
    departementSlice:departementReducer,
    taxeSlice:taxeReducer,
    etablissementSlice:etablissementReducer,
    besoinFormationPredefiniSlice:besoinFormationPredefiniReducer,
    familleMetierSlice:familleMetierReducer,
    competenceSlice:competenceReducer,
    axeStrategiqueSlice:axeStrategiqueReducer,
    utilisateurSlice:utilisateurReducer,
    stagiaireSlice:stagiaireReducer,
    chercheurSlice:chercheurRededucer,
    programmeFormationSlice:programmeFormationReducer,
    formationSlice:formationReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
