import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Order, User } from 'types'

import { getUsers } from 'services/Console-Admin/usersService'
// import { editProfile } from 'services/Console-Admin/usersHistoryService'

export type UsersState = {
  usersList: User[]
  total: number
  loading: boolean
  selectedUser: User | null
}

const defaultInitialState: UsersState = {
  usersList: [],
  total: 0,
  loading: false,
  selectedUser: null
}

const localStorageUsers = localStorage.getItem('users') || null
const initialState: UsersState = localStorageUsers ? JSON.parse(localStorageUsers) : defaultInitialState

type fetchUsersReturn = {
  usersList: User[]
  total: number
  loading: boolean
  selectedUser: null
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
        selectedUser: null
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
)

// type editProviderReturn = {
//   isSuccess: boolean
// }
// type editProviderArgs = {
//   loadingOnValidate: boolean
//   userHistoryId: string
//   selectedUser: Provider
// }
// const editProvider = createAsyncThunk<editProviderReturn, editProviderArgs, { state: UsersState }>(
//   'users/editProvider',
//   async ({ loadingOnValidate, userHistoryId, selectedUser }, { getState, dispatch }) => {
//     try {
//       const editProviderResp = await editProfile(userHistoryId, selectedUser)

//       if (editProviderResp) {
//         dispatch(fetchUsers())
//       }

//       return {
//         loading: false,
//         isSuccess: editProviderResp
//       }
//     } catch (error) {
//       console.error(error)
//       throw error
//     }
//   }
// )

// 2 nouveaux extra reducers:
// edit et add
// contrainte: dispatcher dans les reducers pour mettre à jour la liste

const usersSlice = createSlice({
  name: 'users',
  initialState: initialState as UsersState,
  reducers: {
    setSelectedUser: (state: UsersState, action: PayloadAction<User | null>) => {
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
      selectedUser: null
    }))
    // builder.addCase(fetchUsers.pending, (state) => ({ ...state, loading: true }))
    // builder.addCase(editProvider.fulfilled, (state, action) => ({
    //   isSuccess: action.payload.isSuccess
    // }))
  }
})

export default usersSlice.reducer
export { fetchUsers }
export const { setSelectedUser } = usersSlice.actions
