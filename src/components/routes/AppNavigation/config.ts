import Login from 'views/Login/Login'
import Providers from 'views/Console-Admin/Providers/Providers'
import ProvidersHistory from 'views/Console-Admin/ProvidersHistory/ProvidersHistory'
import CareSites from 'views/Console-Admin/CareSite/CareSites'

const Config = [
	/**
  * Console-Admin Connexion View
  */
  {
    exact: true,
    path: '/',
    name: 'Login',
    component: Login
    
  },
  /**
   * Console-Admin Providers View
   */
  {
    exact: true,
    displayTopBar: true,
    path: '/users',
    name: 'Users',
    isPrivate: true,
    component: Providers
  },
  /**
   * Console-Admin ProvidersHistory View
   */
  {
    exact: true,
    displayTopBar: true,
    path: '/user-profile/:providerId',
    isPrivate: true,
    component: ProvidersHistory
  },
  /**
   * Console-Admin CareSites View
   */
  {
    exact: true,
    displayTopBar: true,
    path: '/caresites',
    name: 'CareSites',
    isPrivate: true,
    component: CareSites
  }
]

export default Config