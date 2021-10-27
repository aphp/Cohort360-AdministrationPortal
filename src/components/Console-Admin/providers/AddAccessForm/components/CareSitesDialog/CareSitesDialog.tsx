import React, { useState } from "react"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
} from "@material-ui/core"

import useStyles from "./styles"
import CareSiteTree from "components/Console-Admin/CareSite/CareSiteTree"
import SearchBar from "components/SearchBar/SearchBar"
import { ScopeTreeRow } from "types"

type CareSitesDialogProps = {
  careSite: ScopeTreeRow | null
  onChangeCareSite: (careSite: ScopeTreeRow | null) => void
  open: boolean
  onClose: () => void
  isManageable: boolean
}

const CareSitesDialog: React.FC<CareSitesDialogProps> = ({
  careSite,
  onChangeCareSite,
  open,
  onClose,
  isManageable,
}) => {
  const classes = useStyles()
  const [searchInput, setSearchInput] = useState("")

  const onCancel = () => {
    onChangeCareSite(null)
    onClose()
  }

  const onSubmit = () => {
    onClose()
  }

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
        <Grid container item xs={12} direction="column" alignItems="flex-end">
          <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />

          <Paper style={{ width: "100%", marginTop: 12 }}>
            <CareSiteTree
              isManageable={isManageable}
              defaultSelectedItems={careSite}
              onChangeSelectedItem={onChangeCareSite}
              searchInput={searchInput}
            />
          </Paper>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
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
