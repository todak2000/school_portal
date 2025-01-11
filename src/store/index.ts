import { configureStore } from "@reduxjs/toolkit";

import modalReducer from "./slices/modal";

const store = configureStore({
  reducer: {
    modal: modalReducer,
  },
});

export default store;

export const modal = (state: ReturnType<typeof store.getState>) => state.modal;
