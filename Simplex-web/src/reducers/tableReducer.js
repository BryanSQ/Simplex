import { createSlice } from '@reduxjs/toolkit';

const initialState = { matrix: [], header: [], BVS: []}

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
        }
    }
    });

export const { setMatrix, setHeader, setBVS } = tableSlice.actions;
export default tableSlice.reducer;