import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Login from '../../views/Login/Login'
import Providers from '../../views/Console-admin/Providers/Providers'

const Routes = () => {
    return (
        <BrowserRouter>
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Providers} />
        </Switch>
    </BrowserRouter>
    )
}

export default Routes