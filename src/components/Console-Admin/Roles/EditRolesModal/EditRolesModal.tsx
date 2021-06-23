import React from 'react'

import { Switch } from '@material-ui/core'

import useStyles from './styles'
import { Role } from 'types'

type EditRolesModalProps = {
    role?: Role | null
    open: boolean,
    onClose: () => void
    onSuccess?: () => void
    onFail?: () => void
}

const EditRolesModal: React.FC<EditRolesModalProps> = ({
    role,
    open, 
    onClose,
    onSuccess,
    onFail,
}) => {

    // const classes = useStyles()

    return (
       <Switch></Switch>
    )
}

export default EditRolesModal