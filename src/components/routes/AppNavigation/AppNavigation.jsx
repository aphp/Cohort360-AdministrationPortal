import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { useAppSelector } from 'state/index'

import configRoutes from './config'
import PrivateRoute from '../PrivateRoute'
import AutoLogoutContainer from '../AutoLogoutContainer'
import PortailTopBar from 'components/PortailTopBar/PortailTopBar'

const Layout = (props) => {
  const me = useAppSelector((state) => state.me)

  return (
    <>
      {me && <AutoLogoutContainer />}

      {props.displayPortailTopBar && <PortailTopBar />}

      {props.children}
    </>
  )
}

const AppNavigation = () => (
  <Router>
    <Routes>
      {configRoutes.map((route, index) => {
        return route.isPrivate ? (
          <Route element={<PrivateRoute />}>
            <Route
              index={index}
              path={route.path}
              element={<Layout displayPortailTopBar={route.displayPortailTopBar}>{route.element}</Layout>}
            />
          </Route>
        ) : (
          <Route
            index={index}
            path={route.path}
            element={<Layout displayPortailTopBar={route.displayPortailTopBar}>{route.element}</Layout>}
          />
        )
      })}
      <Route path="*" element={<Layout displayPortailTopBar>404 not found</Layout>} />
    </Routes>
  </Router>
)

export default AppNavigation
