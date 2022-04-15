import React, { useEffect, useState } from 'react'

import { Button, Grid, Snackbar, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import AddIcon from '@material-ui/icons/Add'

import AccessForm from './AccessForm/AccessForm'
import AccessesTable from './AccessesTable/AccessesTable'
import { getAccesses } from 'services/Console-Admin/providersHistoryService'
import { Access, Order, Profile, Role, UserRole } from 'types'

import useStyles from './styles'

type ProfileComponentProps = {
  profile: Profile
  userRights: UserRole
  roles?: Role[]
}

const orderDefault = { orderBy: 'is_valid', orderDirection: 'asc' } as Order

const ProfileComponent: React.FC<ProfileComponentProps> = ({ profile, userRights, roles }) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [accesses, setAccesses] = useState<Access[] | undefined>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [addAccessSuccess, setAddAccessSuccess] = useState(false)
  const [addAccessFail, setAddAccessFail] = useState(false)
  const [order, setOrder] = useState(orderDefault)

  const manageAccessesUserRights =
    userRights.right_manage_admin_accesses_same_level ||
    userRights.right_manage_admin_accesses_inferior_levels ||
    userRights.right_manage_data_accesses_same_level ||
    userRights.right_manage_data_accesses_inferior_levels ||
    userRights.right_manage_review_transfer_jupyter ||
    userRights.right_manage_transfer_jupyter ||
    userRights.right_manage_export_csv ||
    userRights.right_manage_env_unix_users

  const _getAccesses = async () => {
    try {
      setLoading(true)

      const accessesResp = await getAccesses(profile.provider_history_id, page, order)

      setAccesses(accessesResp?.accesses)
      setTotal(accessesResp?.total)
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des accès', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    _getAccesses()
  }, [order, page]) // eslint-disable-line

  const onClose = () => {
    setOpen(false)
    _getAccesses()
  }

  return (
    <Grid container justify="flex-end">
      <Grid container justify="space-between" alignItems="center">
        <Typography align="left" variant="h2" className={classes.title}>
          Type de profil : {profile.cdm_source}
        </Typography>
        {profile.cdm_source?.toLocaleLowerCase() === 'manual' && manageAccessesUserRights && (
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon height="15px" fill="#FFF" />}
            className={classes.searchButton}
            onClick={() => setOpen(true)}
          >
            Nouvel accès
          </Button>
        )}
      </Grid>

      <AccessesTable
        displayName={false}
        loading={loading}
        page={page}
        setPage={setPage}
        total={total}
        accesses={accesses}
        getAccesses={_getAccesses}
        order={order}
        setOrder={setOrder}
        userRights={userRights}
        roles={roles}
      />
      <AccessForm
        open={open}
        onClose={onClose}
        entityId={profile.provider_history_id}
        onSuccess={setAddAccessSuccess}
        onFail={setAddAccessFail}
        userRights={userRights}
      />
      {addAccessSuccess && (
        <Snackbar
          open
          onClose={() => setAddAccessSuccess(false)}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setAddAccessSuccess(false)}>
            L'accès a bien été créé.
          </Alert>
        </Snackbar>
      )}
      {addAccessFail && (
        <Snackbar
          open
          onClose={() => setAddAccessFail(false)}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="error" onClose={() => setAddAccessFail(false)}>
            Erreur lors de la création de l'accès.
          </Alert>
        </Snackbar>
      )}
    </Grid>
  )
}

export default ProfileComponent
