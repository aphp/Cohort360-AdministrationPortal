import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import AutoLogoutContainer from '../AutoLogoutContainer'
import TopBar from '../../Console-Admin/TopBar/TopBar'
import PrivateRoute from '../PrivateRoute'
import Config from './config'


const Layout = (props) => {
  return (
    <>
      {props.displayTopBar && <TopBar />}

      {props.children}
    </>
  )
}

const AppNavigation = () => (
  <Router>
    <AutoLogoutContainer />
    <Switch>
      {Config.map((route, index) => {
        const MyComponent = route.component
        return route.isPrivate ? (
          <PrivateRoute
            key={index}s
            exact={route.exact}
            path={route.path}
            render={(props) => {
              return (
                <Layout {...route}>
                  <MyComponent {...props} />
                </Layout>
              )
            }}
          />
        ) : (
          <Route
            key={index}
            exact={route.exact}
            path={route.path}
            render={(props) => {
              return (
                <Layout {...route}>
                  <MyComponent {...props} />
                </Layout>
              )
            }}
          />
        )
      })}
      {/* 404 not found */}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </Router>
)

export default AppNavigation