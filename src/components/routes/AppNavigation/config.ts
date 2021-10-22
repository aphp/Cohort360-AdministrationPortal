import Login from "views/Login/Login"
import Providers from "views/Console-Admin/Providers/Providers"
import ProvidersHistory from "views/Console-Admin/ProvidersHistory/ProvidersHistory"
import CareSites from "views/Console-Admin/CareSites/CareSites"
import CareSiteHistory from "views/Console-Admin/CareSiteHistory/CareSiteHistory"
import Habilitations from "views/Console-Admin/Habilitations/Habilitations"
import Logs from "views/Console-Admin/Logs/Logs"

const Config = [
  /**
   * Console-Admin Connexion View
   */
  {
    exact: true,
    path: "/",
    name: "Login",
    component: Login,
  },
  /**
   * Console-Admin Providers View
   */
  {
    exact: true,
    displayTopBar: true,
    path: "/users",
    name: "Users",
    isPrivate: true,
    component: Providers,
  },
  /**
   * Console-Admin ProvidersHistory View
   */
  {
    exact: true,
    displayTopBar: true,
    path: "/user-profile/:providerId",
    isPrivate: true,
    component: ProvidersHistory,
  },
  /**
   * Console-Admin CareSites View
   */
  {
    exact: true,
    displayTopBar: true,
    path: "/caresites",
    name: "CareSites",
    isPrivate: true,
    component: CareSites,
  },
  /**
   * Console-Admin CareSite View
   */
  {
    exact: true,
    displayTopBar: true,
    path: "/caresite/:careSiteId",
    name: "CareSite",
    isPrivate: true,
    component: CareSiteHistory,
  },
  /**
   * Console-Admin Habilitations View
   */
  {
    exact: true,
    displayTopBar: true,
    path: "/habilitations",
    name: "Habilitations",
    isPrivate: true,
    component: Habilitations,
  },
  /**
   * Console-Admin Logs View
   */
  {
    exact: true,
    displayTopBar: true,
    path: "/logs",
    name: "Logs",
    isPrivate: true,
    component: Logs,
  },
]

export default Config
