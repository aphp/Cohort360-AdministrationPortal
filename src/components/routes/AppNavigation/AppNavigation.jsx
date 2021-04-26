import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import PrivateRoute from '../PrivateRoute'
import TopBar from '../../TopBar/TopBar'
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
    <Switch>
      {Config.map((route, index) => {
        const MyComponent = route.component
        return route.isPrivate ? (
          <PrivateRoute
            key={index}
            exact={route.exact}
            path={route.path}
            render={(props) => {
              return (
                <Layout>
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
                <Layout>
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