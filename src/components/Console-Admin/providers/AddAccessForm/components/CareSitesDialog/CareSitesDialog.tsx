import React, { useState } from "react"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"

import useStyles from "./styles"
import CareSiteTree from "components/Console-Admin/CareSite/CareSiteTree"
import { getManageableCareSites } from "services/Console-Admin/careSiteService"
import { ScopeTreeRow } from "types"

type CareSitesDialogProps = {
  careSite: ScopeTreeRow | null
  onChangeCareSite: (careSite: ScopeTreeRow | null) => void
  open: boolean
  onClose: () => void
}

const CareSitesDialog: React.FC<CareSitesDialogProps> = ({
  careSite,
  onChangeCareSite,
  open,
  onClose,
}) => {
  const classes = useStyles()
  const [selectedItems, onChangeSelectedItems] =
    useState<ScopeTreeRow | null>(null)

  const onCancel = () => {
    onChangeSelectedItems(null)
    onChangeCareSite(null)
    onClose()
  }

  const onSubmit = () => {
    onClose()
  }
  console.log(`selectedItems`, selectedItems)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      maxWidth="md"
      className={classes.dialog}
    >
      <DialogTitle className={classes.title}>
        Sélectionner un périmètre :
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container item xs={12} direction="column">
          <CareSiteTree
            getCareSites={getManageableCareSites}
            defaultSelectedItems={careSite}
            onChangeSelectedItem={onChangeCareSite}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Annuler
        </Button>
        <Button disabled={!careSite} onClick={onSubmit} color="primary">
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CareSitesDialog
