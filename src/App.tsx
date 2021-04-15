import React from 'react'
import { CssBaseline } from '@material-ui/core'

import Routes from './components/routes/routes'
import './App.css'

const App = () => {
    return (
        <div className='App'>
            <CssBaseline />
            <Routes />
        </div>
    )
}

export default App