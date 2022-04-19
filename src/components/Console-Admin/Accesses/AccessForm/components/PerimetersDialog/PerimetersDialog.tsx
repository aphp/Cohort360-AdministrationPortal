import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Paper } from '@material-ui/core'

import useStyles from './styles'
import PerimeterTree from 'components/Console-Admin/Perimeter/PerimeterTree'
import SearchBar from 'components/SearchBar/SearchBar'
import { ScopeTreeRow, UserRole } from 'types'

type PerimetersDialogProps = {
  perimeter: ScopeTreeRow | null
  onChangePerimeter: (perimeter: ScopeTreeRow | null) => void
  open: boolean
  onClose: () => void
  isManageable: boolean
  userRights: UserRole
}

const PerimetersDialog: React.FC<PerimetersDialogProps> = ({
  perimeter,
  onChangePerimeter,
  open,
  onClose,
  isManageable,
  userRights
}) => {
  const classes = useStyles()
  const [searchInput, setSearchInput] = useState('')

  const onCancel = () => {
    onChangePerimeter(null)
    onClose()
  }

  const onSubmit = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md" className={classes.dialog}>
      <DialogTitle className={classes.title}>Sélectionner un périmètre :</DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container item xs={12} direction="column" alignItems="flex-end">
          <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />

          <Paper style={{ width: '100%', marginTop: 12 }}>
            <PerimeterTree
              isManageable={isManageable}
              defaultSelectedItems={perimeter}
              onChangeSelectedItem={onChangePerimeter}
              searchInput={searchInput}
              userRights={userRights}
            />
          </Paper>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Annuler
        </Button>
        <Button disabled={!perimeter} onClick={onSubmit} color="primary">
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PerimetersDialog
