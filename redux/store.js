import { configureStore } from "@reduxjs/toolkit";
import modeSlice from "./slices/modeSlice";
import dataSlice from "./slices/dataSlice";

export const store = configureStore({
  reducer: {
    mode: modeSlice,
    data: dataSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const { dispatch } = store;
export default store;
