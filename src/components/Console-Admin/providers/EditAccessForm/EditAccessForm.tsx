import React, { useEffect, useState } from "react"
import moment from "moment"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core"
import { KeyboardDatePicker } from "@material-ui/pickers"
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date"

import InfoIcon from "@material-ui/icons/Info"

import useStyles from "./styles"
import { submitEditAccess } from "services/Console-Admin/providersHistoryService"
import { Access, AccessData } from "types"

type EditAccessFormProps = {
  open: boolean
  onClose: () => void
  access?: Access | null
  onSuccess: (success: boolean) => void
  onFail: (fail: boolean) => void
}

const EditAccessForm: React.FC<EditAccessFormProps> = ({
  open,
  onClose,
  access,
  onSuccess,
  onFail,
}) => {
  const classes = useStyles()

  const [startDate, setStartDate] = useState<MaterialUiPickersDate | null>(
    moment(
      new Date(access?.actual_start_datetime as string),
      "YYYY-MM-DD[T]HH:mm:ss Z"
    )
  )
  const [endDate, setEndDate] = useState<MaterialUiPickersDate | null>(
    moment(
      new Date(access?.actual_end_datetime as string),
      "YYYY-MM-DD[T]HH:mm:ss Z"
    )
  )
  const [dateError, setDateError] = useState(false)

  const isStartDatePast = startDate ? startDate.isBefore() : false
  const isEndDatePast = endDate ? endDate.isBefore() : false

  useEffect(() => {
    setStartDate(
      moment(
        new Date(access?.actual_start_datetime as string),
        "YYYY-MM-DD[T]HH:mm:ss Z"
      )
    )
    setEndDate(
      moment(
        new Date(access?.actual_end_datetime as string),
        "YYYY-MM-DD[T]HH:mm:ss Z"
      )
    )
  }, [access])

  useEffect(() => {
    if (moment(startDate).isAfter(endDate)) {
      setDateError(true)
    } else {
      setDateError(false)
    }
  }, [startDate, endDate])

  const onSubmit = () => {
    let editAccessData = {} as AccessData

    const stringStartDate = moment(startDate).isValid()
      ? moment(startDate).format()
      : access?.actual_start_datetime ?? null

    const stringEndDate = moment(endDate).isValid()
      ? moment(endDate).format()
      : access?.actual_end_datetime ?? null

    if (startDate?.isBefore()) {
      editAccessData = {
        end_datetime: stringEndDate,
      }
    } else {
      editAccessData = {
        start_datetime: stringStartDate,
        end_datetime: stringEndDate,
      }
    }

    submitEditAccess(editAccessData, access?.care_site_history_id).then(
      (success) => {
        if (success) {
          onSuccess(true)
        } else {
          onFail(true)
        }
      }
    )

    _onClose()
  }

  const _onClose = () => {
    setStartDate(null)
    setEndDate(null)

    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>
        Éditer l'accès à {access?.care_site.care_site_name}:
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        <>
          {!startDate?.isBefore() && (
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.filter}
            >
              <Typography variant="h3">Date de début :</Typography>
              <KeyboardDatePicker
                clearable
                minDate={moment()} // = today
                error={dateError}
                style={{ width: "250px" }}
                invalidDateMessage='La date doit être au format "JJ/MM/AAAA"'
                format="DD/MM/YYYY"
                onChange={(date: MaterialUiPickersDate) =>
                  setStartDate(date ?? null)
                }
                value={startDate}
              />

              {dateError && (
                <Typography className={classes.error}>
                  Vous ne pouvez pas sélectionner de date de début supérieure à
                  la date de fin.
                </Typography>
              )}
            </Grid>
          )}
          {!endDate?.isBefore() && (
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.filter}
            >
              <Typography variant="h3">Date de fin :</Typography>
              <KeyboardDatePicker
                clearable
                minDate={moment().add(1, "days")} // = tomorrow
                error={dateError}
                style={{ width: "250px" }}
                invalidDateMessage='La date doit être au format "JJ/MM/AAAA"'
                format="DD/MM/YYYY"
                onChange={(date: MaterialUiPickersDate) =>
                  setEndDate(date ?? null)
                }
                value={endDate}
              />

              {dateError && (
                <Typography className={classes.error}>
                  Vous ne pouvez pas sélectionner de date de début supérieure à
                  la date de fin.
                </Typography>
              )}
            </Grid>
          )}
          <div>
            <InfoIcon color="action" className={classes.infoIcon} />
            <Typography component="span">
              Vous ne pouvez éditer que les dates qui ne sont pas encore
              passées.
            </Typography>
          </div>
        </>
      </DialogContent>

      <DialogActions>
        <Button onClick={_onClose} color="secondary">
          Annuler
        </Button>
        <Button
          disabled={dateError || (isStartDatePast && isEndDatePast)}
          onClick={onSubmit}
          color="primary"
        >
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditAccessForm
