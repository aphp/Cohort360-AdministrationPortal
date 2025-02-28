import React, { useState } from 'react'

import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from '@mui/material'

import { addNewDatalab } from 'services/Jupyter/datalabsService'
import { Datalab, InfrastructureProvider, UserRole } from 'types'

type DatalabsFormProps = {
  userRights: UserRole
  selectedDatalab: Datalab
  infrastructureProviders: InfrastructureProvider[]
  onClose: () => void
  onAddDatalabSuccess: (success: boolean) => void
  onAddDatalabFail: (fail: boolean) => void
}

const DatalabsForm: React.FC<DatalabsFormProps> = ({
  onClose,
  selectedDatalab,
  infrastructureProviders,
  onAddDatalabSuccess,
  onAddDatalabFail
}) => {
  const [loadingOnValidate, setLoadingOnValidate] = useState(false)
  const [datalab, setDatalab] = useState<Datalab>(selectedDatalab)

  const _onChangeValue = (key: 'name' | 'infrastructure_provider', value: any) => {
    const _datalabCopy = { ...datalab }
    // TODO: fix ts-ignore
    // @ts-ignore
    _datalabCopy[key] = value
    setDatalab(_datalabCopy)
  }

  const onSubmit = async () => {
    setLoadingOnValidate(true)
    const datalabData = { name: datalab.name, infrastructure_provider: datalab.infrastructure_provider.uuid }
    const addDatalabResp = await addNewDatalab(datalabData)
    if (addDatalabResp) {
      onAddDatalabSuccess(true)
    } else {
      onAddDatalabFail(true)
    }
    onClose()
    setLoadingOnValidate(false)
  }

  return (
    <>
      <Dialog open maxWidth="sm" fullWidth onClose={onClose}>
        <DialogTitle>Ajout d'un datalab</DialogTitle>
        <DialogContent>
          <>
            <Grid container direction="column">
              <Typography variant="h6">Intitulé</Typography>
              <TextField
                margin="normal"
                autoFocus
                placeholder="ex: cse123456"
                value={datalab.name}
                onChange={(event) => _onChangeValue('name', event.target.value)}
                style={{ margin: '1em' }}
              />
            </Grid>
            <Grid container direction="column">
              <Typography variant="h6">Fournisseur d'infrastructure</Typography>
              <Autocomplete
                options={infrastructureProviders}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) => _onChangeValue('infrastructure_provider', value)}
                renderOption={(props, option) => <li {...props}>{option.name}</li>}
                renderInput={(params) => <TextField {...params} />}
                value={datalab.infrastructure_provider}
                style={{ margin: '1em' }}
              />
            </Grid>
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={onSubmit} color="primary" disabled={!datalab.name || !datalab.infrastructure_provider}>
            {loadingOnValidate ? <CircularProgress /> : 'Valider'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DatalabsForm
