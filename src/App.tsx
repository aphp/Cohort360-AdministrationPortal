import React from 'react'
import moment from 'moment'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'

import AppNavigation from './components/routes/AppNavigation/AppNavigation'
import { store } from './state/store'
import MomentUtils from '@date-io/moment'

import 'moment/locale/fr'
import { LocalizationProvider } from '@mui/x-date-pickers'

moment.locale('fr')

const App = () => {
  return (
    <LocalizationProvider dateAdapter={MomentUtils}>
      <Provider store={store}>
        <CssBaseline />
        <AppNavigation />
      </Provider>
    </LocalizationProvider>
  )
}

export default App
