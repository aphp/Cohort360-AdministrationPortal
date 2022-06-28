import React, { useState } from 'react'
import clsx from 'clsx'

import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppBar, Button, Grid, IconButton, ListItemIcon, Menu, MenuItem, Toolbar } from '@material-ui/core'

import { ReactComponent as LogoutIcon } from 'assets/icones/power-off.svg'
import PortailLogo from 'assets/images/portail-white.png'

import { useAppSelector } from 'state'
import { logout as logoutAction } from 'state/me'
import { userDefaultRoles } from 'utils/userRoles'
import { logout as logoutRoute } from 'services/authentication'

import useStyles from './styles'

const PortailTopBar: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()

  const { me } = useAppSelector((state) => ({
    me: state.me
  }))

  const [anchorElConsole, setAnchorElConsole] = useState(null)
  const [anchorElJupyter, setAnchorElJupyter] = useState(null)

  const pathname = window.location.pathname
  const userRights = me?.userRights ?? userDefaultRoles

  const consolePages = [
    {
      name: 'Utilisateurs',
      pathname: '/console-admin/users',
      rightsToSee: userRights.right_read_users
    },
    {
      name: 'Périmètres',
      pathname: '/console-admin/perimeters',
      rightsToSee:
        userRights.right_read_admin_accesses_same_level ||
        userRights.right_read_admin_accesses_inferior_levels ||
        userRights.right_read_data_accesses_same_level ||
        userRights.right_read_data_accesses_inferior_levels
    },
    {
      name: 'Habilitations',
      pathname: '/console-admin/habilitations',
      rightsToSee: true
    },
    {
      name: 'Logs',
      pathname: '/console-admin/logs',
      rightsToSee: userRights.right_read_logs
    }
  ]

  const jupyterPages = [
    {
      name: 'Transfert Jupyter',
      pathname: `/espace-jupyter/transfert`,
      rightsToSee: userRights.right_review_transfer_jupyter
    },
    {
      name: 'Environnements',
      pathname: `/espace-jupyter/working-environments`,
      rightsToSee: userRights.right_read_env_unix_users
    }
  ]

  const handleClickConsoleAdmin = (event: any) => {
    setAnchorElConsole(event.currentTarget)
  }

  const handleClickEspaceJupyter = (event: any) => {
    setAnchorElJupyter(event.currentTarget)
  }

  return (
    <AppBar position="static" className={classes.appbar}>
      <Toolbar style={{ height: 64 }}>
        <Grid container alignItems="center" justify="space-between" style={{ height: '100%' }}>
          <Grid container item alignItems="center" xs={9} style={{ height: '100%' }}>
            <a href="/homepage">
              <img src={PortailLogo} alt="Portail logo" className={classes.logoIcon} />
            </a>
            <Button
              onClick={handleClickConsoleAdmin}
              className={clsx(
                classes.topBarButton,
                (pathname.includes('users') ||
                  pathname.includes('perimeters') ||
                  pathname.includes('habilitations') ||
                  pathname.includes('logs')) &&
                  classes.activeButton
              )}
            >
              Console admin
            </Button>
            <Menu
              anchorEl={anchorElConsole}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
              elevation={0}
              getContentAnchorEl={null}
              keepMounted
              open={Boolean(anchorElConsole)}
              onClose={() => setAnchorElConsole(null)}
              classes={{ paper: classes.paper }}
            >
              {consolePages.map(
                (page, index: number) =>
                  page.rightsToSee && (
                    <MenuItem
                      key={index}
                      onClick={() => history.push(page.pathname)}
                      className={clsx(classes.menuItem, pathname.includes(page.pathname) && classes.activeMenuItem)}
                    >
                      {page.name}
                    </MenuItem>
                  )
              )}
            </Menu>
            {(userRights.right_review_transfer_jupyter || userRights.right_read_env_unix_users) && (
              <Button
                onClick={handleClickEspaceJupyter}
                className={clsx(
                  classes.topBarButton,
                  (pathname.includes('transfert') || pathname.includes('working-environments')) && classes.activeButton
                )}
              >
                Espace Jupyter
              </Button>
            )}
            <Menu
              anchorEl={anchorElJupyter}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
              elevation={0}
              getContentAnchorEl={null}
              keepMounted
              open={Boolean(anchorElJupyter)}
              onClose={() => setAnchorElJupyter(null)}
              classes={{ paper: classes.paper }}
            >
              {jupyterPages.map(
                (page, index: number) =>
                  page.rightsToSee && (
                    <MenuItem
                      key={index}
                      onClick={() => history.push(page.pathname)}
                      className={clsx(classes.menuItem, pathname.includes(page.pathname) && classes.activeMenuItem)}
                    >
                      {page.name}
                    </MenuItem>
                  )
              )}
            </Menu>
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
  )
}

export default PortailTopBar
