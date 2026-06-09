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
import {
  computeRightsDependencies,
  computeDisabledRightsAfterToggle,
  computeInitialDisabledRights,
  buildRolePayload
} from './helpers'

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

  const isEditable = Boolean(selectedRole?.id)

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
    setRightsDependencies(computeRightsDependencies(_rightsCategories))
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
    setDisabledRights(computeDisabledRightsAfterToggle(role, right, value, rightsDependencies, disabledRights))
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
    setDisabledRights([...disabledRights, ...computeInitialDisabledRights(role, rightsDependencies)])
  }

  const onSubmit = async () => {
    try {
      setLoadingOnValidate(true)

      const roleData = buildRolePayload(role)

      if (isEditable) {
        const roleEditResp = await submitEditRoles(roleData, role?.id)
        if (roleEditResp) onEditRoleSuccess(true)
        else onEditRoleFail(true)
      } else {
        const createRoleResp = await createRoles(roleData)
        if (createRoleResp) onAddRoleSuccess(true)
        else onAddRoleFail(true)
      }

      setLoadingOnValidate(false)
      onClose()
    } catch (error) {
      console.error(`Erreur lors de ${isEditable ? "l'édition" : 'la création'} de l'habilitation`, error)
      setLoadingOnValidate(false)
      if (isEditable) onEditRoleFail(true)
      else onAddRoleFail(true)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>{isEditable ? role?.name : 'Créer une nouvelle habilitation :'}</DialogTitle>
      <DialogContent className={classes.dialog}>
        {(isEditable && editMode) || !isEditable ? (
          <Grid container direction="column">
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
            <div key={category.name} className={classes.card}>
              <Grid display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{category.name}</Typography>
                {category.is_global ? (
                  <span className={classes.chipGlobal}>Global</span>
                ) : (
                  <span className={classes.chipHierarchical}>Hiérarchique</span>
                )}
              </Grid>
              {category.rights.map((right) => (
                <div key={right.name} className={classes.cardItem}>
                  <span style={{ paddingTop: isEditable ? '2px' : '5px' }}>{right.label}</span>
                  <div>
                    {(isEditable && editMode) || !isEditable ? (
                      <Switch
                        checked={!!role[right.name]}
                        onChange={(event) =>
                          // @ts-ignore
                          _onChangeValue(right.name, event.target.checked)
                        }
                        disabled={disabledRights.includes(right.name)}
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
