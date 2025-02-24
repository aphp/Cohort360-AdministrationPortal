import React from 'react'

import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Tooltip,
  CircularProgress
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import useStyles from './styles'
import { User } from 'types'

type UsersTableProps = {
  usersList: User[]
  loading?: boolean
  usersAssociated?: User[]
  onChangeUsersAssociated: (key: any, value: any) => void
}

const UsersTable: React.FC<UsersTableProps> = ({ usersList, loading, usersAssociated, onChangeUsersAssociated }) => {
  const { classes } = useStyles()

  const columns = [
    {
      label: 'Identifiant APH',
      code: 'username'
    },
    {
      label: 'Nom',
      code: 'lastname'
    },
    {
      label: 'Prénom',
      code: 'firstname'
    },
    {
      label: 'Email',
      code: 'email'
    },
    {
      label: 'Suppression'
    }
  ]

  const deleteItem = (user: User) => {
    const _usersAssociatedCopy = usersAssociated ?? []

    const index = _usersAssociatedCopy.indexOf(user) ?? -1
    if (index > -1) {
      _usersAssociatedCopy.splice(index, 1)
    }

    onChangeUsersAssociated('usersAssociated', _usersAssociatedCopy)
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow className={classes.tableHead}>
            {columns.map((column, index: number) => (
              <TableCell key={index} align="center" className={classes.tableHeadCell}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7}>
                <div className={classes.loadingSpinnerContainer}>
                  <CircularProgress size={50} />
                </div>
              </TableCell>
            </TableRow>
          ) : !usersList || usersList?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                <Typography className={classes.loadingSpinnerContainer}>Aucun résultat à afficher</Typography>
              </TableCell>
            </TableRow>
          ) : (
            usersList.map((user: User) => {
              return (
                user && (
                  <TableRow key={user.username} className={classes.tableBodyRows} hover>
                    <TableCell align="center">{user.username}</TableCell>
                    <TableCell align="center">{user.lastname?.toLocaleUpperCase()}</TableCell>
                    <TableCell align="center">{user.firstname}</TableCell>
                    <TableCell align="center">{user.email ?? '-'}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Supprimer l'utilisateur" style={{ padding: '0 12px' }}>
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation()
                            deleteItem(user)
                          }}
                          size="large"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              )
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UsersTable
