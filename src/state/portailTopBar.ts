import { createSlice } from '@reduxjs/toolkit'

const initialState = true

const portailTopBarSlice = createSlice({
  name: 'portailTopBar',
  initialState,
  reducers: {
    open: () => {
      return true
    },
    close: () => {
      return false
    }
  }
})

export default portailTopBarSlice.reducer
export const { open, close } = portailTopBarSlice.actions
