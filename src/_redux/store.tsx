import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user_slice.tsx";
import settingReducer from "./features/setting.tsx";
import structureReducer from "./features/settings/strucutureSlice.tsx";
import serviceReducer from "./features/settings/serviceSlice.tsx";
import categorieProfessionnelleReducer from "./features/settings/categorieProfessionnelleSlice.tsx";
import gradeReducer from "./features/settings/gradeSlice.tsx";
import posteDeTravailReducer from "./features/settings/posteDeTravailSlice.tsx";
import regionReducer from "./features/settings/regionSlice.tsx";
import departementReducer from "./features/settings/departementSlice.tsx";
import communeeReducer from "./features/settings/communeSlice.tsx";
import taxeReducer from "./features/settings/taxeSlice.tsx";
import familleMetierReducer from "./features/familleMetierSlice.tsx";
import competenceReducer from "./features/competenceSlice.tsx";
import axeStrategiqueReducer from "./features/axeStrategiqueSlice.tsx";


const store = configureStore({
  reducer: {
    user: userReducer,
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
    familleMetierSlice:familleMetierReducer,
    competenceSlice:competenceReducer,
    axeStrategiqueSlice:axeStrategiqueReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
