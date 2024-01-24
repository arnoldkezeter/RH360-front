import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user_slice.tsx";

const store = configureStore({
  reducer: {
    user: userReducer,

  },
  preloadedState: {
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
