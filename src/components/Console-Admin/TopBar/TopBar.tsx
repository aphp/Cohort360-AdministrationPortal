import React from "react"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import clsx from "clsx"
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  ListItemIcon,
  Toolbar,
} from "@material-ui/core"

import { ReactComponent as LogoutIcon } from "assets/icones/power-off.svg"
import consoleLogo from "assets/images/console-white.png"
import { logout as logoutAction } from "state/me"
import { useAppSelector } from "state"
import useStyles from "./styles"

const smallDrawerWidth = 52
const largeDrawerWidth = 260
export { smallDrawerWidth, largeDrawerWidth }

const TopBar: React.FC = (props) => {
  const classes = useStyles()
  const history = useHistory()
  const { me } = useAppSelector((state) => ({ me: state.me }))

  const dispatch = useDispatch()

  const pathname = window.location.pathname

  return (
    <AppBar position="static" className={classes.appbar}>
      <Toolbar>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          style={{ height: "100%" }}
        >
          <Grid
            container
            item
            alignItems="center"
            xs={6}
            style={{ height: "100%" }}
          >
            <img
              src={consoleLogo}
              alt="Console logo"
              className={classes.logoIcon}
            />
            <Button
              className={clsx(
                classes.topBarButton,
                pathname === "/caresites" ? classes.activeButton : ""
              )}
              onClick={() => history.push("/caresites")}
              style={{
                borderBottom:
                  pathname === "/caresites" ? "2px solid #5BC5F2" : "none",
              }}
            >
              Périmètres
            </Button>
            <Button
              className={clsx(
                classes.topBarButton,
                pathname === "/users" ? classes.activeButton : ""
              )}
              onClick={() => history.push("/users")}
            >
              Utilisateurs
            </Button>
            <Button
              className={clsx(
                classes.topBarButton,
                pathname === "/roles" ? classes.activeButton : ""
              )}
              onClick={() => history.push("/roles")}
            >
              Rôles
            </Button>
          </Grid>

          <Grid container item alignItems="center" justify="flex-end" xs={6}>
            <ListItemIcon className={classes.listIcon}>
              <div className={classes.avatar}>
                {me && `${(me.firstName || "?")[0]}${(me.lastName || "?")[0]}`}
              </div>
            </ListItemIcon>

            <IconButton
              onClick={() => {
                localStorage.clear()
                dispatch<any>(logoutAction())
                history.push("/")
              }}
            >
              <LogoutIcon className={classes.logoutIcon} />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
