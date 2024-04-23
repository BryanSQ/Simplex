import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
    matrix: [],
    header: [],
    BVS: [],
    steps: [],
}

const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        setHeader(state, action) {
            state.header = action.payload
        },
        setBVS(state, action) {
            state.BVS = action.payload
        },
        setMatrix(state, action) {
        state.matrix.push(action.payload)
        },
        setSteps(state, action) {
            state.steps.push(action.payload)
        },
        resetTable(state) {
            state.matrix = []
            state.header = []
            state.BVS = []
            state.steps = []
        }
    }
});

export const { setMatrix, setHeader, setBVS, setSteps, resetTable } = tableSlice.actions;
export default tableSlice.reducer;