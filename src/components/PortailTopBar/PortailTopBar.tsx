import React, { useState } from 'react'

import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppBar, Button, Grid, IconButton, ListItemIcon, Menu, MenuItem, Toolbar } from '@mui/material'

import { ReactComponent as LogoutIcon } from 'assets/icones/power-off.svg'
import PortailLogo from 'assets/images/portail-white.png'

import { useAppSelector } from 'state'
import { logout as logoutAction } from 'state/me'
import { userDefaultRoles } from 'utils/userRoles'
import { logout as logoutRoute } from 'services/authentication'

import useStyles from './styles'
import { ENABLE_DATALABS } from '../../constants'

const PortailTopBar: React.FC = () => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
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
        userRights.right_read_accesses_above_levels ||
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
      name: 'Transfert Datalab',
      pathname: `/espace-jupyter/export`,
      rightsToSee:
        userRights.right_manage_export_jupyter_accesses ||
        userRights.right_export_jupyter_nominative ||
        userRights.right_export_jupyter_pseudonymized
    },
    {
      name: 'Environnements',
      pathname: `/espace-jupyter/working-environments`,
      rightsToSee: userRights.right_read_datalabs
    }
    // {
    //   name: 'Environnements',
    //   pathname: `/espace-jupyter/working-environments`,
    //   rightsToSee: userRights.right_read_datalabs
    // }
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
        <Grid container alignItems="center" justifyContent="space-between" style={{ height: '100%' }}>
          <Grid container item alignItems="center" xs={9} style={{ height: '100%' }}>
            <Link to="/homepage">
              <img src={PortailLogo} alt="Portail logo" className={classes.logoIcon} />
            </Link>
            <Button
              onClick={handleClickConsoleAdmin}
              className={cx(
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
              elevation={0}
              open={Boolean(anchorElConsole)}
              onClose={() => setAnchorElConsole(null)}
              classes={{ paper: classes.paper }}
            >
              {consolePages.map(
                (page, index: number) =>
                  page.rightsToSee && (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        navigate(page.pathname)
                        setAnchorElConsole(null)
                      }}
                      className={cx(classes.menuItem, pathname.includes(page.pathname) && classes.activeMenuItem)}
                    >
                      {page.name}
                    </MenuItem>
                  )
              )}
            </Menu>
            {(userRights.right_manage_export_jupyter_accesses ||
              userRights.right_export_jupyter_nominative ||
              userRights.right_export_jupyter_pseudonymized ||
              userRights.right_read_datalabs) && ENABLE_DATALABS && (
              <Button
                onClick={handleClickEspaceJupyter}
                className={cx(
                  classes.topBarButton,
                  (pathname.includes('transfert') || pathname.includes('working-environments')) && classes.activeButton
                )}
              >
                Espace Jupyter
              </Button>
            )}
            <Menu
              anchorEl={anchorElJupyter}
              elevation={0}
              open={Boolean(anchorElJupyter)}
              onClose={() => setAnchorElJupyter(null)}
              classes={{ paper: classes.paper }}
            >
              {jupyterPages.map(
                (page, index: number) =>
                  page.rightsToSee && (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        navigate(page.pathname)
                        setAnchorElJupyter(null)
                      }}
                      className={cx(classes.menuItem, pathname.includes(page.pathname) && classes.activeMenuItem)}
                    >
                      {page.name}
                    </MenuItem>
                  )
              )}
            </Menu>
          </Grid>

          <Grid container item alignItems="center" justifyContent="flex-end" xs={3}>
            <ListItemIcon className={classes.listIcon}>
              <div className={classes.avatar}>{me && `${(me.firstName || '?')[0]}${(me.lastName || '?')[0]}`}</div>
            </ListItemIcon>

            <IconButton
              onClick={() => {
                logoutRoute()
                dispatch<any>(logoutAction())
                navigate('/')
              }}
              size="large"
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
