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
import { Column, Habilitation, Order } from 'types'

interface HabilitationProps {
  habilitations: Habilitation[]
  page?: number
  setPage?: (page: number) => void
  onChangePage?: (value: number) => void
  total?: number
  order: Order
  setOrder?: (order: Order) => void
}

const HabilitationTable: React.FC<HabilitationProps> = (props) => {
  const { habilitations, page, setPage, onChangePage, total, order, setOrder } = props
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
      align: 'center',
      sortableColumn: true
    },
    {
      label: 'Date de début',
      code: 'start_datetime',
      align: 'center',
      sortableColumn: true
    },
    {
      label: 'Date de fin',
      code: 'end_datetime',
      align: 'center',
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
            {habilitations && habilitations.length > 0 ? (
              habilitations.map((habilitation, index) => (
                <TableRow key={index} className={classes.tableBodyRows}>
                  <TableCell align="left">
                    {habilitation.lastname.toLocaleUpperCase()} {habilitation.firstname}
                    <IconButton
                      onClick={() => navigate(`/console-admin/user-profile/${habilitation.provider_username}`)}
                      size="large"
                    >
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>{habilitation.perimeter}</TableCell>
                  <TableCell>
                    {habilitation.start_datetime ? moment(habilitation.start_datetime).format('DD/MM/YYYY') : '-'}
                  </TableCell>
                  <TableCell>
                    {habilitation.end_datetime ? moment(habilitation.end_datetime).format('DD/MM/YYYY') : '-'}
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
