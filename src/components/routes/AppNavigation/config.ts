import Login from 'views/Login/Login'
import HomePage from 'views/HomePage/HomePage'

import Providers from 'views/Console-Admin/Providers/Providers'
import ProvidersHistory from 'views/Console-Admin/ProvidersHistory/ProvidersHistory'
import CareSites from 'views/Console-Admin/CareSites/CareSites'
import CareSiteHistory from 'views/Console-Admin/CareSiteHistory/CareSiteHistory'
import Habilitations from 'views/Console-Admin/Habilitations/Habilitations'
import Logs from 'views/Console-Admin/Logs/Logs'

import Transfert from 'views/Jupyter/Transfert/Transfert'
import CreationEspace from 'views/Jupyter/CreationEspace/CreationEspace'

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

  /*************************************************************** Console-admin View ***************************************************************** */

  /**
   * Console-Admin Providers View
   */

  {
    exact: true,
    // displayTopBar: true,
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
    // displayTopBar: true,
    displayPortailTopBar: true,
    path: '/console-admin/user-profile/:providerId',
    isPrivate: true,
    component: ProvidersHistory
  },

  /**
   * Console-Admin CareSites View
   */

  {
    exact: true,
    // displayTopBar: true,
    displayPortailTopBar: true,
    path: '/console-admin/caresites',
    name: 'CareSites',
    isPrivate: true,
    component: CareSites
  },

  /**
   * Console-Admin CareSite View
   */

  {
    exact: true,
    // displayTopBar: true,
    displayPortailTopBar: true,
    path: '/console-admin/caresite/:careSiteId',
    name: 'CareSite',
    isPrivate: true,
    component: CareSiteHistory
  },

  /**
   * Console-Admin Habilitations View
   */

  {
    exact: true,
    // displayTopBar: true,
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
    // displayTopBar: true,
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
    // displayTopBar: true,
    displayPortailTopBar: true,
    path: '/espace-jupyter/transfert',
    name: 'Logs',
    isPrivate: true,
    component: Transfert
  },

  /**
   * Jupyter Espace Creation View
   */

  {
    exact: true,
    // displayTopBar: true,
    displayPortailTopBar: true,
    path: '/espace-jupyter/creationespace',
    name: 'Logs',
    isPrivate: true,
    component: CreationEspace
  }
]

export default Config
