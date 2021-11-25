import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppSelector } from 'state'

import { Button, CircularProgress, Grid, Paper, Typography } from '@material-ui/core'

import CareSiteTree from 'components/Console-Admin/CareSite/CareSiteTree'
import SearchBar from 'components/SearchBar/SearchBar'

import useStyles from './styles'
import { ScopeTreeRow } from 'types'
import { getUserRights, userDefaultRoles } from 'utils/userRoles'

const CareSites: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const [userRights, setUserRights] = useState(userDefaultRoles)

  const [selectedItem, onChangeSelectedItem] = useState<ScopeTreeRow | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)

  const { me } = useAppSelector((state) => ({ me: state.me }))

  useEffect(() => {
    const _getUserRights = async () => {
      try {
        setLoading(true)

        const getUserRightsResponse = await getUserRights(me?.providerSourceValue)

        setUserRights(getUserRightsResponse)
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des habilitations de l'utilisateur", error)
        setLoading(false)
      }
    }

    _getUserRights()
  }, []) // eslint-disable-line

  return (
    <Grid container direction="column">
      <Grid container justify="center" alignItems="center">
        <Grid container item xs={12} sm={9} direction="column" alignItems="flex-end">
          <Typography variant="h1" color="primary" className={classes.title}>
            Liste des périmètres
          </Typography>

          <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />

          {loading ? (
            <Grid container item justify="center">
              <CircularProgress />
            </Grid>
          ) : (
            <Paper style={{ width: '100%', marginTop: 12, marginBottom: 100 }}>
              <CareSiteTree
                defaultSelectedItems={selectedItem}
                onChangeSelectedItem={onChangeSelectedItem}
                searchInput={searchInput}
                userRights={userRights}
              />
            </Paper>
          )}
        </Grid>

        <Grid container item className={classes.bottomBar} justify="center">
          <Grid container item justify="flex-end" xs={9}>
            <Button
              variant="contained"
              disableElevation
              disabled={!selectedItem}
              className={classes.button}
              onClick={() => history.push(`/caresite/${selectedItem?.care_site_id}`)}
            >
              Valider
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CareSites
