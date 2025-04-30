import React, { Fragment, useEffect, useState } from 'react'

import {
  AccordionDetails,
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'

import {
  Cohort,
  Datalab,
  DatalabTable,
  DatalabTransferForm,
  Order,
  User,
  ResourceType,
  SavedFilter,
  UserRole
} from 'types'
import { getUsers } from 'services/Console-Admin/usersService'
import { getUserCohorts, getUserFilters } from 'services/Console-Admin/cohortsService'
import { datalabTransfer } from 'services/Jupyter/jupyterExportService'
import { getDatalabs } from 'services/Jupyter/datalabsService'
import export_table from './export_tables'

import useStyles from './styles'
import { ExportTableAccordion, ExportTableAccordionSummary } from './TransferTableAccordion'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'

type TransferDatalabFormProps = {
  userRights: UserRole
  onClose: () => void
  selectedTransferRequest: DatalabTransferForm | null
  setSelectedTransferRequest: (transferRequest: DatalabTransferForm | null) => void
  onAddTransferRequestSuccess: (success: boolean) => void
  onAddTransferRequestFail: (fail: boolean) => void
}

const defaultTransfer: DatalabTransferForm = {
  user: null,
  datalab: null,
  confidentiality: 'pseudo',
  shiftDates: 'no',
  tables: export_table.map<DatalabTable>((table) => ({
    ...table,
    checked: table.label === 'person',
    fhir_filter: null,
    fhir_filter_user: null,
    cohort: null,
    cohort_user: null,
    respect_table_relationships: true
  }))
}

const orderDefault = { orderBy: 'lastname', orderDirection: 'asc' } as Order
const datalabOrderDefault = { orderBy: 'name', orderDirection: 'asc' } as Order

const TransferDatalabForm: React.FC<TransferDatalabFormProps> = ({
  onClose,
  setSelectedTransferRequest,
  onAddTransferRequestSuccess,
  onAddTransferRequestFail
}) => {
  const { classes } = useStyles()

  const [expandedTableIds, setExpandedTableIds] = useState<string[]>([])

  const [loadingOnSearchUser, setLoadingOnSearchUser] = useState(false)
  const [loadingOnDatalabs, setLoadingOnDatalabs] = useState(false)
  const [loadingOnValidate, setLoadingOnValidate] = useState(false)
  const [transferRequest, setTransferRequest] = useState(defaultTransfer)
  const checkedTables = transferRequest.tables.filter((table) => table.checked)

  const [usersSearchResults, setUsersSearchResults] = useState<User[]>([])
  const [userSearchInput, setUserSearchInput] = useState('')
  const [datalabSearchInput, setDatalabSearchInput] = useState('')
  const [datalabs, setDatalabs] = useState<Datalab[]>([])
  const [switchedToPseudo, setSwitchedToPseudo] = useState<boolean>(false)

  const debouncedUserSearchTerm = useDebounce(700, userSearchInput)
  const debouncedDatalabSearchTerm = useDebounce(700, datalabSearchInput)

  const _onChangeValue = (key: 'user' | 'datalab' | 'confidentiality' | 'shiftDates' | 'tables', value: any) => {
    const _transferRequest = { ...transferRequest }

    if (key === 'user') {
      _transferRequest.tables = _transferRequest.tables.map<DatalabTable>((table) => ({
        ...table,
        cohort_user: value,
        fhir_filter_user: value,
        cohort: null,
        fhir_filter: null
      }))
    }

    if (key === 'confidentiality' && value === 'pseudo') {
      setSwitchedToPseudo(true)
      _transferRequest.tables = _transferRequest.tables.map<DatalabTable>((table) => ({
        ...table,
        fhir_filter: null
      }))
    }
    if (key === 'confidentiality' && value === 'nomi') {
      setSwitchedToPseudo(false)
    }
    // @ts-ignore
    _transferRequest[key] = value

    setTransferRequest(_transferRequest)
  }

  const handleSelectAllTables = () => {
    _onChangeValue(
      'tables',
      transferRequest.tables.map<DatalabTable>((table) => ({
        ...table,
        checked: table.label !== 'person' ? transferRequest.tables.length !== checkedTables.length : true
      }))
    )
  }

  const handleChangeTables = (tableId: string) => {
    let existingTables: DatalabTable[] = transferRequest.tables

    existingTables = existingTables.map((table) => ({
      ...table,
      checked: table.label === tableId ? !table.checked : table.checked
    }))

    _onChangeValue('tables', existingTables)
  }

  const handleExpandedTable = (tableId: string) => {
    setExpandedTableIds((prevExpandedTableIds) => {
      if (prevExpandedTableIds.includes(tableId)) {
        return prevExpandedTableIds.filter((id) => id !== tableId)
      } else {
        return [...prevExpandedTableIds, tableId]
      }
    })
  }

  useEffect(() => {
    const _searchUsers = async () => {
      try {
        setLoadingOnSearchUser(true)

        const usersResp = await getUsers(orderDefault, 1, debouncedUserSearchTerm)

        setUsersSearchResults(usersResp.users)

        setLoadingOnSearchUser(false)
      } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs', error)
        setUsersSearchResults([])
        setLoadingOnSearchUser(false)
      }
    }

    if (debouncedUserSearchTerm && debouncedUserSearchTerm?.length > 0) {
      _searchUsers()
    } else {
      setUsersSearchResults([])
    }
  }, [debouncedUserSearchTerm])

  useEffect(() => {
    const _getDatalabs = async () => {
      try {
        setLoadingOnDatalabs(true)

        const datalabsResp = await getDatalabs(datalabOrderDefault, 1, debouncedDatalabSearchTerm)

        setDatalabs(datalabsResp?.datalabs)
        setLoadingOnDatalabs(false)
      } catch (error) {
        console.error('Erreur lors de la récupération des machines Jupyter', error)
        setDatalabs([])
        setLoadingOnDatalabs(false)
      }
    }

    if (debouncedDatalabSearchTerm && debouncedDatalabSearchTerm?.length > 0) {
      _getDatalabs()
    } else {
      setDatalabs([])
    }
  }, [debouncedDatalabSearchTerm])

  const onSubmit = async () => {
    try {
      setLoadingOnValidate(true)

      const canExport = transferRequest.tables.find((table) => table.label === 'person')?.cohort !== null

      if (canExport) {
        const transferData = {
          output_format: 'hive',
          datalab: transferRequest.datalab?.uuid,
          export_tables: transferRequest.tables
            .filter((table) => table.checked)
            .map((table: DatalabTable) => ({
              table_name: table.id,
              fhir_filter: table.fhir_filter?.uuid,
              cohort_result_source: table.cohort?.uuid,
              respect_table_relationships: table.respect_table_relationships
            })),
          nominative: transferRequest.confidentiality === 'nomi',
          shift_dates: transferRequest.shiftDates === 'yes'
        }

        const transferRequestResp = await datalabTransfer(transferData)

        if (transferRequestResp) {
          onAddTransferRequestSuccess(true)
        } else {
          onAddTransferRequestFail(true)
        }
        setSelectedTransferRequest(null)
        // setTransferRequest(defaultTransfer)
        setLoadingOnValidate(false)
      } else {
        setLoadingOnValidate(false)
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire", error)
      onAddTransferRequestFail(false)
      setSelectedTransferRequest(null)
      setTransferRequest(defaultTransfer)
      setLoadingOnValidate(false)
    }
  }

  function renderExportTable(exportTable: DatalabTable) {
    const { name, checked, subtitle, label } = exportTable

    const isItemExpanded = expandedTableIds.includes(label)

    return (
      <ExportTableAccordion key={label} expanded={isItemExpanded} onChange={() => handleExpandedTable(label)}>
        <ExportTableAccordionSummary
          expandIcon={
            <Checkbox
              disabled={label === 'person'}
              checked={checked}
              className={classes.checkbox}
              onClick={(e) => {
                e.stopPropagation()
                handleChangeTables(label)
              }}
            />
          }
          aria-controls={`panel-${name}-content`}
          id={`panel-${name}-handler`}
        >
          <Grid item container alignItems="center">
            <Typography
              variant="subtitle2"
              className={isItemExpanded ? classes.selectedTable : classes.notSelectedTable}
            >
              {name} &nbsp; {'['}
            </Typography>
            <Typography variant="h6" className={classes.tableCode}>
              {label}
            </Typography>
            <Typography
              variant="subtitle2"
              className={isItemExpanded ? classes.selectedTable : classes.notSelectedTable}
            >
              {']'}
            </Typography>
            {subtitle && (
              <Grid container alignItems="center">
                <Typography className={classes.tableSubtitle} variant="body1">
                  {subtitle}
                </Typography>
              </Grid>
            )}
          </Grid>
        </ExportTableAccordionSummary>
        <AccordionDetails className={classes.accordionContent}>
          <ExportTable
            key={name}
            exportTable={exportTable}
            transferRequest={transferRequest}
            handleTransferRequestChange={setTransferRequest}
          />
        </AccordionDetails>
      </ExportTableAccordion>
    )
  }

  return (
    <Dialog
      open
      onClose={() => {
        onClose()
        // _defaultTransfer()
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ fontSize: '24px' }}>Transfert vers un Datalab</DialogTitle>
      <DialogContent>
        {loadingOnValidate ? (
          <Grid container justifyContent="center" style={{ padding: 16 }}>
            <CircularProgress size={40} />
          </Grid>
        ) : (
          <>
            <Typography align="left" variant="h5">
              Choix du Datalab vers lequel réaliser l'export
            </Typography>
            <Autocomplete
              className={classes.autocomplete}
              noOptionsText="Recherchez un Datalab"
              options={datalabs ?? []}
              loading={loadingOnDatalabs}
              onChange={(_, value) => _onChangeValue('datalab', value)}
              getOptionLabel={(option) => option.name ?? ''}
              value={transferRequest.datalab}
              isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Recherchez un datalab"
                  value={datalabSearchInput}
                  onChange={(e) => setDatalabSearchInput(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {loadingOnDatalabs ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    )
                  }}
                />
              )}
            />
            <Typography align="left" variant="h5">
              Choix de l'utilisateur par défaut:
            </Typography>
            <Autocomplete
              className={classes.autocomplete}
              noOptionsText="Recherchez un utilisateur"
              options={usersSearchResults ?? []}
              loading={loadingOnSearchUser}
              onChange={(_, value) => _onChangeValue('user', value)}
              getOptionLabel={(option) =>
                `${option.username} - ${option.lastname?.toLocaleUpperCase()} ${option.firstname} - ${option.email}`
              }
              value={transferRequest.user}
              isOptionEqualToValue={(option, value) => option.username === value.username}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Recherchez un utilisateur"
                  value={userSearchInput}
                  onChange={(e) => setUserSearchInput(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {loadingOnSearchUser ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    )
                  }}
                />
              )}
            />

            <Grid container py="28px" gap="16px">
              <Grid item container alignItems="center" flexWrap="nowrap" pr="45px">
                <Grid item container>
                  <Typography variant="h5">Choix des tables à exporter</Typography>
                </Grid>
                <Grid item whiteSpace="nowrap">
                  <FormControlLabel
                    className={classes.selectAll}
                    control={
                      <Checkbox
                        className={classes.checkbox}
                        indeterminate={
                          checkedTables.length !== transferRequest.tables.length && checkedTables.length > 0
                        }
                        checked={checkedTables.length === transferRequest.tables.length}
                        onChange={handleSelectAllTables}
                      />
                    }
                    label={
                      checkedTables.length === transferRequest.tables.length
                        ? 'Tout désélectionner'
                        : 'Tout sélectionner'
                    }
                    labelPlacement="start"
                  />
                </Grid>
              </Grid>
              <Grid item container px="12px">
                {transferRequest.tables.map(renderExportTable)}
              </Grid>
            </Grid>

            <Typography variant="h5">Options d'export</Typography>
            <Grid container padding="8px">
              <Grid item xs={6}>
                <Typography variant="h6">Choix des accès</Typography>
                <RadioGroup
                  row
                  sx={{ paddingLeft: '12px' }}
                  value={transferRequest.confidentiality}
                  onChange={(event) => _onChangeValue('confidentiality', event.target.value)}
                >
                  <FormControlLabel value="pseudo" control={<Radio />} label="Pseudonymisé" />
                  <FormControlLabel value="nomi" control={<Radio />} label="Nominatif" />
                </RadioGroup>
                {switchedToPseudo && (
                  <Grid item>
                    <WarningIcon color="warning" className={classes.warningIcon} />
                    <Typography component="span" className={classes.infoFilters}>
                      En passant en mode <strong>Pseudonymisé</strong>, les filtres déjà sélectionnés sont
                      réinitilisés
                    </Typography>
                  </Grid>
                )}
              </Grid>
              {transferRequest.confidentiality === 'pseudo' && (
                <Grid item xs={6}>
                  <Typography variant="h6">Décaler les dates des évènements</Typography>
                  <RadioGroup
                    row
                    sx={{ paddingLeft: '12px' }}
                    value={transferRequest.shiftDates}
                    onChange={(event) => _onChangeValue('shiftDates', event.target.value)}
                  >
                    <FormControlLabel value="no" control={<Radio />} label="Non" />
                    <FormControlLabel value="yes" control={<Radio />} label="Oui" />
                  </RadioGroup>
                </Grid>
              )}
            </Grid>

            <Grid container padding="8px 0 0 8px">
              <InfoIcon color="action" className={classes.infoIcon} />
              <Typography component="span">Tous les champs sont obligatoires.</Typography>
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Fermer
        </Button>
        <Button
          variant="contained"
          disableElevation
          className={classes.validateButton}
          disabled={checkedTables.length === 0 || transferRequest.datalab === null}
          onClick={onSubmit}
        >
          Envoyer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransferDatalabForm

type ExportTableProps = {
  exportTable: DatalabTable
  transferRequest: DatalabTransferForm
  handleTransferRequestChange: (newTransferRequest: DatalabTransferForm) => void
}

const ExportTable: React.FC<ExportTableProps> = ({ exportTable, transferRequest, handleTransferRequestChange }) => {
  const { classes } = useStyles()

  const [loadingOnSearchCohortUser, setLoadingOnSearchCohortUser] = useState(false)
  const [loadingOnSearchFilterUser, setLoadingOnSearchFilterUser] = useState(false)

  const [cohortsOptions, setCohortsOptions] = useState<Cohort[]>([])
  const [filtersOptions, setFiltersOptions] = useState<SavedFilter[]>([])

  const [cohortUsersSearchResults, setCohortUsersSearchResults] = useState<User[]>([])
  const [filterUsersSearchResults, setFilterUsersSearchResults] = useState<User[]>([])
  const [cohortUserSearchInput, setCohortUserSearchInput] = useState('')
  const [filterUserSearchInput, setFilterUserSearchInput] = useState('')
  const debouncedCohortUserSearchTerm = useDebounce(700, cohortUserSearchInput)
  const debouncedFilterUserSearchTerm = useDebounce(700, filterUserSearchInput)

  const _onChangeValue = (key: 'cohort_user' | 'cohort' | 'fhir_filter_user' | 'fhir_filter', value: any) => {
    const _transferRequest = { ...transferRequest }

    const exportTableIndex = transferRequest.tables.findIndex((table) => table.id === exportTable.id)

    switch (key) {
      case 'cohort_user':
        _transferRequest.tables[exportTableIndex] = {
          ...transferRequest.tables[exportTableIndex],
          cohort_user: value,
          cohort: null
        }
        break
      case 'fhir_filter_user':
        _transferRequest.tables[exportTableIndex] = {
          ...transferRequest.tables[exportTableIndex],
          fhir_filter_user: value,
          fhir_filter: null
        }
        break
      case 'cohort':
      case 'fhir_filter':
        _transferRequest.tables[exportTableIndex] = {
          ...transferRequest.tables[exportTableIndex],
          [key]: value
        }
        break
    }

    handleTransferRequestChange(_transferRequest)
  }

  useEffect(() => {
    const _getUserCohorts = async (user: User | null) => {
      try {
        const cohortsResp = await getUserCohorts(user?.username)

        setCohortsOptions(cohortsResp)
      } catch (error) {
        console.error("Erreur lors de la récupération des cohortes de l'utilisateur", error)
        setCohortsOptions([])
      }
    }
    const _getUserFilters = async (user: User | null, resourceType: ResourceType) => {
      try {
        const filtersResp = await getUserFilters(transferRequest.confidentiality, user?.username, resourceType)

        setFiltersOptions(filtersResp)
      } catch (error) {
        console.error("Erreur lors de la récupération des filtres de l'utilisateur", error)
        setFiltersOptions([])
      }
    }

    if (exportTable.cohort_user) {
      _getUserCohorts(exportTable.cohort_user)
    }
    if (exportTable.fhir_filter_user) {
      _getUserFilters(exportTable.fhir_filter_user, exportTable.resourceType)
    }
  }, [transferRequest.user, cohortUsersSearchResults, filterUsersSearchResults, exportTable])

  useEffect(() => {
    const _searchUsers = async () => {
      try {
        setLoadingOnSearchCohortUser(true)

        const usersResp = await getUsers(orderDefault, 1, debouncedCohortUserSearchTerm)

        setCohortUsersSearchResults(usersResp.users)
        setLoadingOnSearchCohortUser(false)
      } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs', error)
        setCohortUsersSearchResults([])
        setLoadingOnSearchCohortUser(false)
      }
    }

    if (debouncedCohortUserSearchTerm && debouncedCohortUserSearchTerm?.length > 0) {
      _searchUsers()
    } else {
      setCohortUsersSearchResults([])
    }
  }, [debouncedCohortUserSearchTerm])

  useEffect(() => {
    const _searchUsers = async () => {
      try {
        setLoadingOnSearchFilterUser(true)

        const usersResp = await getUsers(orderDefault, 1, debouncedFilterUserSearchTerm)

        setFilterUsersSearchResults(usersResp.users)
        setLoadingOnSearchFilterUser(false)
      } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs', error)
        setFilterUsersSearchResults([])
        setLoadingOnSearchFilterUser(false)
      }
    }

    if (debouncedFilterUserSearchTerm && debouncedFilterUserSearchTerm?.length > 0) {
      _searchUsers()
    } else {
      setFilterUsersSearchResults([])
    }
  }, [debouncedFilterUserSearchTerm])

  return (
    <Grid item container padding="0">
      <Grid item container alignItems="center">
        <Grid item xs={4}>
          <Typography className={classes.textBody2}>Filtrer cette table avec une cohorte :</Typography>
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            disabled={!exportTable.checked}
            size="small"
            className={classes.autocomplete}
            noOptionsText={exportTable.cohort_user ? 'Aucun utilisateur trouvé' : 'Recherchez un utilisateur'}
            options={cohortUsersSearchResults ?? []}
            loading={loadingOnSearchCohortUser}
            onChange={(e, value) => _onChangeValue('cohort_user', value)}
            getOptionLabel={(option) =>
              `${option.username} - ${option.lastname?.toLocaleUpperCase()} ${option.firstname} - ${option.email}`
            }
            value={exportTable.cohort_user}
            isOptionEqualToValue={(option, value) => option.username === value.username}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Recherchez un utilisateur"
                value={cohortUserSearchInput}
                onChange={(e) => setCohortUserSearchInput(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {loadingOnSearchCohortUser ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  )
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            size="small"
            noOptionsText="Aucune cohorte disponible"
            disabled={exportTable.cohort_user === null || !exportTable.checked}
            getOptionLabel={(option) => option.name}
            options={cohortsOptions}
            onChange={(_, value) => _onChangeValue('cohort', value)}
            value={exportTable.cohort}
            isOptionEqualToValue={(option, value) => option.owner === value.owner}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            renderInput={(params) => <TextField {...params} label="Sélectionnez une cohorte" />}
            className={classes.autocomplete}
          />
        </Grid>
      </Grid>
      {exportTable.resourceType !== ResourceType.UNKNOWN && (
        <Grid item container alignItems="center">
          <Grid item xs={4}>
            <Typography className={classes.textBody2}>Filtrer cette table avec un filtre :</Typography>
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              disabled={!exportTable.checked}
              size="small"
              className={classes.autocomplete}
              noOptionsText={exportTable.fhir_filter_user ? 'Aucun utilisateur trouvé' : 'Recherchez un utilisateur'}
              options={filterUsersSearchResults ?? []}
              loading={loadingOnSearchFilterUser}
              onChange={(_, value) => _onChangeValue('fhir_filter_user', value)}
              getOptionLabel={(option) =>
                `${option.username} - ${option.lastname?.toLocaleUpperCase()} ${option.firstname} - ${option.email}`
              }
              value={exportTable.fhir_filter_user}
              isOptionEqualToValue={(option, value) => option.username === value.username}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Recherchez un utilisateur"
                  value={filterUserSearchInput}
                  onChange={(e) => setFilterUserSearchInput(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {loadingOnSearchFilterUser ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              className={classes.autocomplete}
              size="small"
              noOptionsText="Aucun filtre disponible"
              disabled={exportTable.fhir_filter_user === null || !exportTable.checked}
              getOptionLabel={(option) => `Filtre: ${option.name}`}
              options={filtersOptions}
              onChange={(_, value) => _onChangeValue('fhir_filter', value)}
              value={exportTable.fhir_filter}
              renderOption={(props, option) => <li {...props}>{option.name}</li>}
              renderInput={(params) => <TextField {...params} label="Sélectionnez un filtre" />}
            />
          </Grid>
        </Grid>
      )}
      <Grid item container alignItems="center">
        <Grid item xs={4}>
          <Typography className={classes.textBody2}>
            Filtrer cette table en respectant les contraintes relationnelles avec les autres tables sélectionnées :
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <RadioGroup
            className={classes.radioGroup}
            row
            name="contraintes-relationnelles"
            aria-labelledby="contraintes-relationnelles-label"
            defaultValue="Oui"
          >
            <FormControlLabel disabled value="Non" control={<Radio />} label={'Non'} />
            <FormControlLabel value="Oui" control={<Radio />} label={'Oui'} />
          </RadioGroup>
        </Grid>
      </Grid>
    </Grid>
  )
}
