import type {SharedState} from '@/types/shared';
import { createSlice } from '@reduxjs/toolkit';

const initialState: SharedState = {
  modal: ""
};

const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
    setModal: (state, action) => {
      const { modal } = action.payload;
      state.modal = modal;
    },
  },
});

export const { setModal } = sharedSlice.actions;

export default sharedSlice.reducer;