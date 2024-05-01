import { createSlice } from "@reduxjs/toolkit";


const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: null
  },
  reducers: {
    displayMessage(state, action){
      state.message = action.payload
    },
    dismissMessage(state){
      state.message = null
    }
  }
})

export const { displayMessage, dismissMessage } = notificationSlice.actions

export const setNotification = ( message, duration ) =>{
  return async dispatch => {
    dispatch(displayMessage(message))
    setTimeout(() => dispatch(dismissMessage()), duration)
  }
}

export default notificationSlice.reducer