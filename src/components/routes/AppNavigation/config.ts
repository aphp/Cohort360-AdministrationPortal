import Login from 'views/Login/Login'
import HomePage from 'views/HomePage/HomePage'

import Providers from 'views/Console-Admin/Providers/Providers'
import ProvidersHistory from 'views/Console-Admin/ProvidersHistory/ProvidersHistory'
import Perimeters from 'views/Console-Admin/Perimeters/Perimeters'
import PerimeterHistory from 'views/Console-Admin/PerimeterHistory/PerimeterHistory'
import Habilitations from 'views/Console-Admin/Habilitations/Habilitations'
import Logs from 'views/Console-Admin/Logs/Logs'

import Transfert from 'views/Jupyter/Transfert/Transfert'
import WorkingEnvironments from 'views/Jupyter/WorkingEnvironments/WorkingEnvironments'
import { HealthCheck } from '../../../views/HealthCheck/HealthCheck'

const Config = [
  /************************************************************** Portail View ************************************************************************ */

  /**
   * Portail Connexion View
   */

  {
    exact: true,
    path: '/',
    name: 'Login',
    component: Login
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
    component: HomePage
  },

  {
    exact: true,
    path: '/health-check',
    name: 'health-check',
    component: HealthCheck
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
    component: Providers
  },

  /**
   * Console-Admin ProvidersHistory View
   */

  {
    exact: true,
    displayPortailTopBar: true,
    path: '/console-admin/user-profile/:providerSourceValue',
    isPrivate: true,
    component: ProvidersHistory
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
    component: Perimeters
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
    component: PerimeterHistory
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
    component: Habilitations
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
    component: Logs
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
    component: Transfert
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
    component: WorkingEnvironments
  }
]

export default Config
