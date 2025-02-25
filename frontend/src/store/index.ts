import { configureStore } from "@reduxjs/toolkit";
import algorithmReducer from "./slices/algorithmSlice";

export const store = configureStore({
  reducer: {
    algorithm: algorithmReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
