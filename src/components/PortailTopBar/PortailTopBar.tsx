import React, { useState } from 'react'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  AppBar,
  Toolbar,
  Grid,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
  Link,
  Typography,
  Tooltip,
  Button
} from '@material-ui/core'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ExpandLess from '@material-ui/icons/ExpandLess'

import { ReactComponent as LogoutIcon } from 'assets/icones/power-off.svg'
import PortailLogo from 'assets/images/portail-white.png'

import { useAppSelector } from 'state'
import { logout as logoutAction } from 'state/me'
import { userDefaultRoles } from 'utils/userRoles'
import { open as openAction } from 'state/portailTopBar'
import { logout as logoutRoute } from 'services/authentication'

import useStyles from './styles'

const PortailTopBar: React.FC = (props) => {
  const [displayConsoleAdmin, setDisplayConsoleAdmin] = useState<boolean>(false)
  const [displayEspaceJupyter, setDisplayEspaceJupyter] = useState<boolean>(false)

  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()

  const { me, open } = useAppSelector((state) => ({
    me: state.me,
    open: state.portailTopBar
  }))

  // const pathname = window.location.pathname
  const userRights = me?.userRights ?? userDefaultRoles

  const handleDisplayConsoleAdmin = () => {
    dispatch<any>(openAction())
    if (open) {
      setDisplayConsoleAdmin(!displayConsoleAdmin)
      setDisplayEspaceJupyter(false)
    }
  }

  const handleDisplayEspaceJupyter = () => {
    dispatch<any>(openAction())
    if (open) {
      setDisplayEspaceJupyter(!displayEspaceJupyter)
      setDisplayConsoleAdmin(false)
    }
  }

  const handleClose = () => {
    setDisplayConsoleAdmin(false)
    setDisplayEspaceJupyter(false)
  }

  return (
    <>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <Grid container alignItems="center" justify="space-between" style={{ height: '100%' }}>
            <Grid container item alignItems="center" xs={9} style={{ height: '100%' }}>
              <img src={PortailLogo} alt="Portail logo" className={classes.logoIcon} />
              <Grid>
                <Button onClick={handleDisplayConsoleAdmin}>Console admin</Button>
              </Grid>
              <Grid>
                <Button onClick={handleDisplayEspaceJupyter}>Espace Jupyter</Button>
                <Menu open={displayConsoleAdmin} onClose={handleClose}>
                  <MenuItem>
                    <Link>Utilisateurs</Link>
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>

            <Grid container item alignItems="center" justify="flex-end" xs={3}>
              <ListItemIcon className={classes.listIcon}>
                <div className={classes.avatar}>{me && `${(me.firstName || '?')[0]}${(me.lastName || '?')[0]}`}</div>
              </ListItemIcon>

              <IconButton
                onClick={() => {
                  localStorage.clear()
                  logoutRoute()
                  dispatch<any>(logoutAction())
                  history.push('/')
                }}
              >
                <LogoutIcon className={classes.logoutIcon} />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {/* <Grid id="je suis laaaaaaaaaaa" container className={classes.GridCollapses}>
        <Grid id="je suis invisible" className={classes.invisibleGrid}></Grid>
        <Grid id="Console admin collapse">
          <Menu
            id="Je suis le Menu"
            className={classes.collapse}
            open={displayConsoleAdmin}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <MenuItem id="je suis le menuItem 1">
              <Link className={classes.nestedTitle} href="/console-admin/users">
                Utilisateurs
              </Link>
            </MenuItem>
            {(userRights.right_read_admin_accesses_same_level ||
              userRights.right_read_admin_accesses_inferior_levels ||
              userRights.right_read_data_accesses_same_level ||
              userRights.right_read_data_accesses_inferior_levels) && (
              <MenuItem>
                <Link className={classes.nestedTitle} href="/console-admin/caresites">
                  Périmètres
                </Link>
              </MenuItem>
            )}
            <MenuItem>
              <Link className={classes.nestedTitle} href="/console-admin/habilitations">
                Habilitations
              </Link>
            </MenuItem>
            {userRights.right_read_logs && (
              <MenuItem>
                <Link className={classes.nestedTitle} href="/console-admin/logs">
                  Logs
                </Link>
              </MenuItem>
            )}
          </Menu>
        </Grid>
        <Grid id="Espace Jupyter collapse">
          <Menu
            className={classes.collapse}
            open={displayEspaceJupyter}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <MenuItem>
              <Link className={classes.nestedTitle} href="/espace-jupyter/transfert">
                Transfert Jupyter
              </Link>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid> */}
    </>
    // <>
    //   <AppBar className={classes.appbar}>
    //     <Toolbar>
    //       <Grid container alignItems="center" justify="space-between" style={{ height: '100%' }}>
    //         <Grid container item alignItems="center" xs={9} style={{ height: '100%' }}>
    //           <img src={PortailLogo} alt="Portail logo" className={classes.logoIcon} />

    //           <List>
    //             <ListItem
    //               // className={clsx(
    //               //   classes.topBarButton
    //               // pathname === '/console-admin' ? classes.activeButton : ''
    //               // )}
    //               button
    //               onClick={handleDisplayConsoleAdmin}
    //             >
    //               <ListItemText primary="Console-admin" />
    //               {displayConsoleAdmin ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
    //             </ListItem>
    //           </List>
    //           <List>
    //             <ListItem
    //               // className={clsx(
    //               //   classes.topBarButton
    //               // pathname === '/espace-jupyter' ? classes.activeButton : ''
    //               // )}
    //               button
    //               onClick={handleDisplayEspaceJupyter}
    //             >
    //               <ListItemText primary="Espace Jupyter" />
    //               {displayEspaceJupyter ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
    //             </ListItem>
    //           </List>
    //         </Grid>

    //         <Grid container item alignItems="center" justify="flex-end" xs={3}>
    //           <ListItemIcon className={classes.listIcon}>
    //             <div className={classes.avatar}>{me && `${(me.firstName || '?')[0]}${(me.lastName || '?')[0]}`}</div>
    //           </ListItemIcon>

    //           <IconButton
    //             onClick={() => {
    //               localStorage.clear()
    //               logoutRoute()
    //               dispatch<any>(logoutAction())
    //               history.push('/')
    //             }}
    //           >
    //             <LogoutIcon className={classes.logoutIcon} />
    //           </IconButton>
    //         </Grid>
    //       </Grid>
    //     </Toolbar>
    //   </AppBar>
    //   <Grid id="je suis laaaaaaaaaaa" container className={classes.GridCollapses}>
    //     <Grid id="je suis invisible" className={classes.invisibleGrid}></Grid>
    //     <Grid id="Console admin collapse">
    //       <Collapse className={classes.collapse} in={displayConsoleAdmin}>
    //         <List>
    //           <ListItem>
    //             <Link className={classes.nestedTitle} href="/console-admin/users">
    //               Utilisateurs
    //             </Link>
    //           </ListItem>
    //           {(userRights.right_read_admin_accesses_same_level ||
    //             userRights.right_read_admin_accesses_inferior_levels ||
    //             userRights.right_read_data_accesses_same_level ||
    //             userRights.right_read_data_accesses_inferior_levels) && (
    //             <ListItem>
    //               <Link className={classes.nestedTitle} href="/console-admin/caresites">
    //                 Périmètres
    //               </Link>
    //             </ListItem>
    //           )}
    //           <ListItem>
    //             <Link className={classes.nestedTitle} href="/console-admin/habilitations">
    //               Habilitations
    //             </Link>
    //           </ListItem>
    //           {userRights.right_read_logs && (
    //             <ListItem>
    //               <Link className={classes.nestedTitle} href="/console-admin/logs">
    //                 Logs
    //               </Link>
    //             </ListItem>
    //           )}
    //         </List>
    //       </Collapse>
    //     </Grid>
    //     <Grid id="Espace Jupyter collapse">
    //       <Collapse className={classes.collapse} in={displayEspaceJupyter}>
    //         <List>
    //           <ListItem>
    //             <Link className={classes.nestedTitle} href="/espace-jupyter/transfert">
    //               Transfert Jupyter
    //             </Link>
    //           </ListItem>
    //         </List>
    //       </Collapse>
    //     </Grid>
    //   </Grid>
    // </>
  )
}

export default PortailTopBar
