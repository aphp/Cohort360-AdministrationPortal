import React from 'react'
import { CssBaseline } from '@material-ui/core'
import { Provider } from 'react-redux'

import Routes from './components/routes/routes'
import { store } from './state/store'
import './App.css'


const App = () => {
    return (
        <div className='App'>
            <Provider store={store}>
                <CssBaseline />
                <Routes />
            </Provider>
        </div>
    )
}

export default App