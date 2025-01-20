import { createSlice } from '@reduxjs/toolkit'

const initialState = {notification: '', visibility: 'hidden'}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    editNotification(state, action) {
       const newNotification = action.payload
       return {...state, notification: newNotification, visibility: 'visible'}
    },
    clearNotification(state) {
      return {...state, visibility: 'hidden'}
    }
  }
})

export const { editNotification, clearNotification } = notificationSlice.actions

export const setNotification = ( notification, length ) => {
  return dispatch => {
    dispatch(editNotification(notification))
    setTimeout(() => {
      dispatch(clearNotification())
    }, length*1000);
  }
}
export default notificationSlice.reducer