import Login from '../../../views/Login/Login'
import Providers from '../../../views/Console-Admin/Providers/Providers'

export default [
	/**
  * Console-Admin Connexion Page
  */
  {
    exact: true,
    path: '/',
    name: 'Login',
    component: Login
    
  },
  /**
   * Console-Admin Home Page
   */
  {
    exact: true,
    displayTopBar: true,
    path: '/home',
    name: 'Home',
    isPrivate: true,
    component: Providers
  }
]