import { createSlice } from '@reduxjs/toolkit'

interface AutoLogoutState {
  isOpen: boolean
}

const initialState: AutoLogoutState = { isOpen: false }

const autoLogoutSlice = createSlice({
  name: 'autoLogout',
  initialState,
  reducers: {
    open(state) {
      state.isOpen = true
      return state
    },
    close(state) {
      state.isOpen = false
      return state
    }
  }
})

export default autoLogoutSlice.reducer
export const { open, close } = autoLogoutSlice.actions
