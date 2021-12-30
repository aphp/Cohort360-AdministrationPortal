import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Order, Provider } from 'types'

import { getProviders } from 'services/Console-Admin/providersService'
// import { editProfile } from 'services/Console-Admin/providersHistoryService'

export type ProvidersState = {
  providersList: Provider[]
  total: number
  loading: boolean
  selectedProvider: Provider | null
}

const defaultInitialState: ProvidersState = {
  providersList: [],
  total: 0,
  loading: false,
  selectedProvider: null
}

const localStorageProviders = localStorage.getItem('providers') || null
const initialState: ProvidersState = localStorageProviders ? JSON.parse(localStorageProviders) : defaultInitialState

type fetchProvidersReturn = {
  providersList: Provider[]
  total: number
  loading: boolean
  selectedProvider: null
}
type fetchProvidersArgs = {
  page?: number
  searchInput: string
  order: Order
}
const fetchProviders = createAsyncThunk<fetchProvidersReturn, fetchProvidersArgs, { state: ProvidersState }>(
  'providers/fetchProviders',
  async ({ page = 1, searchInput, order }, { getState, dispatch }) => {
    try {
      const providersResp = await getProviders(order, page, searchInput)

      return {
        providersList: providersResp.providers,
        total: providersResp.total,
        loading: false,
        selectedProvider: null
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
//   providerHistoryId: string
//   selectedProvider: Provider
// }
// const editProvider = createAsyncThunk<editProviderReturn, editProviderArgs, { state: ProvidersState }>(
//   'providers/editProvider',
//   async ({ loadingOnValidate, providerHistoryId, selectedProvider }, { getState, dispatch }) => {
//     try {
//       const editProviderResp = await editProfile(providerHistoryId, selectedProvider)

//       if (editProviderResp) {
//         dispatch(fetchProviders())
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

const providersSlice = createSlice({
  name: 'providers',
  initialState: initialState as ProvidersState,
  reducers: {
    setSelectedProvider: (state: ProvidersState, action: PayloadAction<Provider | null>) => {
      const selectedProvider = action.payload
      return { ...state, selectedProvider }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProviders.pending, (state) => ({ ...state, loading: true }))
    builder.addCase(fetchProviders.fulfilled, (state, action) => ({
      providersList: action.payload.providersList,
      total: action.payload.total,
      loading: action.payload.loading,
      selectedProvider: action.payload.selectedProvider
    }))
    builder.addCase(fetchProviders.rejected, () => ({
      loading: false,
      total: 0,
      providersList: [],
      selectedProvider: null
    }))
    // builder.addCase(fetchProviders.pending, (state) => ({ ...state, loading: true }))
    // builder.addCase(editProvider.fulfilled, (state, action) => ({
    //   isSuccess: action.payload.isSuccess
    // }))
  }
})

export default providersSlice.reducer
export { fetchProviders }
export const { setSelectedProvider } = providersSlice.actions
