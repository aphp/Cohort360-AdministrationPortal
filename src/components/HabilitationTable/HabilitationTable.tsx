import React from 'react'

import {
  Grid,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography
} from '@mui/material'
import LaunchIcon from '@mui/icons-material/Launch'
import useStyles from './styles'
import moment from 'moment'
import { useNavigate } from 'react-router'
import { Column, Order, UserInHabilitation } from 'types'

interface HabilitationTableProps {
  usersInHabilitation: UserInHabilitation[]
  page?: number
  setPage?: (page: number) => void
  onChangePage?: (value: number) => void
  total?: number
  order: Order
  setOrder?: (order: Order) => void
}

const HabilitationTable: React.FC<HabilitationTableProps> = (props) => {
  const { usersInHabilitation, page, setPage, onChangePage, total, order, setOrder } = props
  const { classes } = useStyles()
  const navigate = useNavigate()

  const rowsPerPage = 20

  const columns: Column[] = [
    {
      label: 'Nom Complet',
      code: 'lastname',
      align: 'left',
      sortableColumn: true
    },
    {
      label: 'Perimètre',
      code: 'perimeter',
      align: 'left',
      sortableColumn: true
    },
    {
      label: 'Date de début',
      code: 'start_datetime',
      align: 'left',
      sortableColumn: true
    },
    {
      label: 'Date de fin',
      code: 'end_datetime',
      align: 'left',
      sortableColumn: true
    }
  ]

  const createSortHandler = (property: any) => () => {
    if (setOrder) {
      const isAsc: boolean = order.orderBy === property && order.orderDirection === 'asc'
      const _orderDirection = isAsc ? 'desc' : 'asc'

      setOrder({
        orderBy: property,
        orderDirection: _orderDirection
      })
    }
  }

  return (
    <Grid container justifyContent="flex-end">
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableHead}>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  sortDirection={order.orderBy === column.code ? order.orderDirection : false}
                  align={column.align}
                  className={classes.tableHeadCell}
                >
                  {column.sortableColumn ? (
                    <TableSortLabel
                      active={order.orderBy === column.code}
                      direction={order.orderBy === column.code ? order.orderDirection : 'asc'}
                      onClick={createSortHandler(column.code)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {usersInHabilitation && usersInHabilitation.length > 0 ? (
              usersInHabilitation.map((userAccess, index) => (
                <TableRow key={index} className={classes.tableBodyRows}>
                  <TableCell align="left">
                    {userAccess.lastname.toLocaleUpperCase()} {userAccess.firstname}
                    <IconButton
                      onClick={() => navigate(`/console-admin/user-profile/${userAccess.provider_username}`)}
                      size="large"
                    >
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>{userAccess.perimeter}</TableCell>
                  <TableCell>
                    {userAccess.start_datetime ? moment(userAccess.start_datetime).format('DD/MM/YYYY') : '-'}
                  </TableCell>
                  <TableCell>
                    {userAccess.end_datetime ? moment(userAccess.end_datetime).format('DD/MM/YYYY') : '-'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography className={classes.loadingSpinnerContainer}>Aucun résultat à afficher</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {page !== undefined && (
        <Pagination
          className={classes.pagination}
          count={Math.ceil((total ?? 0) / (rowsPerPage ?? 100))}
          shape="circular"
          onChange={(event, page: number) => (onChangePage ? onChangePage(page) : setPage && setPage(page))}
          page={page}
        />
      )}
    </Grid>
  )
}

export default HabilitationTable
