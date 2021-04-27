import Login from 'views/Login/Login'
import Providers from 'views/Console-Admin/Providers/Providers'
import ProvidersHistory from 'views/Console-Admin/ProvidersHistory/ProvidersHistory'


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
   * Console-Admin Home View
   */
  {
    exact: true,
    displayTopBar: true,
    path: '/home',
    name: 'Home',
    isPrivate: true,
    component: Providers
  },
  /**
   * Console-Admin ProvidersHistory View
   */
  {
    exact: true,
    displayTopBar: true,
    path: '/profile',
    isPrivate: true,
    component: ProvidersHistory
  }
]

export default Config