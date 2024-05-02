import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
    matrix: [],
    header: [],
    BVS: [],
    steps: [],
    swaps: []
}

const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        setHeader(state, action) {
            state.header.push(action.payload)
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
        setSwaps(state, action) {
            state.swaps.push(action.payload)
        },
        resetTable(state) {
            state.matrix = []
            state.header = []
            state.BVS = []
            state.steps = []
            state.swaps = []
        }
    }
});

export const { setMatrix, setHeader, setBVS, setSteps, resetTable, setSwaps } = tableSlice.actions;
export default tableSlice.reducer;