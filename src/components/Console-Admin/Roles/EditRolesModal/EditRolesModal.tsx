import React from 'react'

import { Dialog, DialogTitle } from '@material-ui/core'

type EditRolesModalProps = {
    open: boolean,
    onClose: () => void
}

const EditRolesModal: React.FC<EditRolesModalProps> = ({ open, onClose }) => {

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Edition de Roles
            </DialogTitle>
        </Dialog>
    )
}

export default EditRolesModal