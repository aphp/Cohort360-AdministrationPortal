import api from '../api'
import { Order, Perimeter, ScopeTreeRow } from 'types'

const loadingItem: ScopeTreeRow = {
  id: 'loading',
  name: 'loading',
  type: 'loading',
  cohort_size: 'loading',
  children: []
}

export const getPerimeters = async () => {
  const perimetersResp = await api.get(`/accesses/perimeters/?type_source_value=AP-HP`)

  if (!perimetersResp) return undefined

  const { data } = perimetersResp
  if (!data) return [{ care_site_id: 'loading' }]

  const perimetersData = data.results
  // a proteger

  return perimetersData && perimetersData.length > 0 ? perimetersData : []
}

export const getScopePerimeters = async (getPerimeters: any) => {
  const perimetersResult = (await getPerimeters()) ?? []

  let scopeRows: ScopeTreeRow[] = []

  for (const perimeter of perimetersResult) {
    const scopeRow: ScopeTreeRow = perimeter as ScopeTreeRow
    scopeRow.name = `${perimeter.source_value} - ${perimeter.name}`
    scopeRow.children =
      perimeter.children?.length > 0
        ? parseChildren(perimeter.children)
        : await getPerimetersChildren(perimeter as ScopeTreeRow)
    scopeRows = [...scopeRows, scopeRow]
  }

  // Sort by name
  scopeRows = scopeRows.sort((a: ScopeTreeRow, b: ScopeTreeRow) => {
    if (a.name > b.name) {
      return 1
    } else if (a.name < b.name) {
      return -1
    }
    return 0
  })

  return scopeRows
}

const parseChildren = (children?: Perimeter[]) => {
  if (!children) return []

  let _childrenData = children.map<ScopeTreeRow>((child) => {
    return {
      ...child,
      name: `${child.names?.source_value} - ${child.names?.name}` ?? '',
      type: child.type ?? '',
      children: [loadingItem]
    }
  })

  _childrenData = _childrenData.sort((a: ScopeTreeRow, b: ScopeTreeRow) => {
    if (a.name > b.name) {
      return 1
    } else if (a.name < b.name) {
      return -1
    }
    return 0
  })

  return _childrenData
}

export const getPerimetersChildren = async (
  perimeter: ScopeTreeRow | null,
  getSubItem?: boolean
): Promise<ScopeTreeRow[]> => {
  if (!perimeter) return []
  const children = await api.get(`/accesses/perimeters/${perimeter.id}/children/`)
  if (!children) return []

  const childrenData: any[] = children && children.data && children.status === 200 ? children.data.results : []

  let _childrenData: ScopeTreeRow[] = []

  for (const child of childrenData) {
    const scopeRow: ScopeTreeRow = child as ScopeTreeRow

    scopeRow.name = `${child.names.source_value} - ${child.names.name}` ?? ''
    scopeRow.children = getSubItem === true ? await getPerimetersChildren(child as ScopeTreeRow) : [loadingItem]
    _childrenData = [..._childrenData, scopeRow]
  }

  _childrenData = _childrenData.filter((child) => child.id !== perimeter.id)

  _childrenData = _childrenData.sort((a: ScopeTreeRow, b: ScopeTreeRow) => {
    if (a.name > b.name) {
      return 1
    } else if (a.name < b.name) {
      return -1
    }
    return 0
  })

  return _childrenData
}

export const getManageablePerimeters = async (): Promise<ScopeTreeRow[]> => {
  const manageablePerimetersResp = await api.get(`/accesses/perimeters/manageable/`)

  if (manageablePerimetersResp.status !== 200) {
    return []
  }

  return manageablePerimetersResp.data ?? []
}

export const getPerimeterAccesses = async (perimeterId: string, order: Order, page?: number, searchInput?: string) => {
  const _orderDirection =
    order.orderBy === 'is_valid' ? (order.orderDirection === 'asc' ? 'desc' : 'asc') : order.orderDirection

  const searchFilter = searchInput ? `&search=${searchInput}` : ''
  const perimeterAccessesResp = await api.get(
    `/accesses/accesses/?perimeter=${perimeterId}&page=${page}&ordering=${
      _orderDirection === 'desc' ? '-' : ''
    }${order.orderBy}${searchFilter}`
  )

  if (perimeterAccessesResp.status !== 200) return undefined

  return {
    accesses: perimeterAccessesResp.data.results ?? undefined,
    total: perimeterAccessesResp.data.count ?? 0
  }
}

export const getPerimeter = async (perimeterId: string): Promise<string | undefined> => {
  const perimeterResp = await api.get(`/accesses/perimeters/${perimeterId}/`)

  if (perimeterResp.status !== 200) return undefined

  return `${perimeterResp.data.care_site_source_value} - ${perimeterResp.data.care_site_name}` ?? undefined
}

export const searchInPerimeters = async (isManageable?: boolean, searchInput?: string) => {
  try {
    if (!searchInput) {
      return []
    }
    const perimeterSearchResp = await api.get(
      isManageable
        ? `/accesses/perimeters/manageable/?search=${searchInput}`
        : `/accesses/perimeters/?search=${searchInput}`
    )

    if (isManageable && perimeterSearchResp.data) {
      return perimeterSearchResp.data
    } else if (perimeterSearchResp.data) {
      return perimeterSearchResp.data.results
    } else {
      return []
    }
  } catch (error) {
    console.error(error)
    return []
  }
}
