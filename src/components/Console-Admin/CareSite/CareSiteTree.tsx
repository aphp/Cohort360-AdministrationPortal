import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

import CircularProgress from "@material-ui/core/CircularProgress"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Radio from "@material-ui/core/Radio"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import Skeleton from "@material-ui/lab/Skeleton"

import AssignmentIcon from "@material-ui/icons/Assignment"
import KeyboardArrowRightIcon from "@material-ui/icons/ChevronRight"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"

import EnhancedTable from "../EnhancedTable"

import {
  getScopeCareSites,
  getCareSitesChildren,
  searchInCareSites,
  getManageableCareSites,
  getCareSites,
} from "services/Console-Admin/careSiteService"
import { ScopeTreeRow } from "types"
import { useAppSelector } from "state"

import useStyles from "./styles"
import { Breadcrumbs } from "@material-ui/core"

type ScopeTreeProps = {
  isManageable?: boolean
  defaultSelectedItems: ScopeTreeRow | null
  onChangeSelectedItem: (selectedItems: ScopeTreeRow) => void
  searchInput?: string
}

const ScopeTree: React.FC<ScopeTreeProps> = ({
  isManageable,
  defaultSelectedItems,
  onChangeSelectedItem,
  searchInput,
}) => {
  const classes = useStyles()
  const history = useHistory()

  const [openPopulation, onChangeOpenPopulations] = useState<number[]>([])
  const [rootRows, setRootRows] = useState<ScopeTreeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItem] = useState(defaultSelectedItems)

  const practitioner = useAppSelector((state) => state.me)
  const seeLogs = practitioner?.seeLogs ?? false

  const fetchScopeTree = async () => {
    if (practitioner) {
      const rootRows = await getScopeCareSites(
        isManageable ? getManageableCareSites : getCareSites
      )
      setRootRows(rootRows)
    }
  }

  const _init = async () => {
    setLoading(true)
    await fetchScopeTree()
    setLoading(false)
  }

  useEffect(() => {
    _init()
  }, []) // eslint-disable-line

  useEffect(() => {
    const _searchInCareSites = async () => {
      setLoading(true)
      const careSiteSearchResp = await searchInCareSites(
        isManageable,
        searchInput
      )
      setRootRows(careSiteSearchResp)
      setLoading(false)
    }

    if (searchInput && searchInput?.length > 2) {
      _searchInCareSites()
    } else if (!searchInput) {
      _init()
    }
  }, [searchInput]) // eslint-disable-line

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

      const replaceChildren = async (items: ScopeTreeRow[]) => {
        for (const item of items) {
          if (item.care_site_id === rowId) {
            const foundItem = item.children
              ? item.children.find(
                  (i: ScopeTreeRow) => i.care_site_id === "loading"
                )
              : true
            if (foundItem) {
              item.children = await getCareSitesChildren(item)
            }
          } else if (item.children && item.children.length !== 0) {
            item.children = [...(await replaceChildren(item.children))]
          }
        }
        return items
      }

      _rootRows = await replaceChildren(_rootRows)
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

  const searchModeHeadCells = [
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
    {
      id: "",
      align: "center",
      disablePadding: true,
      disableOrderBy: true,
      label: "",
    },
  ]

  const headCells = [
    {
      id: "",
      align: "left",
      disablePadding: true,
      disableOrderBy: true,
      label: "",
    },
    ...searchModeHeadCells,
  ]

  return (
    <div className={classes.container}>
      {loading ? (
        <Grid container justify="center" style={{ padding: 16 }}>
          <CircularProgress size={40} />
        </Grid>
      ) : (
        <EnhancedTable
          noCheckbox
          noPagination
          rows={rootRows}
          headCells={searchInput ? searchModeHeadCells : headCells}
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
                    {!searchInput && (
                      <TableCell>
                        {_row.children && _row.children.length > 0 && (
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
                              (care_site_id) =>
                                _row.care_site_id === care_site_id
                            ) ? (
                              <KeyboardArrowDownIcon />
                            ) : (
                              <KeyboardArrowRightIcon />
                            )}
                          </IconButton>
                        )}
                      </TableCell>
                    )}

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
                      {searchInput ? (
                        <Breadcrumbs maxItems={2}>
                          {_row.name.split(">").map((name: any) => (
                            <Typography style={{ color: "#153D8A" }}>
                              {name}
                            </Typography>
                          ))}
                        </Breadcrumbs>
                      ) : (
                        <Typography>{_row.name}</Typography>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {seeLogs && (
                        <Tooltip title="Voir les logs du périmètre">
                          <IconButton
                            onClick={() => {
                              history.push({
                                pathname: "/logs",
                                search: `?careSiteId=${
                                  _row.care_site_id
                                }&careSiteName=${_row.name
                                  .split(" ")
                                  .join(".")}`,
                              })
                            }}
                            style={{ padding: "4px 12px" }}
                          >
                            <AssignmentIcon />
                          </IconButton>
                        </Tooltip>
                      )}
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
                    _row.children &&
                    _row.children.map((child: ScopeTreeRow) =>
                      _displayChildren(child, level + 1)
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
                  row.children &&
                  row.children.map((child: ScopeTreeRow) =>
                    _displayChildren(child, 1)
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
