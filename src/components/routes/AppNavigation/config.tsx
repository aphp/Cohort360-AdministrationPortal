import React from 'react'
import { RouteObject } from 'react-router'
import Login from 'views/Login/Login'
import HomePage from 'views/HomePage/HomePage'
import HealthCheck from 'views/HealthCheck/HealthCheck'

import Users from 'views/Console-Admin/Users/Users'
import ProfilesView from 'views/Console-Admin/Profiles/Profiles'
import Perimeters from 'views/Console-Admin/Perimeters/Perimeters'
import PerimeterHistory from 'views/Console-Admin/PerimeterHistory/PerimeterHistory'
import Habilitations from 'views/Console-Admin/Habilitations/Habilitations'
import HabilitationHistory from 'views/Console-Admin/HabilitationHistory/HabilitationHistory'
import Logs from 'views/Console-Admin/Logs/Logs'

// import Transfert from 'views/Jupyter/Transfert/Transfert'
import TransfertDatalab from 'views/Jupyter/Transfert/TransfertDatalab'
// import WorkingEnvironments from 'views/Jupyter/WorkingEnvironments/WorkingEnvironments'

type configRoute = RouteObject & {
  exact?: boolean
  displayPortailTopBar?: boolean
  isPrivate?: boolean
  name?: string
}

const configRoutes: configRoute[] = [
  /************************************************************** Portail View ************************************************************************ */

  /**
   * Portail Connexion View
   */

  {
    exact: true,
    path: '/',
    name: 'Login',
    element: <Login />
  },

  /**
   * Portail HomePage View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/homepage',
    name: 'HomePage',
    isPrivate: true,
    element: <HomePage />
  },

  {
    exact: true,
    path: '/health-check',
    name: 'health-check',
    element: <HealthCheck />
  },

  /*************************************************************** Console-admin View ***************************************************************** */

  /**
   * Console-Admin Users View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/console-admin/users',
    name: 'Users',
    isPrivate: true,
    element: <Users />
  },

  /**
   * Console-Admin Profiles View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/console-admin/user-profile/:user_id',
    isPrivate: true,
    element: <ProfilesView />
  },

  /**
   * Console-Admin Perimeters View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/console-admin/perimeters',
    name: 'Perimeters',
    isPrivate: true,
    element: <Perimeters />
  },

  /**
   * Console-Admin Perimeter View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/console-admin/perimeter/:perimeterId',
    name: 'Perimeter',
    isPrivate: true,
    element: <PerimeterHistory />
  },

  /**
   * Console-Admin Habilitations View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/console-admin/habilitations',
    name: 'Habilitations',
    isPrivate: true,
    element: <Habilitations />
  },

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/console-admin/habilitation/:habilitationId/users',
    name: 'Habilitation',
    isPrivate: true,
    element: <HabilitationHistory />
  },

  /**
   * Console-Admin Logs View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/console-admin/logs',
    name: 'Logs',
    isPrivate: true,
    element: <Logs />
  },

  /*************************************************************** Jupyter View ********************************************************************** */

  /**
   * Jupyter - Datalab Transfer View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/espace-jupyter/export',
    name: 'Transfert Datalab',
    isPrivate: true,
    element: <TransfertDatalab />
  },

  /**
   * Jupyter Working Environments View
   */

  // {
  //   exact: true,
  //   displayPortailTopBar: true,
  //   path: '/espace-jupyter/working-environments',
  //   name: 'Environnements de travail',
  //   isPrivate: true,
  //   element: <WorkingEnvironments />
  // }
]

export default configRoutes
