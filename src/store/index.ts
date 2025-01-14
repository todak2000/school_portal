import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modal";
import authReducer from "./slices/auth";

// Create the root reducer
const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    // Add other reducers here if needed
  },
  devTools: process.env.NODE_ENV !== "production",
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
