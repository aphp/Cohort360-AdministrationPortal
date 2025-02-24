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
import { Role, RoleKeys, UserRole, RightsCategory, RightsDependency } from 'types'
import api from '../../../../services/api'

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
  const [rightsCategories, setRightsCategories] = useState<RightsCategory[]>([])
  const [rightsDependencies, setRightsDependencies] = useState<RightsDependency[]>([])

  const isEditable = selectedRole?.id ? true : false

  const getRightCategories = async () => {
    try {
      const rightsResp = await api.get('/accesses/rights/')
      buildRightsDependencies(rightsResp.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des droits', error)
    }
  }

  const buildRightsDependencies = (_rightsCategories: RightsCategory[]) => {
    setRightsCategories(_rightsCategories)
    const _rightsDependencies: RightsDependency[] = []
    _rightsCategories.map((category) => {
      category.rights.map((right) => {
        if (right.depends_on) {
          _rightsDependencies.push({ dependent: right.name, dependency: right.depends_on })
        }
      })
    })
    setRightsDependencies(_rightsDependencies)
  }

  useEffect(() => {
    getRightCategories()
  }, [isEditable])

  useEffect(() => {
    if ((role.name && role.name.length < 4) || !role.name) {
      setErrorName(true)
    } else {
      setErrorName(false)
    }
  }, [role])

  const toggleDependentRights = (role: any, right: RoleKeys, value: boolean) => {
    let disabled_rights = [...disabledRights]
    if (right === 'right_full_admin') {
      for (const r in role) {
        if (r.includes('right_') && r !== right) {
          role[r] = value
          if (value) {
            disabled_rights.push(r)
          } else {
            disabled_rights = disabled_rights.filter((dr) => dr !== r)
          }
        }
      }
    } else {
      rightsDependencies.map((r) => {
        if (r.dependency === right) {
          if (value) {
            role[r.dependent] = value
            disabled_rights.push(r.dependent)
          } else {
            disabled_rights = disabled_rights.filter((dr) => dr !== r.dependent)
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
    toggleDependentRights(_role, key, value)
    setRole(_role)
  }

  const enterEditMode = (role: any) => {
    setEditMode(true)
    const disabled_rights = [...disabledRights]
    if (role['right_full_admin']) {
      for (const prop in role) {
        if (prop.includes('right_') && prop !== 'right_full_admin') {
          disabled_rights.push(prop)
        }
      }
    } else {
      rightsDependencies.map((e) => {
        if (role[e.dependency]) {
          disabled_rights.push(e.dependent)
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
          {rightsCategories.map((category) => (
            <div className={classes.card}>
              <Grid display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{category.name}</Typography>
                {category.is_global ? (
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
                        checked={!!role[right.name]}
                        onChange={(event) =>
                          // @ts-ignore
                          _onChangeValue(right.name, event.target.checked)
                        }
                        disabled={disabledRights.some((r) => r === right.name)}
                      />
                    ) : role[right.name] ? (
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
