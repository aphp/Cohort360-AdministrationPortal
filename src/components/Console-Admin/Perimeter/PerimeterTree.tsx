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
  getScopePerimeters,
  getPerimetersChildren,
  searchInPerimeters,
  getManageablePerimeters,
  getPerimeters
} from 'services/Console-Admin/perimetersService'
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

  const [openPopulation, onChangeOpenPopulations] = useState<string[]>([])
  const [rootRows, setRootRows] = useState<ScopeTreeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItem] = useState(defaultSelectedItems)

  const practitioner = useAppSelector((state) => state.me)

  const fetchScopeTree = async () => {
    if (practitioner) {
      const rootRows = await getScopePerimeters(isManageable ? getManageablePerimeters : getPerimeters)
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
    const _searchInPerimeters = async () => {
      setLoading(true)
      const perimeterSearchResp = await searchInPerimeters(isManageable, debouncedSearchTerm?.trim())
      setRootRows(perimeterSearchResp)
      setLoading(false)
    }

    if (debouncedSearchTerm && debouncedSearchTerm?.length > 2) {
      _searchInPerimeters()
    } else if (!debouncedSearchTerm) {
      _init()
    }
  }, [debouncedSearchTerm]) // eslint-disable-line

  useEffect(() => setSelectedItem(defaultSelectedItems), [defaultSelectedItems])

  /**
   * This function is called when a user clicks on chevron
   *
   */
  const _clickToDeploy = async (rowId: string) => {
    let _openPopulation = openPopulation ? openPopulation : []
    let _rootRows = rootRows ? [...rootRows] : []
    const index = _openPopulation.indexOf(rowId)

    if (index !== -1) {
      _openPopulation = _openPopulation.filter((perimeter_id) => perimeter_id !== rowId)
      onChangeOpenPopulations(_openPopulation)
    } else {
      _openPopulation = [..._openPopulation, rowId]
      onChangeOpenPopulations(_openPopulation)

      const replaceChildren = async (items: ScopeTreeRow[]) => {
        for (const item of items) {
          if (item.id === rowId) {
            const foundItem = item.children ? item.children.find((i: ScopeTreeRow) => i.id === 'loading') : true
            if (foundItem) {
              item.children = await getPerimetersChildren(item, true)
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
      id: 'type',
      align: 'center',
      disablePadding: true,
      disableOrderBy: true,
      label: 'Type'
    },
    {
      id: 'cohort_size',
      align: 'center',
      disablePadding: true,
      disableOrderBy: true,
      label: 'Nombre de patient'
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
                {_row.id === 'loading' ? (
                  <TableRow hover key={Math.random()}>
                    <TableCell colSpan={5}>
                      <Skeleton animation="wave" />
                    </TableCell>
                  </TableRow>
                ) : (
                  _row.name &&
                  (!isManageable ||
                    !(_row.type.includes('UH') || _row.type.includes('UC') || _row.type.includes('UPMT'))) && (
                    <TableRow
                      hover
                      key={_row.id}
                      classes={{
                        root: level % 2 === 0 ? classes.mainRow : classes.secondRow
                      }}
                    >
                      {!searchInput && (
                        <TableCell>
                          {_row.children && _row.children.length > 0 && (
                            <IconButton
                              onClick={() => _clickToDeploy(_row.id)}
                              style={{
                                marginLeft: level * 35,
                                padding: 0,
                                marginRight: -30
                              }}
                            >
                              {openPopulation.find((perimeter_id) => _row.id === perimeter_id) ? (
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
                          checked={selectedItems?.id === _row.id}
                          onChange={() => _clickToSelect(_row)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>

                      <TableCell>
                        {searchInput && _row.full_path ? (
                          <Breadcrumbs maxItems={2}>
                            {_row.full_path
                              .replace('APHP-ASSISTANCE PUBLIQUE AP-HP/', '')
                              .split('/')
                              .map((full_path: string, index: number) => (
                                <Typography key={index} style={{ color: '#153D8A' }}>
                                  {full_path}
                                </Typography>
                              ))}
                          </Breadcrumbs>
                        ) : (
                          <Typography>{_row.name}</Typography>
                        )}
                      </TableCell>

                      <TableCell align="center">
                        <Typography>{_row.type}</Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography>{_row.cohort_size}</Typography>
                      </TableCell>

                      <TableCell align="right">
                        {userRights.right_read_logs && (
                          <Tooltip title="Voir les logs du périmètre">
                            <IconButton
                              onClick={() => {
                                history.push({
                                  pathname: '/console-admin/logs',
                                  search: `?perimeterId=${_row.id}&perimeterName=${_row.name.split(' ').join('.')}`
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
                  {openPopulation.find((perimeter_id) => _row.id === perimeter_id) &&
                    _row.children &&
                    _row.children.map((child: ScopeTreeRow) => _displayChildren(child, level + 1))}
                </React.Fragment>
              )
            }

            return (
              <React.Fragment key={Math.random()}>
                {_displayLine(row, 0)}
                {openPopulation.find((perimeter_id) => row.id === perimeter_id) &&
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
