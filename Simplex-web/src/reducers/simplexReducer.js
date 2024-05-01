import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  variables: [],
  restrictions: [],
  unrestricted: [],
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
    setUnrestricted(state, action) {
      state.unrestricted = action.payload;
    }
  },
});

export const { setVariables, setRestrictions, setUnrestricted } = simplexSlice.actions;
export default simplexSlice.reducer;