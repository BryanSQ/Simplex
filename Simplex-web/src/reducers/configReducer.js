import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  variables: 1,
  restricciones: 1,
  objetivo: 'max'
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
    setObjetivo(state, action) {
      state.objetivo = action.payload
    }
  }
});

export const { setVariables, setRestricciones, setObjetivo } = configSlice.actions;
export default configSlice.reducer;