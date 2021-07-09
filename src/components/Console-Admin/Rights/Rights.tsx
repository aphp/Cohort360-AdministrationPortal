import React, { useEffect, useState } from "react"

import { Button, Grid, Typography } from "@material-ui/core"

import AddIcon from "@material-ui/icons/Add"

import useStyles from "./styles"
import AddAccessForm from "../providers/AddAccessForm/AddAccessForm"
import RightsTable from "./RightsTable/RightsTable"
import { getAccesses } from "services/Console-Admin/providersHistoryService"
import { Access, Profile } from "types"
import { Alert } from "@material-ui/lab"

type RightsProps = {
  right: Profile
}

const Rights: React.FC<RightsProps> = ({ right }) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [accesses, setAccesses] = useState<Access[] | undefined>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [addAccessSuccess, setAddAccessSuccess] = useState(false)
  const [addAccessFail, setAddAccessFail] = useState(false)

  const _getAccesses = () => {
    setLoading(true)
    getAccesses(right.provider_history_id, page)
      .then((res) => {
        setAccesses(res?.accesses)
        setTotal(res?.total)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    _getAccesses()
  }, [accesses?.length, page]) // eslint-disable-line

  useEffect(() => {
    if (addAccessSuccess) _getAccesses()
  }, [addAccessSuccess]) // eslint-disable-line

  const onClose = () => {
    setOpen(false)
    _getAccesses()
  }

  return (
    <Grid container justify="flex-end">
      <Grid container justify="space-between" alignItems="center">
        <Typography align="left" variant="h2" className={classes.title}>
          Type de droit : {right.cdm_source}
        </Typography>
        {right.cdm_source === "MANUAL" && (
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

      <RightsTable
        displayName={false}
        loading={loading}
        page={page}
        setPage={setPage}
        total={total}
        accesses={accesses}
        getAccesses={_getAccesses}
      />

      <AddAccessForm
        open={open}
        onClose={onClose}
        entityId={right.provider_history_id}
        onSuccess={setAddAccessSuccess}
        onFail={setAddAccessFail}
      />
      {addAccessSuccess && (
        <Alert
          severity="success"
          onClose={() => setAddAccessSuccess(false)}
          className={classes.alert}
        >
          Le droit a bien été créé.
        </Alert>
      )}
      {addAccessFail && (
        <Alert
          severity="error"
          onClose={() => setAddAccessFail(false)}
          className={classes.alert}
        >
          Erreur lors de la création du droit.
        </Alert>
      )}
    </Grid>
  )
}

export default Rights
