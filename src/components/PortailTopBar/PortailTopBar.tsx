import React, { useState } from 'react'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppBar, Toolbar, Grid, Button, List, ListItem, ListItemText, ListItemIcon, IconButton, Collapse, Link } from '@material-ui/core'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ExpandLess from '@material-ui/icons/ExpandLess'

import {ReactComponent as LogoutIcon} from 'assets/icones/power-off.svg'
import PortailLogo from 'assets/images/portail-white.png'

import { useAppSelector } from 'state'
import {logout as logoutAction} from 'state/me'
import { open as openAction} from 'state/portailTopBar'

import useStyles from './styles'


const PortailTopBar: React.FC = (props) => {

  const [displayConsoleAdmin, setDisplayConsoleAdmin] = useState<boolean>(false)
  const [displayEspaceJupyter, setDisplayEspaceJupyter] = useState<boolean>(false)

    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const { me, open } = useAppSelector((state) => ({ me: state.me, open: state.portailTopBar }))
    const pathname = window.location.pathname

    const handleDisplayConsoleAdmin = () => {
      dispatch<any>(openAction())
      if (open) {
        setDisplayConsoleAdmin(!displayConsoleAdmin)
      }
    }

    const handleDisplayEspaceJupyter = () => {
      dispatch<any>(openAction())
      if (open) {
        setDisplayEspaceJupyter(!displayEspaceJupyter)
      }
    }

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
              xs={9}
              style={{ height: "100%" }}
            >
              <img
                src={PortailLogo}
                alt="Portail logo"
                className={classes.logoIcon}
              />

              <List>
                <ListItem button onClick={handleDisplayConsoleAdmin}>
                  <ListItemText primary='Console-admin'/>
                  {displayConsoleAdmin ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
                </ListItem>
              </List>
              <List>
                <ListItem button onClick={handleDisplayEspaceJupyter}>
                  <ListItemText primary='Espace Jupyter'/>
                  {displayEspaceJupyter ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
                </ListItem>
              </List>

            </Grid>
  
            <Grid container item alignItems="center" justify="flex-end" xs={3}>
              <ListItemIcon className={classes.listIcon}>
                <div className={classes.avatar}>
                  {me && `${(me.firstName || "?")[0]}${(me.lastName || "?")[0]}`}
                </div>
              </ListItemIcon>
  
              <IconButton
                onClick={() => {
                  localStorage.clear()
                //   logoutRoute()
                  dispatch<any>(logoutAction())
                  history.push("/")
                }}
              >
                <LogoutIcon className={classes.logoutIcon} />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
        <Grid>
          <Collapse in={displayConsoleAdmin}>
            <List>
              <ListItem>
                <Link className={classes.nestedTitle} href="/users">Utilisateurs</Link>
              </ListItem>
              <ListItem>
                <Link className={classes.nestedTitle} href="/caresites">Périmètres</Link>
              </ListItem>
              <ListItem>
                <Link className={classes.nestedTitle} href="/habilitation">Habilitations</Link>
              </ListItem>
              <ListItem>
                <Link className={classes.nestedTitle} href="/logs">Logs</Link>
              </ListItem>
            </List>
          </Collapse>
          <Collapse in={displayEspaceJupyter}>
            <List>
              <ListItem>
                <Link className={classes.nestedTitle} href="/transfert">Transfert</Link>
              </ListItem>
            </List>
          </Collapse>
        </Grid>
      </AppBar>
    )
}

export default PortailTopBar