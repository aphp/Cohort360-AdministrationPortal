import React from "react"
import moment from "moment"
import { CssBaseline } from "@material-ui/core"
import { Provider } from "react-redux"

import AppNavigation from "./components/routes/AppNavigation/AppNavigation"
import { store } from "./state/store"
import "./App.css"
import MomentUtils from "@date-io/moment"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"

import "moment/locale/fr"

moment.locale("fr")

const App = () => {
  return (
    <div className="App">
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Provider store={store}>
          <CssBaseline />
          <AppNavigation />
        </Provider>
      </MuiPickersUtilsProvider>
    </div>
  )
}

export default App
