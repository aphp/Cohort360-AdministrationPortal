import React, { useEffect, useState } from 'react'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Switch,
  TextField,
  Typography
} from '@mui/material'

import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'

import useStyles from './styles'
import { createRoles, submitEditRoles } from 'services/Console-Admin/rolesService'
import { Role, RoleKeys, UserRole } from 'types'

type HabilitationDialogProps = {
  open: boolean
  userRights: UserRole
  selectedRole: Role
  onClose: () => void
  onAddRoleSuccess: (success: boolean) => void
  onEditRoleSuccess: (fail: boolean) => void
  onAddRoleFail: (success: boolean) => void
  onEditRoleFail: (fail: boolean) => void
}

const HabilitationDialog: React.FC<HabilitationDialogProps> = ({
  open,
  userRights,
  selectedRole,
  onClose,
  onAddRoleSuccess,
  onEditRoleSuccess,
  onAddRoleFail,
  onEditRoleFail
}) => {
  const { classes } = useStyles()

  const [role, setRole] = useState<Role>(selectedRole)
  const [errorName, setErrorName] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [disabledRights, setDisabledRights] = useState<string[]>([])
  const [loadingOnValidate, setLoadingOnValidate] = useState(false)

  const isEditable = selectedRole?.id ? true : false

  const rightsCategories = [
    {
      name: 'Administration',
      isGlobal: true,
      rights: [{ label: 'Admin Central', status: role?.right_full_admin, keyName: 'right_full_admin' }]
    },
    {
      name: 'Logs',
      isGlobal: true,
      rights: [{ label: 'Consulter les logs', status: role?.right_read_logs, keyName: 'right_read_logs' }]
    },
    {
      name: 'Utilisateurs',
      isGlobal: true,
      rights: [
        {
          label: 'Gérer la liste des utilisateurs / profils',
          status: role?.right_manage_users,
          keyName: 'right_manage_users'
        },
        {
          label: 'Consulter la liste des utilisateurs / profils',
          status: role?.right_read_users,
          keyName: 'right_read_users'
        }
      ]
    },
    {
      name: 'Datalabs',
      isGlobal: true,
      rights: [
        {
          label: 'Gérer les environnements de travail',
          status: role?.right_manage_datalabs,
          keyName: 'right_manage_datalabs'
        },
        {
          label: 'Consulter la liste des environnements de travail',
          status: role?.right_read_datalabs,
          keyName: 'right_read_datalabs'
        }
      ]
    },
    {
      name: 'Accès Exports',
      isGlobal: true,
      rights: [
        {
          label: 'Gérer les accès permettant de réaliser des exports de données en format CSV',
          status: role?.right_manage_export_csv_accesses,
          keyName: 'right_manage_export_csv_accesses'
        },
        {
          label: "Gérer les accès permettant d'exporter les cohortes vers des environnements Jupyter",
          status: role?.right_manage_export_jupyter_accesses,
          keyName: 'right_manage_export_jupyter_accesses'
        }
      ]
    },
    {
      name: 'Exports CSV',
      isGlobal: true,
      rights: [
        {
          label: 'Demander à exporter ses cohortes de patients sous forme nominative en format CSV',
          status: role?.right_export_csv_nominative,
          keyName: 'right_export_csv_nominative'
        },
        {
          label: 'Demander à exporter ses cohortes de patients sous forme pseudonymisée en format CSV',
          status: role?.right_export_csv_pseudonymized,
          keyName: 'right_export_csv_pseudonymized'
        }
      ]
    },
    {
      name: 'Exports Jupyter',
      isGlobal: true,
      rights: [
        {
          label: 'Exporter ses cohortes de patients sous forme nominative vers un environnement Jupyter',
          status: role?.right_export_jupyter_nominative,
          keyName: 'right_export_jupyter_nominative'
        },
        {
          label: 'Exporter ses cohortes de patients sous forme pseudonymisée vers un environnement Jupyter',
          status: role?.right_export_jupyter_pseudonymized,
          keyName: 'right_export_jupyter_pseudonymized'
        }
      ]
    },
    {
      name: 'Recherche de Patients',
      isGlobal: true,
      rights: [
        {
          label: 'Chercher les patients par IPP',
          status: role?.right_search_patients_by_ipp,
          keyName: 'right_search_patients_by_ipp'
        },
        {
          label: "Chercher les patients opposés à l'utilisation de leurs données pour la recherche",
          status: role?.right_search_opposed_patients,
          keyName: 'right_search_opposed_patients'
        }
      ]
    },
    {
      name: 'Lecture de Données Patients',
      isGlobal: false,
      rights: [
        {
          label: 'Lecture de données patients nominatives',
          status: role?.right_read_patient_nominative,
          keyName: 'right_read_patient_nominative'
        },
        {
          label: 'Lecture de données patients pseudonymisées',
          status: role?.right_read_patient_pseudonymized,
          keyName: 'right_read_patient_pseudonymized'
        }
      ]
    },
    {
      name: 'Gestion des "Accès Admin"',
      isGlobal: false,
      rights: [
        {
          label: "Gérer les accès administrateurs d'un périmètre exclusivement",
          status: role?.right_manage_admin_accesses_same_level,
          keyName: 'right_manage_admin_accesses_same_level'
        },
        {
          label: "Consulter la liste des accès administrateur d'un périmètre exclusivement",
          status: role?.right_read_admin_accesses_same_level,
          keyName: 'right_read_admin_accesses_same_level'
        },
        {
          label: 'Gérer les accès administrateurs des sous-périmètres exclusivement',
          status: role?.right_manage_admin_accesses_inferior_levels,
          keyName: 'right_manage_admin_accesses_inferior_levels'
        },
        {
          label: 'Consulter la liste des accès administrateur des sous-périmètres exclusivement',
          status: role?.right_read_admin_accesses_inferior_levels,
          keyName: 'right_read_admin_accesses_inferior_levels'
        }
      ]
    },
    {
      name: 'Gestion des "Accès Données"',
      isGlobal: false,
      rights: [
        {
          label: "Gérer les accès aux données patients d'un périmètre exclusivement",
          status: role?.right_manage_data_accesses_same_level,
          keyName: 'right_manage_data_accesses_same_level'
        },
        {
          label: "Consulter la liste des accès aux données patients d'un périmètre exclusivement",
          status: role?.right_read_data_accesses_same_level,
          keyName: 'right_read_data_accesses_same_level'
        },
        {
          label: 'Gérer les accès aux données patients des sous-périmètres exclusivement',
          status: role?.right_manage_data_accesses_inferior_levels,
          keyName: 'right_manage_data_accesses_inferior_levels'
        },
        {
          label: 'Consulter la liste des accès aux données patients des sous-périmètres exclusivement',
          status: role?.right_read_data_accesses_inferior_levels,
          keyName: 'right_read_data_accesses_inferior_levels'
        }
      ]
    },
    {
      name: 'Divers',
      isGlobal: true,
      rights: [
        {
          label: "Consulter les accès en provenance des périmètres parents d'un périmètre P",
          status: role?.right_read_accesses_above_levels,
          keyName: 'right_read_accesses_above_levels'
        }
      ]
    }
  ]

  useEffect(() => {
    if ((role.name && role.name.length < 4) || !role.name) {
      setErrorName(true)
    } else {
      setErrorName(false)
    }
  }, [role])

  const rightsDependencies = [
    { dependency: 'right_manage_users', dependant: 'right_read_users' },
    { dependency: 'right_manage_datalabs', dependant: 'right_read_datalabs' },
    { dependency: 'right_manage_admin_accesses_same_level', dependant: 'right_read_admin_accesses_same_level' },
    {
      dependency: 'right_manage_admin_accesses_inferior_levels',
      dependant: 'right_read_admin_accesses_inferior_levels'
    },
    { dependency: 'right_manage_data_accesses_same_level', dependant: 'right_read_data_accesses_same_level' },
    { dependency: 'right_manage_data_accesses_inferior_levels', dependant: 'right_read_data_accesses_inferior_levels' }
  ]

  const toggleDependantRights = (role: any, right: RoleKeys, value: boolean) => {
    let disabled_rights = [...disabledRights]
    if (right === 'right_full_admin') {
      for (let prop in role) {
        if (prop.includes('right_') && prop !== right) {
          role[prop] = value
          if (value) {
            disabled_rights.push(prop)
          } else {
            disabled_rights = disabled_rights.filter((r) => r !== prop)
          }
        }
      }
    } else {
      rightsDependencies.map((e) => {
        if (e.dependency === right) {
          if (value) {
            role[e.dependant] = value
            disabled_rights.push(e.dependant)
          } else {
            disabled_rights = disabled_rights.filter((r) => r !== e.dependant)
          }
        }
      })
    }
    setDisabledRights(disabled_rights)
  }

  const _onChangeValue = (key: RoleKeys, value: any) => {
    const _role = { ...role }
    // @ts-ignore
    _role[key] = value
    toggleDependantRights(_role, key, value)
    setRole(_role)
  }

  const enterEditMode = (role: any) => {
    setEditMode(true)
    let disabled_rights = [...disabledRights]
    if (role['right_full_admin']) {
      for (let prop in role) {
        if (prop.includes('right_') && prop !== 'right_full_admin') {
          disabled_rights.push(prop)
        }
      }
    } else {
      rightsDependencies.map((e) => {
        if (role[e.dependency]) {
          disabled_rights.push(e.dependant)
        }
      })
    }
    setDisabledRights(disabled_rights)
  }

  const onSubmit = async () => {
    try {
      setLoadingOnValidate(true)

      const roleData = {
        name: role?.name,
        right_full_admin: role?.right_full_admin ?? false,
        right_read_logs: role?.right_read_logs ?? false,
        right_manage_users: role?.right_manage_users ?? false,
        right_read_users: role?.right_read_users ?? false,
        right_manage_datalabs: role?.right_manage_datalabs ?? false,
        right_read_datalabs: role?.right_read_datalabs ?? false,
        right_read_admin_accesses_same_level: role?.right_read_admin_accesses_same_level ?? false,
        right_manage_admin_accesses_same_level: role?.right_manage_admin_accesses_same_level ?? false,
        right_read_admin_accesses_inferior_levels: role?.right_read_admin_accesses_inferior_levels ?? false,
        right_manage_admin_accesses_inferior_levels: role?.right_manage_admin_accesses_inferior_levels ?? false,
        right_read_data_accesses_same_level: role?.right_read_data_accesses_same_level ?? false,
        right_manage_data_accesses_same_level: role?.right_manage_data_accesses_same_level ?? false,
        right_read_data_accesses_inferior_levels: role?.right_read_data_accesses_inferior_levels ?? false,
        right_manage_data_accesses_inferior_levels: role?.right_manage_data_accesses_inferior_levels ?? false,
        right_read_patient_nominative: role?.right_read_patient_nominative ?? false,
        right_read_patient_pseudonymized: role?.right_read_patient_pseudonymized ?? false,
        right_search_patients_by_ipp: role?.right_search_patients_by_ipp ?? false,
        right_manage_export_jupyter_accesses: role?.right_manage_export_jupyter_accesses ?? false,
        right_export_jupyter_nominative: role?.right_export_jupyter_nominative ?? false,
        right_export_jupyter_pseudonymized: role?.right_export_jupyter_pseudonymized ?? false,
        right_manage_export_csv_accesses: role?.right_manage_export_csv_accesses ?? false,
        right_export_csv_nominative: role?.right_export_csv_nominative ?? false,
        right_export_csv_pseudonymized: role?.right_export_csv_pseudonymized ?? false,
        right_search_opposed_patients: role?.right_search_opposed_patients ?? false,
        right_read_accesses_above_levels: role?.right_read_accesses_above_levels ?? false
      }

      if (isEditable) {
        const roleEditResp = await submitEditRoles(roleData, role?.id)
        roleEditResp ? onEditRoleSuccess(true) : onEditRoleFail(true)
      } else {
        const createRoleResp = await createRoles(roleData)
        createRoleResp ? onAddRoleSuccess(true) : onAddRoleFail(true)
      }

      setLoadingOnValidate(false)
      onClose()
    } catch (error) {
      console.error(`Erreur lors de ${isEditable ? "l'édition" : 'la création'} de l'habilitation`, error)
      setLoadingOnValidate(false)
      isEditable ? onEditRoleFail(true) : onAddRoleFail(true)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>{isEditable ? role?.name : 'Créer une nouvelle habilitation :'}</DialogTitle>
      <DialogContent className={classes.dialog}>
        {(isEditable && editMode) || !isEditable ? (
          <Grid container direction="column">
            <Typography variant="h6">Nom de l'habilitation:</Typography>
            <TextField
              margin="normal"
              autoFocus
              placeholder="Nom de l'habilitation"
              value={role?.name}
              onChange={(event) => _onChangeValue('name', event.target.value)}
              error={errorName}
              helperText={errorName && "Le nom de l'habilitation doit contenir au moins 4 caractères."}
              style={{ margin: '1em' }}
            />
          </Grid>
        ) : (
          ''
        )}
        <div className={classes.cardsGrid}>
          {rightsCategories.map((category, index) => (
            <div className={classes.card}>
              <Grid display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{category.name}</Typography>
                {category.isGlobal ? (
                  <span className={classes.chipGlobal}>Global</span>
                ) : (
                  <span className={classes.chipHierarchical}>Hiérarchique</span>
                )}
              </Grid>
              {category.rights.map((right) => (
                <div className={classes.cardItem}>
                  <span style={{ paddingTop: isEditable ? '2px' : '5px' }}>{right.label}</span>
                  <div>
                    {(isEditable && editMode) || !isEditable ? (
                      <Switch
                        checked={!!right.status}
                        onChange={(event) =>
                          // @ts-ignore
                          _onChangeValue(right.keyName, event.target.checked)
                        }
                        disabled={disabledRights.some((r) => r === right.keyName)}
                      />
                    ) : right.status ? (
                      <CheckCircleIcon style={{ color: '#BDEA88' }} />
                    ) : (
                      <CancelIcon style={{ color: '#ED6D91' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {isEditable ? 'Fermer' : 'Annuler'}
        </Button>
        {(isEditable && editMode) || !isEditable ? (
          <Button
            variant="contained"
            disableElevation
            disabled={loadingOnValidate || errorName || !role.name}
            onClick={() => onSubmit()}
            className={classes.buttons}
          >
            {loadingOnValidate ? <CircularProgress /> : 'Valider'}
          </Button>
        ) : (
          userRights.right_full_admin && (
            <Button
              variant="contained"
              disableElevation
              disabled={loadingOnValidate}
              endIcon={<EditIcon height="15px" fill="#FFF" />}
              onClick={() => enterEditMode(role)}
              className={classes.buttons}
            >
              {loadingOnValidate ? <CircularProgress /> : 'Éditer'}
            </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  )
}

export default HabilitationDialog
