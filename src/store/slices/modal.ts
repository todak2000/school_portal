/* eslint-disable no-param-reassign */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface ModalState {
  open: boolean;
  type: string;
  data?: string | number | object | unknown;
}

const initialState: ModalState = {
  open: false,
  type: '',
  data: null,
};

const ModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (state: ModalState, action: PayloadAction<ModalState>) => {
      state.type = action.payload.type;
      state.open = action.payload.open;
      state.data = action.payload.data;
    },
  },
});

export const { setModal } = ModalSlice.actions;

export default ModalSlice.reducer;
