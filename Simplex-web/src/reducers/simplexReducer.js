import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  variables: [],
  restrictions: [],
};

const simplexSlice = createSlice({
  name: "simplex",
  initialState,
  reducers: {
    setVariables(state, action) {
      state.variables = action.payload;
    },
    setRestrictions(state, action) {
      state.restrictions = action.payload;
    },
  },
});

export const { setVariables, setRestrictions } = simplexSlice.actions;
export default simplexSlice.reducer;