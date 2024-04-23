import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  variables: 1,
  restricciones: 1,
  target: 'max',
  method: 'simplex'
}


const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setVariables(state, action) {
      state.variables = action.payload
    },
    setRestricciones(state, action) {
      state.restricciones = action.payload
    },
    setTarget(state, action) {
      state.target = action.payload
    },
    setMethod(state, action) {
      state.method = action.payload
    }
  }
});

export const { setVariables, setRestricciones, setTarget, setMethod } = configSlice.actions;
export default configSlice.reducer;