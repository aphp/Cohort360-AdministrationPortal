import React, { ReactNode } from 'react'

import {
  Grid,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel
} from '@mui/material'

import useStyles from './styles'
import { Column, Order } from 'types'

type DataTableProps = {
  columns: Column[]
  order: Order
  setOrder?: (order: Order) => void
  page?: number
  setPage?: (page: number) => void
  onChangePage?: (value: number) => void
  rowsPerPage?: number
  total?: number
  children: ReactNode
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  order,
  setOrder,
  page,
  setPage,
  onChangePage,
  rowsPerPage,
  total,
  ...props
}) => {
  const { classes } = useStyles()

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
          <TableBody>{props.children}</TableBody>
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

export default DataTable
