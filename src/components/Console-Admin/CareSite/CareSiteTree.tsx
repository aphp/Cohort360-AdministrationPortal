import React, { useEffect, useState } from "react"

import Grid from "@material-ui/core/Grid"
import CircularProgress from "@material-ui/core/CircularProgress"
import IconButton from "@material-ui/core/IconButton"
import Radio from "@material-ui/core/Radio"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import Typography from "@material-ui/core/Typography"
import Skeleton from "@material-ui/lab/Skeleton"

import KeyboardArrowRightIcon from "@material-ui/icons/ChevronRight"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"

import EnhancedTable from "../EnhancedTable"

import {
  getScopeCareSites,
  getCareSitesChildren,
} from "services/Console-Admin/careSiteService"
import { ScopeTreeRow } from "types"
import { useAppSelector } from "state"

import useStyles from "./styles"

type ScopeTreeProps = {
  getCareSites: () => Promise<ScopeTreeRow[]>
  defaultSelectedItems: ScopeTreeRow | null
  onChangeSelectedItem: (selectedItems: ScopeTreeRow) => void
}

const ScopeTree: React.FC<ScopeTreeProps> = ({
  getCareSites,
  defaultSelectedItems,
  onChangeSelectedItem,
}) => {
  const classes = useStyles()

  const [openPopulation, onChangeOpenPopulations] = useState<number[]>([])
  const [rootRows, setRootRows] = useState<ScopeTreeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItem] = useState(defaultSelectedItems)

  const practitioner = useAppSelector((state) => state.me)

  const fetchScopeTree = async () => {
    if (practitioner) {
      const rootRows = await getScopeCareSites(getCareSites)
      setRootRows(rootRows)
    }
  }

  useEffect(() => {
    const _init = async () => {
      setLoading(true)
      await fetchScopeTree()
      setLoading(false)
    }

    _init()
  }, []) // eslint-disable-line

  useEffect(() => setSelectedItem(defaultSelectedItems), [defaultSelectedItems])

  /**
   * This function is called when a user click on chevron
   *
   */
  const _clickToDeploy = async (rowId: number) => {
    let _openPopulation = openPopulation ? openPopulation : []
    let _rootRows = rootRows ? [...rootRows] : []
    const index = _openPopulation.indexOf(rowId)

    if (index !== -1) {
      _openPopulation = _openPopulation.filter(
        (care_site_id) => care_site_id !== rowId
      )
      onChangeOpenPopulations(_openPopulation)
    } else {
      _openPopulation = [..._openPopulation, rowId]
      onChangeOpenPopulations(_openPopulation)

      const replaceSubItems = async (items: ScopeTreeRow[]) => {
        for (const item of items) {
          if (item.care_site_id === rowId) {
            const foundItem = item.subItems
              ? item.subItems.find(
                  (i: ScopeTreeRow) => i.care_site_id === "loading"
                )
              : true
            if (foundItem) {
              item.subItems = await getCareSitesChildren(item)
            }
          } else if (item.subItems && item.subItems.length !== 0) {
            item.subItems = [...(await replaceSubItems(item.subItems))]
          }
        }
        return items
      }

      _rootRows = await replaceSubItems(_rootRows)
      setRootRows(_rootRows)
    }
  }

  /**
   * This function is called when a user click on a radio
   *
   */
  const _clickToSelect = (row: ScopeTreeRow) => {
    onChangeSelectedItem(row)
  }

  const headCells = [
    {
      id: "",
      align: "left",
      disablePadding: true,
      disableOrderBy: true,
      label: "",
    },
    {
      id: "",
      align: "left",
      disablePadding: true,
      disableOrderBy: true,
      label: "",
    },
    {
      id: "name",
      align: "left",
      disablePadding: false,
      disableOrderBy: true,
      label: "Nom",
    },
  ]

  return (
    <div className={classes.container}>
      {loading ? (
        <Grid container justify="center">
          <CircularProgress size={50} />
        </Grid>
      ) : (
        <EnhancedTable
          noCheckbox
          noPagination
          rows={rootRows}
          headCells={headCells}
        >
          {(row: ScopeTreeRow, index: number) => {
            if (!row) return <></>
            const labelId = `enhanced-table-checkbox-${index}`

            const _displayLine = (_row: ScopeTreeRow, level: number) => (
              <>
                {_row.care_site_id === "loading" ? (
                  <TableRow hover key={Math.random()}>
                    <TableCell colSpan={5}>
                      <Skeleton animation="wave" />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow
                    hover
                    key={_row.care_site_id}
                    classes={{
                      root:
                        level % 2 === 0 ? classes.mainRow : classes.secondRow,
                    }}
                  >
                    <TableCell>
                      {_row.subItems && _row.subItems.length > 0 && (
                        <IconButton
                          onClick={() =>
                            _clickToDeploy(_row.care_site_id as number)
                          }
                          style={{
                            marginLeft: level * 35,
                            padding: 0,
                            marginRight: -30,
                          }}
                        >
                          {openPopulation.find(
                            (care_site_id) => _row.care_site_id === care_site_id
                          ) ? (
                            <KeyboardArrowDownIcon />
                          ) : (
                            <KeyboardArrowRightIcon />
                          )}
                        </IconButton>
                      )}
                    </TableCell>

                    <TableCell align="center" padding="checkbox">
                      <Radio
                        color="secondary"
                        checked={
                          selectedItems?.care_site_id === _row.care_site_id
                        }
                        onChange={() => _clickToSelect(_row)}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography>{_row.name}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )

            const _displayChildren = (_row: ScopeTreeRow, level: number) => {
              return (
                <React.Fragment key={Math.random()}>
                  {_displayLine(_row, level)}
                  {openPopulation.find(
                    (care_site_id) => _row.care_site_id === care_site_id
                  ) &&
                    _row.subItems &&
                    _row.subItems.map((subItem: ScopeTreeRow) =>
                      _displayChildren(subItem, level + 1)
                    )}
                </React.Fragment>
              )
            }

            return (
              <React.Fragment key={Math.random()}>
                {_displayLine(row, 0)}
                {openPopulation.find(
                  (care_site_id) => row.care_site_id === care_site_id
                ) &&
                  row.subItems &&
                  row.subItems.map((subItem: ScopeTreeRow) =>
                    _displayChildren(subItem, 1)
                  )}
              </React.Fragment>
            )
          }}
        </EnhancedTable>
      )}
    </div>
  )
}

export default ScopeTree
