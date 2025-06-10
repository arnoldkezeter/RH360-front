import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user_slice.tsx";
import settingReducer from "./features/setting.tsx";
import dataSettingReducer from "./features/data_setting_slice.tsx";


const store = configureStore({
  reducer: {
    user: userReducer,
    setting: settingReducer,
    dataSetting: dataSettingReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
