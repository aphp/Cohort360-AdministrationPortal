import React from 'react'
import { RouteObject } from 'react-router'
import Login from 'views/Login/Login'
import HomePage from 'views/HomePage/HomePage'

import Providers from 'views/Console-Admin/Providers/Providers'
import ProvidersHistory from 'views/Console-Admin/ProvidersHistory/ProvidersHistory'
import Perimeters from 'views/Console-Admin/Perimeters/Perimeters'
import PerimeterHistory from 'views/Console-Admin/PerimeterHistory/PerimeterHistory'
import Habilitations from 'views/Console-Admin/Habilitations/Habilitations'
import HabilitationHistory from 'views/Console-Admin/HabilitationHistory/HabilitationHistory'
import Logs from 'views/Console-Admin/Logs/Logs'

import Transfert from 'views/Jupyter/Transfert/Transfert'
import WorkingEnvironments from 'views/Jupyter/WorkingEnvironments/WorkingEnvironments'
import HealthCheck from 'views/HealthCheck/HealthCheck'

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
   * Console-Admin Providers View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/console-admin/users',
    name: 'Users',
    isPrivate: true,
    element: <Providers />
  },

  /**
   * Console-Admin ProvidersHistory View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/console-admin/user-profile/:providerSourceValue',
    isPrivate: true,
    element: <ProvidersHistory />
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
   * Jupyter Tranfert View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/espace-jupyter/transfert',
    name: 'Transfert Jupyter',
    isPrivate: true,
    element: <Transfert />
  },

  /**
   * Jupyter Working Environments View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/espace-jupyter/working-environments',
    name: 'Environnements de travail',
    isPrivate: true,
    element: <WorkingEnvironments />
  }
]

export default configRoutes
