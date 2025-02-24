import React, { useEffect, useState } from 'react'

import { Button, Grid, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import AccessForm from './AccessForm/AccessForm'
import AccessesTable from './AccessesTable/AccessesTable'
import { getAccesses } from 'services/Console-Admin/profilesService'
import { Access, Order, Profile, Role, UserRole } from 'types'

import useStyles from './styles'
import CommonSnackbar from 'components/Snackbar/Snackbar'

type ProfileComponentProps = {
  profile: Profile
  userRights: UserRole
  roles?: Role[]
}

const orderDefault = { orderBy: 'is_valid', orderDirection: 'asc' } as Order

const ProfileComponent: React.FC<ProfileComponentProps> = ({ profile, userRights, roles }) => {
  const { classes } = useStyles()

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
    userRights.right_manage_export_jupyter_accesses ||
    userRights.right_manage_export_csv_accesses

  const _getAccesses = async () => {
    try {
      setLoading(true)

      const accessesResp = await getAccesses(profile.id, page, order)

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
  }, [order, page])

  const onClose = () => {
    setOpen(false)
    _getAccesses()
  }

  return (
    <Grid container justifyContent="flex-end">
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography align="left" variant="h2" className={classes.title}>
          Type de profil : {profile.source}
        </Typography>
        {profile.source?.toLocaleLowerCase() === 'manual' && manageAccessesUserRights && (
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
        entityId={profile.id}
        onSuccess={setAddAccessSuccess}
        onFail={setAddAccessFail}
        userRights={userRights}
      />

      {addAccessSuccess && (
        <CommonSnackbar
          onClose={() => setAddAccessSuccess(false)}
          severity="success"
          message="L'accès a bien été créé."
        />
      )}
      {addAccessFail && (
        <CommonSnackbar
          onClose={() => setAddAccessFail(false)}
          severity="error"
          message="Erreur lors de la création de l'accès"
        />
      )}
    </Grid>
  )
}

export default ProfileComponent
