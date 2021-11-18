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
    component: Login,
  },
  /**
   * Portail HonePage View
   */
  {
    exact: true,
    // displayLeftSideBar: true,
    // displayPortailTopBar: true,
    displayPortailTopBar: true,
    path: '/homepage',
    name: 'HomePage',
    component: HomePage
  },

  /*************************************************************** Console-admin View ***************************************************************** */

  /**
   * Console-Admin Providers View
   */
  {
    exact: true,
    // displayTopBar: true,
    // displayLeftSideBar: true,
    displayPortailTopBar: true,
    path: '/users',
    name: 'Users',
    isPrivate: true,
    component: Providers,
  },
  /**
   * Console-Admin ProvidersHistory View
   */
  {
    exact: true,
    // displayTopBar: true,
    // displayLeftSideBar: true,
    displayPortailTopBar: true,
    path: '/user-profile/:providerId',
    isPrivate: true,
    component: ProvidersHistory,
  },
  /**
   * Console-Admin CareSites View
   */
  {
    exact: true,
    // displayTopBar: true,
    // displayLeftSideBar: true,
    displayPortailTopBar: true,
    path: '/caresites',
    name: 'CareSites',
    isPrivate: true,
    component: CareSites,
  },
  /**
   * Console-Admin CareSite View
   */
  {
    exact: true,
    displayTopBar: true,
    // displayLeftSideBar: true,
    path: '/caresite/:careSiteId',
    name: 'CareSite',
    isPrivate: true,
    component: CareSiteHistory,
  },
  /**
   * Console-Admin Habilitations View
   */
  {
    exact: true,
    displayTopBar: true,
    // displayLeftSideBar: true,
    path: '/habilitations',
    name: 'Habilitations',
    isPrivate: true,
    component: Habilitations,
  },
  /**
   * Console-Admin Logs View
   */
  {
    exact: true,
    displayTopBar: true,
    displayLeftSideBar: true,
    path: '/logs',
    name: 'Logs',
    isPrivate: true,
    component: Logs,
  },

  /*************************************************************** Jupyter View ********************************************************************** */
  {
    exact: true,
    // displayTopBar: true,
    // displayLeftSideBar: true,
    displayPortailTopBar: true,
    path: '/transfert',
    name: 'Logs',
    isPrivate: true,
    component: Transfert,
  },
  {
    exact: true,
    // displayTopBar: true,
    displayLeftSideBar: true,
    path: '/creationespace',
    name: 'Logs',
    isPrivate: true,
    component: CreationEspace,
  },
]

export default Config
