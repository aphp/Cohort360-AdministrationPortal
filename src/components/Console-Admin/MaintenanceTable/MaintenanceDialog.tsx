import React, { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  FormControlLabel,
  Typography,
  Box,
  TextField,
  Radio
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'moment/locale/fr'

import type { MaintenancePhase, MaintenancePhaseCreation } from 'services/Console-Admin/maintenanceService'
import { createMaintenancePhase, updateMaintenancePhase } from 'services/Console-Admin/maintenanceService'
import type { UserRole } from 'types'
import moment from 'moment'

const DEFAULT_MAINTENANCE_MESSAGE_PLACEHOLDER = [
  '# Nous rencontrons actuellement un incident technique',
  'Nous publierons ici chaque nouvelle information importante :',
  '',
  "• Début de l'interruption : jeudi 2 avril 2026 à 9 h 10",
  '• Prochaine mise à jour : 11 h 00',
  '',
  'En cas de besoins, contactez le support :',
  '[id.recherche.support.dsn@aphp.fr](mailto:id.recherche.support.dsn@aphp.fr)'
].join('\n')

type MaintenanceDialogProps = {
  open: boolean
  userRights: UserRole
  selectedMaintenance: MaintenancePhaseCreation | MaintenancePhase
  onClose: () => void
  onAddMaintenanceSuccess: (value: boolean) => void
  onEditMaintenanceSuccess: (value: boolean) => void
  onAddMaintenanceFail: (value: boolean) => void
  onEditMaintenanceFail: (value: boolean) => void
}

const MaintenanceDialog: React.FC<MaintenanceDialogProps> = ({
  open,
  selectedMaintenance,
  onClose,
  onAddMaintenanceSuccess,
  onEditMaintenanceSuccess,
  onAddMaintenanceFail,
  onEditMaintenanceFail
}) => {
  const [maintenanceData, setMaintenanceData] = useState<MaintenancePhaseCreation | MaintenancePhase>({
    ...selectedMaintenance
  })
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(
    selectedMaintenance.start_datetime ? new Date(selectedMaintenance.start_datetime) : null
  )
  const [endDate, setEndDate] = useState<Date | null>(
    selectedMaintenance.end_datetime ? new Date(selectedMaintenance.end_datetime) : null
  )
  const [isDataSavedMessageHidden, setIsDataSavedMessageHidden] = useState(selectedMaintenance.is_data_saved_message_hidden)

  useEffect(() => {
    setMaintenanceData({ ...selectedMaintenance })
    setStartDate(selectedMaintenance.start_datetime ? new Date(selectedMaintenance.start_datetime) : null)
    setEndDate(selectedMaintenance.end_datetime ? new Date(selectedMaintenance.end_datetime) : null)
  }, [selectedMaintenance])

  const handleMaintenanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMaintenanceData({
      ...maintenanceData,
      [name]: value
    })
  }

  const handleTypeChange = (e: any) => {
    setMaintenanceData({
      ...maintenanceData,
      type: e.target.value
    })
  }

  const handleStartDateChange = (newDate: Date | null) => {
    setStartDate(newDate)
    if (newDate) {
      setMaintenanceData({
        ...maintenanceData,
        start_datetime: newDate.toISOString()
      })
    }
  }

  const handleEndDateChange = (newDate: Date | null) => {
    setEndDate(newDate)
    if (newDate) {
      setMaintenanceData({
        ...maintenanceData,
        end_datetime: newDate.toISOString()
      })
    }
  }

  const handleDataSavedMessageHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDataSavedMessageHidden(e.target.checked)
    setMaintenanceData({
      ...maintenanceData,
      is_data_saved_message_hidden: e.target.checked
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const maintenanceDataToSubmit = {
        ...maintenanceData,
        start_datetime: startDate ? startDate.toISOString() : '',
        end_datetime: endDate ? endDate.toISOString() : '',
        is_data_saved_message_hidden: isDataSavedMessageHidden
      }

      if ('id' in maintenanceData) {
        const updateResp = await updateMaintenancePhase(maintenanceDataToSubmit as MaintenancePhase, maintenanceData.id)
        if (updateResp) {
          onEditMaintenanceSuccess(true)
        } else {
          onEditMaintenanceFail(true)
        }
      } else {
        const createResp = await createMaintenancePhase(maintenanceDataToSubmit as MaintenancePhaseCreation)
        if (createResp) {
          onAddMaintenanceSuccess(true)
        } else {
          onAddMaintenanceFail(true)
        }
      }
      setLoading(false)
      onClose()
    } catch (error) {
      console.error('Error while submitting maintenance', error)
      if ('id' in maintenanceData) {
        onEditMaintenanceFail(true)
      } else {
        onAddMaintenanceFail(true)
      }
      setLoading(false)
    }
  }

  const isCreating = !('id' in maintenanceData)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isCreating ? 'Nouvelle phase de maintenance' : 'Modifier la phase de maintenance'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} style={{ marginTop: '8px' }}>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                label="Date de début"
                value={moment(startDate)}
                onChange={(value) => handleStartDateChange(value as Date | null)}
                ampm={false}
                renderInput={(props) => <TextField {...props} fullWidth variant="outlined" />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                label="Date de fin"
                value={moment(endDate)}
                onChange={(value) => handleEndDateChange(value as Date | null)}
                ampm={false}
                renderInput={(props) => <TextField {...props} fullWidth variant="outlined" />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Sujet"
              name="subject"
              value={maintenanceData.subject}
              onChange={handleMaintenanceChange}
              variant="outlined"
              error={maintenanceData.subject === ''}
              helperText={maintenanceData.subject === '' ? 'Le sujet est requis' : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Message"
              name="message"
              value={maintenanceData.message}
              onChange={handleMaintenanceChange}
              placeholder={DEFAULT_MAINTENANCE_MESSAGE_PLACEHOLDER}
              variant="outlined"
              multiline
              rows={4}
              error={maintenanceData.message === ''}
              helperText={
                (maintenanceData.message === ''
                  ? "Le texte d'information aux utilisateurs est requis."
                  : "Texte d'information aux utilisateurs.") + " Le format Markdown est supporté."
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Type de maintenance:
              </Typography>
              <FormControl>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <FormControlLabel
                    value="partial"
                    control={
                      <Radio
                        checked={maintenanceData.type === 'partial'}
                        onChange={() => handleTypeChange({ target: { value: 'partial' } })}
                        color="primary"
                      />
                    }
                    label="Maintenance partielle"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="full"
                    control={
                      <Radio
                        checked={maintenanceData.type === 'full'}
                        onChange={() => handleTypeChange({ target: { value: 'full' } })}
                        color="primary"
                      />
                    }
                    label="Maintenance complète"
                    labelPlacement="end"
                  />
                </Box>
              </FormControl>
            </Box>
            <Grid item xs={12}>
              <Typography
                variant="body2"
                className="infoText"
                sx={{
                  fontStyle: 'italic',
                  color: 'text.secondary',
                  mt: 1
                }}
              >
                En maintenance partielle, toutes les fonctionnalités du portail d'admin sont en read-only à l'exception
                de la page de gestion des maintenances. L'application Cohort360 ne permet pas de créer de requêtes ou de
                cohortes, de les éditer ou de les supprimer, seulement de consulter les données. En maintenance
                complète, l'application est totalement inaccessible.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={maintenanceData.is_data_saved_message_hidden} onChange={handleDataSavedMessageHiddenChange} />}
                label="Masquer le message indiquant que les données sont sauvegardées"
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {isCreating ? 'Créer' : 'Modifier'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default MaintenanceDialog
