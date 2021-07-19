import React from 'react'

import { Checkbox, Button } from '@material-ui/core'

// import useStyles from './styles'
import { Role } from 'types'

type EditRolesModalProps = {
    role?: Role | null
    open: boolean,
    onClose: () => void
    onSuccess?: () => void
    onFail?: () => void
}

type EditValidationProps = {
    onClose?: () => void
    onSuccess?: () => void
    onFail?: () => void
}

export const EditRolesSwitch: React.FC<EditRolesModalProps> = ({
    role,
    open, 
    onClose,
    onSuccess,
    onFail,
}) => {

    // const classes = useStyles()

    return (
       <Checkbox size="small"></Checkbox>
    )
}

export const EditRolesValidation: React.FC<EditValidationProps> = ({ onClose, onSuccess, onFail }) => {
    return (
        <>
            <Button>Annuler</Button>
            <Button>Validation</Button>
        </>
    )
}