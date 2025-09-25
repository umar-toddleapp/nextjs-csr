import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentMode: null, // null, 'preview', 'draft'
  isDraftMode: false,
};

const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.currentMode = action.payload;
      state.isDraftMode = action.payload === "draft";
    },
    clearMode: (state) => {
      state.currentMode = null;
      state.isDraftMode = false;
    },
  },
});

export const { setMode, clearMode } = modeSlice.actions;
export default modeSlice.reducer;
