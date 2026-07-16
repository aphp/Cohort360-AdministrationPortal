import { UserRole } from 'types'

export type NavigationPage = {
  name: string
  pathname: string
  rightsToSee: boolean | null
}

/**
 * Construit la liste des pages "Console Admin" accessibles selon les droits.
 * `usersLabel` permet d'adapter le libellé du premier item selon le contexte
 * (ex. "Utilisateurs" dans la top bar, "Liste des utilisateurs" sur la home).
 */
export const getConsolePages = (userRights: UserRole, usersLabel = 'Utilisateurs'): NavigationPage[] => [
  {
    name: usersLabel,
    pathname: '/console-admin/users',
    rightsToSee:
      userRights.right_full_admin ||
      userRights.right_manage_admin_accesses_same_level ||
      userRights.right_manage_admin_accesses_inferior_levels ||
      userRights.right_manage_data_accesses_same_level ||
      userRights.right_manage_data_accesses_inferior_levels
  },
  {
    name: 'Périmètres',
    pathname: '/console-admin/perimeters',
    rightsToSee:
      userRights.right_manage_admin_accesses_same_level ||
      userRights.right_manage_admin_accesses_inferior_levels ||
      userRights.right_manage_data_accesses_same_level ||
      userRights.right_manage_data_accesses_inferior_levels
  },
  {
    name: 'Habilitations',
    pathname: '/console-admin/habilitations',
    rightsToSee:
      userRights.right_full_admin ||
      userRights.right_manage_admin_accesses_same_level ||
      userRights.right_manage_admin_accesses_inferior_levels ||
      userRights.right_manage_data_accesses_same_level ||
      userRights.right_manage_data_accesses_inferior_levels
  },
  {
    name: 'Logs',
    pathname: '/console-admin/logs',
    rightsToSee: userRights.right_full_admin || userRights.right_read_logs
  },
  {
    name: 'Maintenance',
    pathname: '/console-admin/maintenance',
    rightsToSee: userRights.right_full_admin
  },
  {
    name: 'Contenus',
    pathname: '/console-admin/contents',
    rightsToSee: userRights.right_full_admin
  }
]

/**
 * Construit la liste des pages "Espace Jupyter" accessibles selon les droits.
 */
export const getJupyterPages = (userRights: UserRole): NavigationPage[] => [
  {
    name: 'Transfert Datalab',
    pathname: `/espace-jupyter/export`,
    rightsToSee: userRights.right_export_jupyter_nominative || userRights.right_export_jupyter_pseudonymized
  },
  {
    name: 'Datalabs',
    pathname: `/espace-jupyter/datalabs`,
    rightsToSee: userRights.right_read_datalabs
  }
]
