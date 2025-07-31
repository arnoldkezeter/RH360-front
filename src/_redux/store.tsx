import { configureStore } from "@reduxjs/toolkit";
import settingReducer from "./features/setting.tsx";
import structureReducer from "./features/parametres/strucutureSlice.tsx";
import cohorteReducer from "./features/parametres/cohorteSlice.tsx";
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
import stagiaireReducer from "./features/stagiaire/stagiaireSlice.tsx";
import chercheurRededucer from "./features/chercheurSlice.tsx";
import programmeFormationReducer from "./features/elaborations/programmeFormationSlice.tsx";
import formationReducer from "./features/elaborations/formationSlice.tsx";
import themeFormationReducer from "./features/elaborations/themeFormationSlice.tsx";
import lieuFormationReducer from "./features/elaborations/lieuFormationSlice.tsx"
import objectifThemeReducer from "./features/elaborations/objectifThemeSlice.tsx"
import formateurReducer from "./features/elaborations/formateurSlice.tsx"
import tacheGeneriqueReducer from "./features/parametres/tacheGeneriqueSlice.tsx"
import tacheThemeFormationReducer from "./features/elaborations/tacheThemeFormationSlice.tsx"
import budgetFormationReducer from "./features/elaborations/budgetFormationSlice.tsx"
import depenseReducer from "./features/execution/depenseSlice.tsx"
import supportFormationReducer from "./features/execution/supportFormationSlice.tsx"
import tacheStagiaireReducer from "./features/stagiaire/tacheStagiaireSlice.tsx"
import autoEvalualtionBesoinReducer from "./features/elaborations/autoEvaluationBesoinSlice.tsx"
import besoinAjouteUtilisateurReducer from "./features/elaborations/besoinAjouteUtilisateurSlice.tsx"
import groupedBesoinReducer from "./features/elaborations/groupedBesoinSlice.tsx"
import groupedCompetenceReducer from "./features/elaborations/groupedCompetenceSlice.tsx"
import echelleReponseReducer from "./features/evaluations/echelleReponseSlice.tsx"
import evaluationChaudReducer from "./features/evaluations/evaluationChaudSlice.tsx"
import evaluationAChaudReponseReducer from "./features/evaluations/evaluationChaudReponseSlice.tsx"
import typeEchelleReponseReducer from "./features/evaluations/typeEchelleResponseSlice.tsx"


const store = configureStore({
  reducer: {
    setting: settingReducer,
    structureSlice:structureReducer,
    cohorteSlice:cohorteReducer,
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
    themeFormationSlice:themeFormationReducer,
    lieuFormationSlice:lieuFormationReducer,
    objectifThemeSlice:objectifThemeReducer,
    formateurSlice:formateurReducer,
    tacheGeneriqueSlice:tacheGeneriqueReducer,
    tacheThemeFormationSlice:tacheThemeFormationReducer,
    budgetFormationSlice:budgetFormationReducer,
    depenseSlice:depenseReducer,
    supportFormationSlice:supportFormationReducer,
    tacheStagiaireSlice:tacheStagiaireReducer,
    autoEvalualtionBesoinSlice:autoEvalualtionBesoinReducer,
    besoinAjouteUtilisateurSlice:besoinAjouteUtilisateurReducer,
    groupedBesoinSlice:groupedBesoinReducer,
    groupedCompetenceSlice:groupedCompetenceReducer,
    echelleReponseSlice:echelleReponseReducer,
    evaluationChaudSlice:evaluationChaudReducer,
    evaluationAChaudReponseSlice:evaluationAChaudReponseReducer,
    typeEchelleReponseSlice:typeEchelleReponseReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
