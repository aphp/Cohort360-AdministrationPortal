import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Order, User } from 'types'

import { getUsers } from 'services/Console-Admin/usersService'

export type UsersState = {
  usersList: User[]
  total: number
  loading: boolean
  selectedUser: User
}

const defaultInitialState: UsersState = {
  usersList: [],
  total: 0,
  loading: false,
  selectedUser: { username: '' }
}

const localStorageUsers = localStorage.getItem('users') || null
const initialState: UsersState = localStorageUsers ? JSON.parse(localStorageUsers) : defaultInitialState

type fetchUsersReturn = {
  usersList: User[]
  total: number
  loading: boolean
  selectedUser: { username: '' }
}
type fetchUsersArgs = {
  page?: number
  searchInput: string
  order: Order
}
const fetchUsers = createAsyncThunk<fetchUsersReturn, fetchUsersArgs, { state: UsersState }>(
  'users/fetchUsers',
  async ({ page = 1, searchInput, order }, { getState, dispatch }) => {
    try {
      const usersResp = await getUsers(order, page, searchInput)

      return {
        usersList: usersResp.users,
        total: usersResp.total,
        loading: false,
        selectedUser: { username: '' }
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state: UsersState, action: PayloadAction<User>) => {
      const selectedUser = action.payload
      return { ...state, selectedUser }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => ({ ...state, loading: true }))
    builder.addCase(fetchUsers.fulfilled, (state, action) => ({
      usersList: action.payload.usersList,
      total: action.payload.total,
      loading: action.payload.loading,
      selectedUser: action.payload.selectedUser
    }))
    builder.addCase(fetchUsers.rejected, () => ({
      loading: false,
      total: 0,
      usersList: [],
      selectedUser: { username: '' }
    }))
  }
})

export default usersSlice.reducer
export { fetchUsers }
export const { setSelectedUser } = usersSlice.actions
