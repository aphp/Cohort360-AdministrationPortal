import React, { useEffect, useState } from 'react'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography
} from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'

import { Order, Provider } from 'types'
import useDebounce from 'components/Console-Admin/CareSite/use-debounce'

import useStyles from './styles'
import ProvidersTable from '../ProvidersTable/ProvidersTable'
import SearchBar from 'components/SearchBar/SearchBar'
import { getProviders } from 'services/Console-Admin/providersService'

type ProviderSearchDialogProps = {
  open: boolean
  onClose: () => void
  usersAssociated: Provider[]
  onChangeUsersAssociated: (key: any, value: any) => void
}

const orderDefault = { orderBy: 'lastname', orderDirection: 'asc' } as Order

const ProviderSearchDialog: React.FC<ProviderSearchDialogProps> = ({
  open,
  onClose,
  usersAssociated,
  onChangeUsersAssociated
}) => {
  const classes = useStyles()

  const [searchInput, setSearchInput] = useState('')
  const [providersResults, setProvidersResults] = useState([])

  const [loadingProviderData, setLoadingProviderData] = useState(false)

  const debouncedSearchTerm = useDebounce(700, searchInput)

  useEffect(() => {
    const _searchProviders = async () => {
      try {
        setLoadingProviderData(true)

        const providersResp = await getProviders(orderDefault, 1, debouncedSearchTerm)

        setProvidersResults(providersResp.providers)

        setLoadingProviderData(false)
      } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs')
        setProvidersResults([])
        setLoadingProviderData(false)
      }
    }

    if (debouncedSearchTerm && debouncedSearchTerm?.length > 0) {
      _searchProviders()
    } else {
      setProvidersResults([])
    }
  }, [debouncedSearchTerm])

  const deleteItem = (provider: Provider) => {
    const _usersAssociatedCopy = usersAssociated
    const index = _usersAssociatedCopy?.indexOf(provider) ?? -1
    if (index > -1) {
      _usersAssociatedCopy?.splice(index, 1)
    }

    onChangeUsersAssociated('usersAssociated', _usersAssociatedCopy)
  }

  const onSubmit = async () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className={classes.title}>Ajouter des membres à votre groupe :</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Utilisateurs déjà ajoutés :</Typography>
        <div style={{ margin: '1em' }}>
          {usersAssociated &&
            usersAssociated.map((user: Provider) => (
              <Grid container item alignItems="center" key={user.provider_source_value}>
                <Typography>
                  - {user.provider_source_value} - {user.lastname?.toUpperCase()} {user.firstname}
                </Typography>
                <Tooltip title="Supprimer l'utilisateur" style={{ padding: '0 12px' }}>
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation()
                      deleteItem(user)
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            ))}
        </div>

        <Grid container item justify="flex-end" style={{ margin: '12px 0' }}>
          <Grid container item xs={6} justify="flex-end" alignItems="center">
            <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
          </Grid>
        </Grid>

        <ProvidersTable
          providersList={providersResults}
          loading={loadingProviderData}
          usersAssociated={usersAssociated}
          onChangeUsersAssociated={onChangeUsersAssociated}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button disabled={loadingProviderData} onClick={onSubmit} color="primary">
          {loadingProviderData ? <CircularProgress /> : 'Valider'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProviderSearchDialog
