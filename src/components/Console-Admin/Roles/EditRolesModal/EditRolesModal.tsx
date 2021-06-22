import React from 'react'

import { Dialog, DialogTitle, DialogContent, Typography,Select, Grid, Switch } from '@material-ui/core'

import useStyles from './styles'
import { Role } from 'types'

type EditRolesModalProps = {
    open: boolean,
    onClose: () => void
}

const EditRolesModal: React.FC<EditRolesModalProps> = ({ open, onClose }) => {

    const classes = useStyles()

    return (
        <Dialog open={open} onClose={onClose} /*className={classes.dialogueContainer}*/>
            <DialogTitle>
                Edition de Roles
            </DialogTitle>
            <DialogContent>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 1</Typography>
                    <Switch></Switch>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 2</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 3</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 4</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 5</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 6</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 7</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 8</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 9</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 10</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 11</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 12</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 13</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 14</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 15</Typography>
                    <Select></Select>
                </Grid>
                <Grid className={classes.gridItem}>
                    <Typography>Droit 16</Typography>
                    <Select></Select>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default EditRolesModal