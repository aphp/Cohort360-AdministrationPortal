import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Radio from '@material-ui/core/Radio'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'

import AssignmentIcon from '@material-ui/icons/Assignment'
import KeyboardArrowRightIcon from '@material-ui/icons/ChevronRight'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

import EnhancedTable from '../EnhancedTable'

import {
  getScopeCareSites,
  getCareSitesChildren,
  searchInCareSites,
  getManageableCareSites,
  getCareSites
} from 'services/Console-Admin/careSiteService'
import { ScopeTreeRow, UserRole } from 'types'
import { useAppSelector } from 'state'

import useStyles from './styles'
import { Breadcrumbs } from '@material-ui/core'
import useDebounce from './use-debounce'

type ScopeTreeProps = {
  isManageable?: boolean
  defaultSelectedItems: ScopeTreeRow | null
  onChangeSelectedItem: (selectedItems: ScopeTreeRow) => void
  searchInput?: string
  userRights: UserRole
}

const ScopeTree: React.FC<ScopeTreeProps> = ({
  isManageable,
  defaultSelectedItems,
  onChangeSelectedItem,
  searchInput,
  userRights
}) => {
  const classes = useStyles()
  const history = useHistory()

  const [openPopulation, onChangeOpenPopulations] = useState<number[]>([])
  const [rootRows, setRootRows] = useState<ScopeTreeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItem] = useState(defaultSelectedItems)

  const practitioner = useAppSelector((state) => state.me)

  const fetchScopeTree = async () => {
    if (practitioner) {
      const rootRows = await getScopeCareSites(isManageable ? getManageableCareSites : getCareSites)
      setRootRows(rootRows)
    }
  }

  const _init = async () => {
    setLoading(true)
    onChangeOpenPopulations([])
    await fetchScopeTree()
    setLoading(false)
  }

  const debouncedSearchTerm = useDebounce(700, searchInput)

  useEffect(() => {
    const _searchInCareSites = async () => {
      setLoading(true)
      const careSiteSearchResp = await searchInCareSites(isManageable, debouncedSearchTerm?.trim())
      setRootRows(careSiteSearchResp)
      setLoading(false)
    }

    if (debouncedSearchTerm && debouncedSearchTerm?.length > 2) {
      _searchInCareSites()
    } else if (!debouncedSearchTerm) {
      _init()
    }
  }, [debouncedSearchTerm]) // eslint-disable-line

  useEffect(() => setSelectedItem(defaultSelectedItems), [defaultSelectedItems])

  /**
   * This function is called when a user clicks on chevron
   *
   */
  const _clickToDeploy = async (rowId: number) => {
    let _openPopulation = openPopulation ? openPopulation : []
    let _rootRows = rootRows ? [...rootRows] : []
    const index = _openPopulation.indexOf(rowId)

    if (index !== -1) {
      _openPopulation = _openPopulation.filter((care_site_id) => care_site_id !== rowId)
      onChangeOpenPopulations(_openPopulation)
    } else {
      _openPopulation = [..._openPopulation, rowId]
      onChangeOpenPopulations(_openPopulation)

      const replaceChildren = async (items: ScopeTreeRow[]) => {
        for (const item of items) {
          if (item.care_site_id === rowId) {
            const foundItem = item.children
              ? item.children.find((i: ScopeTreeRow) => i.care_site_id === 'loading')
              : true
            if (foundItem) {
              item.children = await getCareSitesChildren(item, true)
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
      id: '',
      align: 'left',
      disablePadding: true,
      disableOrderBy: true,
      label: ''
    },
    {
      id: 'name',
      align: 'left',
      disablePadding: false,
      disableOrderBy: true,
      label: 'Nom'
    },
    {
      id: '',
      align: 'center',
      disablePadding: true,
      disableOrderBy: true,
      label: ''
    }
  ]

  const headCells = [
    {
      id: '',
      align: 'left',
      disablePadding: true,
      disableOrderBy: true,
      label: ''
    },
    ...searchModeHeadCells
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
                {_row.care_site_id === 'loading' ? (
                  <TableRow hover key={Math.random()}>
                    <TableCell colSpan={5}>
                      <Skeleton animation="wave" />
                    </TableCell>
                  </TableRow>
                ) : (
                  _row.name && (
                    <TableRow
                      hover
                      key={_row.care_site_id}
                      classes={{
                        root: level % 2 === 0 ? classes.mainRow : classes.secondRow
                      }}
                    >
                      {!searchInput && (
                        <TableCell>
                          {_row.children && _row.children.length > 0 && (
                            <IconButton
                              onClick={() => _clickToDeploy(_row.care_site_id as number)}
                              style={{
                                marginLeft: level * 35,
                                padding: 0,
                                marginRight: -30
                              }}
                            >
                              {openPopulation.find((care_site_id) => _row.care_site_id === care_site_id) ? (
                                <KeyboardArrowDownIcon />
                              ) : (
                                <KeyboardArrowRightIcon />
                              )}
                            </IconButton>
                          )}
                        </TableCell>
                      )}

                      <TableCell align="center" padding="checkbox">
                        {_row.care_site_type_source_value !== '' &&
                          (!isManageable ||
                            !(
                              _row.care_site_type_source_value.includes('UH') ||
                              _row.care_site_type_source_value.includes('UC') ||
                              _row.care_site_type_source_value.includes('UPMT')
                            )) && (
                            <Radio
                              color="secondary"
                              checked={selectedItems?.care_site_id === _row.care_site_id}
                              onChange={() => _clickToSelect(_row)}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          )}
                      </TableCell>

                      <TableCell>
                        {searchInput && _row.name ? (
                          <Breadcrumbs maxItems={2}>
                            {_row.name.split('>').map((name: any, index: number) => (
                              <Typography key={index} style={{ color: '#153D8A' }}>
                                {name}
                              </Typography>
                            ))}
                          </Breadcrumbs>
                        ) : (
                          <Typography>{_row.name}</Typography>
                        )}
                      </TableCell>

                      <TableCell align="right">
                        {userRights.right_read_logs && (
                          <Tooltip title="Voir les logs du périmètre">
                            <IconButton
                              onClick={() => {
                                history.push({
                                  pathname: '/console-admin/logs',
                                  search: `?careSiteId=${_row.care_site_id}&careSiteName=${_row.name
                                    .split(' ')
                                    .join('.')}`
                                })
                              }}
                              style={{ padding: '4px 12px' }}
                            >
                              <AssignmentIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </>
            )

            const _displayChildren = (_row: ScopeTreeRow, level: number) => {
              return (
                <React.Fragment key={Math.random()}>
                  {_displayLine(_row, level)}
                  {openPopulation.find((care_site_id) => _row.care_site_id === care_site_id) &&
                    _row.children &&
                    _row.children.map((child: ScopeTreeRow) => _displayChildren(child, level + 1))}
                </React.Fragment>
              )
            }

            return (
              <React.Fragment key={Math.random()}>
                {_displayLine(row, 0)}
                {openPopulation.find((care_site_id) => row.care_site_id === care_site_id) &&
                  row.children &&
                  row.children.map((child: ScopeTreeRow) => _displayChildren(child, 1))}
              </React.Fragment>
            )
          }}
        </EnhancedTable>
      )}
    </div>
  )
}

export default ScopeTree
