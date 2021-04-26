import React from 'react'
import { CssBaseline } from '@material-ui/core'
import { Provider } from 'react-redux'

import AppNavigation from './components/routes/AppNavigation/AppNavigation'
import { store } from './state/store'
import './App.css'


const App = () => {
  return (
    <div className='App'>
      <Provider store={store}>
        <CssBaseline />
        <AppNavigation />
      </Provider>
    </div>
  )
}

export default App