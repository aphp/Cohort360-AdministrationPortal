import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, CircularProgress, Grid, Paper, Typography } from '@mui/material'

import PerimeterTree from 'components/Console-Admin/Perimeter/PerimeterTree'
import SearchBar from 'components/SearchBar/SearchBar'

import useStyles from './styles'
import { ScopeTreeRow } from 'types'
import { getUserRights, userDefaultRoles } from 'utils/userRoles'

const Perimeters: React.FC = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const [userRights, setUserRights] = useState(userDefaultRoles)

  const [selectedItem, onChangeSelectedItem] = useState<ScopeTreeRow | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const _getUserRights = async () => {
      try {
        setLoading(true)

        const getUserRightsResponse = await getUserRights()

        setUserRights(getUserRightsResponse)
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des droits de l'utilisateur", error)
        setLoading(false)
      }
    }

    _getUserRights()
  }, [])

  return (
    <Grid container direction="column">
      <Grid container justifyContent="center" alignItems="center">
        <Grid container item xs={12} sm={10} direction="column" alignItems="flex-end">
          <Typography variant="h1" align="center" className={classes.title}>
            Liste des périmètres
          </Typography>

          {loading ? (
            <Grid container item justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : (
            <>
              <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
              <Paper style={{ width: '100%', marginTop: 12, marginBottom: 100 }}>
                <PerimeterTree
                  defaultSelectedItems={selectedItem}
                  onChangeSelectedItem={onChangeSelectedItem}
                  searchInput={searchInput}
                  userRights={userRights}
                />
              </Paper>
            </>
          )}
        </Grid>

        <Grid container item className={classes.bottomBar} justifyContent="center">
          <Grid container item justifyContent="flex-end" xs={9}>
            <Button
              variant="contained"
              disableElevation
              disabled={!selectedItem}
              className={classes.button}
              onClick={() => navigate(`/console-admin/perimeter/${selectedItem?.id}`)}
            >
              Valider
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Perimeters
