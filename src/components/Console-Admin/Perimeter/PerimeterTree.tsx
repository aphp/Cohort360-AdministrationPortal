import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Breadcrumbs,
  CircularProgress,
  Grid,
  IconButton,
  Radio,
  Skeleton,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'

import AssignmentIcon from '@mui/icons-material/Assignment'
import InfoIcon from '@mui/icons-material/Info'
import KeyboardArrowRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import EnhancedTable from '../EnhancedTable'

import {
  getScopePerimeters,
  getPerimetersChildren,
  searchInPerimeters,
  getManageablePerimeters,
  getPerimeters
} from 'services/Console-Admin/perimetersService'
import { CareSiteOrder, ScopeTreeRow, UserRole } from 'types'
import { useAppSelector } from 'state'

import useStyles from './styles'
import useDebounce from './use-debounce'

type ScopeTreeProps = {
  isManageable?: boolean
  defaultSelectedItems: ScopeTreeRow | null
  onChangeSelectedItem: (selectedItems: ScopeTreeRow) => void
  searchInput?: string
  userRights: UserRole
}

const getHeadCells = (searchInput?: string, isManageable?: boolean) => {
  return [
    ...(!searchInput
      ? [
          {
            id: '',
            align: 'left',
            disablePadding: true,
            disableOrderBy: true,
            label: ''
          }
        ]
      : []),
    {
      id: '',
      align: 'left',
      disablePadding: true,
      disableOrderBy: true,
      label: ''
    },
    {
      id: CareSiteOrder.NAME,
      align: 'left',
      disablePadding: false,
      disableOrderBy: true,
      label: 'Nom'
    },
    {
      id: CareSiteOrder.TYPE,
      align: 'center',
      disablePadding: true,
      disableOrderBy: true,
      label: 'Type'
    },
    {
      id: CareSiteOrder.COHORT_SIZE,
      align: 'center',
      disablePadding: true,
      disableOrderBy: true,
      label: 'Nb de patients'
    },
    ...(!isManageable
      ? [
          {
            id: CareSiteOrder.COUNT_ALLOWED_USERS,
            align: 'center',
            disablePadding: true,
            disableOrderBy: true,
            label: (
              <>
                Nb utilisateurs
                <Tooltip title="Estimation du nombre d'utilisateurs ayant un accès à un périmètre exactement">
                  <InfoIcon color="action" fontSize="small" style={{ marginLeft: 4 }} />
                </Tooltip>
              </>
            )
          },
          {
            id: CareSiteOrder.COUNT_ALLOWED_USERS_INFERIOR_LEVELS,
            align: 'center',
            disablePadding: true,
            disableOrderBy: true,
            label: (
              <>
                Nb utilisateurs (inf)
                <Tooltip title="Estimation du nombre d'utilisateurs ayant un accès à ce périmètre et/ou au moins un de ses sous périmètres">
                  <InfoIcon color="action" fontSize="small" style={{ marginLeft: 4 }} />
                </Tooltip>
              </>
            )
          },
          {
            id: CareSiteOrder.COUNT_ALLOWED_USERS_ABOVE_LEVELS,
            align: 'center',
            disablePadding: true,
            disableOrderBy: true,
            label: (
              <>
                Nb utilisateurs (sup)
                <Tooltip title="Estimation des utilisateurs ayant accès à ce périmètre et/ou au moins un périmètre au-dessus (parent)">
                  <InfoIcon color="action" fontSize="small" style={{ marginLeft: 4 }} />
                </Tooltip>
              </>
            )
          }
        ]
      : []),
    {
      id: '',
      align: 'center',
      disablePadding: true,
      disableOrderBy: true,
      label: ''
    }
  ]
}

const ScopeTree: React.FC<ScopeTreeProps> = ({
  isManageable,
  defaultSelectedItems,
  onChangeSelectedItem,
  searchInput,
  userRights
}) => {
  const { classes } = useStyles()
  const navigate = useNavigate()

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
  }, [debouncedSearchTerm])

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

  const headCells = getHeadCells(searchInput, isManageable)

  return (
    <div className={classes.container}>
      {loading ? (
        <Grid container justifyContent="center" style={{ padding: 16 }}>
          <CircularProgress size={40} />
        </Grid>
      ) : (
        <EnhancedTable noCheckbox noPagination rows={rootRows} headCells={headCells}>
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
                              size="large"
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
                        <Typography>{_row.cohort_size ?? 0}</Typography>
                      </TableCell>

                      {!isManageable && (
                        <>
                          <TableCell align="center">
                            <Typography>{_row.count_allowed_users ?? 0}</Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Typography>{_row.count_allowed_users_inferior_levels ?? 0}</Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Typography>{_row.count_allowed_users_above_levels ?? 0}</Typography>
                          </TableCell>
                        </>
                      )}

                      <TableCell align="right">
                        {userRights.right_full_admin && (
                          <Tooltip title="Voir les logs du périmètre">
                            <IconButton
                              onClick={() => {
                                navigate({
                                  pathname: '/console-admin/logs',
                                  search: `?perimeterId=${_row.id}&perimeterName=${_row.name.split(' ').join('.')}`
                                })
                              }}
                              style={{ padding: '4px 12px' }}
                              size="large"
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
