import api from '../api'
import { CareSite, Order, ScopeTreeRow } from 'types'

const loadingItem: ScopeTreeRow = {
  care_site_id: 'loading',
  name: 'loading',
  care_site_type_source_value: 'loading',
  children: []
}

export const getCareSites = async () => {
  const caresiteResp = await api.get(`/perimeters/?care_site_type_source_value=AP-HP`)

  if (!caresiteResp) return undefined

  const { data } = caresiteResp
  if (!data) return [{ care_site_id: 'loading' }]

  const careSitesData = data.results
  // a proteger

  return careSitesData && careSitesData.length > 0 ? careSitesData : []
}

export const getScopeCareSites = async (getCareSites: any) => {
  const careSitesResult = (await getCareSites()) ?? []

  let scopeRows: ScopeTreeRow[] = []

  for (const careSite of careSitesResult) {
    const scopeRow: ScopeTreeRow = careSite as ScopeTreeRow
    scopeRow.name = `${careSite.care_site_source_value} - ${careSite.care_site_name}`
    scopeRow.children =
      careSite.children?.length > 0
        ? parseChildren(careSite.children)
        : await getCareSitesChildren(careSite as ScopeTreeRow)
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

const parseChildren = (children?: CareSite[]) => {
  if (!children) return []

  let _childrenData = children.map<ScopeTreeRow>((child) => {
    return {
      ...child,
      name: `${child.care_site_source_value} - ${child.care_site_name}` ?? '',
      care_site_type_source_value: child.care_site_type_source_value ?? '',
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

export const getCareSitesChildren = async (
  careSite: ScopeTreeRow | null,
  getSubItem?: boolean
): Promise<ScopeTreeRow[]> => {
  if (!careSite) return []
  const children = await api.get(`/perimeters/${careSite.care_site_id}/children/`)
  if (!children) return []

  const childrenData: any[] = children && children.data && children.status === 200 ? children.data.results : []

  let _childrenData: ScopeTreeRow[] = []

  for (const child of childrenData) {
    const scopeRow: ScopeTreeRow = child as ScopeTreeRow

    scopeRow.name = `${child.care_site_source_value} - ${child.care_site_name}` ?? ''
    scopeRow.children = getSubItem === true ? await getCareSitesChildren(child as ScopeTreeRow) : [loadingItem]
    _childrenData = [..._childrenData, scopeRow]
  }

  _childrenData = _childrenData.filter((child) => child.care_site_id !== careSite.care_site_id)

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

export const getManageableCareSites = async (): Promise<ScopeTreeRow[]> => {
  const manageableCareSitesResp = await api.get(`/perimeters/manageable/`)

  if (manageableCareSitesResp.status !== 200) {
    return []
  }

  return manageableCareSitesResp.data ?? []
}

export const getCareSiteAccesses = async (careSiteId: string, order: Order, page?: number, searchInput?: string) => {
  const _orderDirection =
    order.orderBy === 'is_valid' ? (order.orderDirection === 'asc' ? 'desc' : 'asc') : order.orderDirection

  const searchFilter = searchInput ? `&search=${searchInput}` : ''
  const careSiteAccessesResp = await api.get(
    `/accesses/?care_site_id=${careSiteId}&page=${page}&ordering=${_orderDirection === 'desc' ? '-' : ''}${
      order.orderBy
    }${searchFilter}`
  )

  if (careSiteAccessesResp.status !== 200) return undefined

  return {
    accesses: careSiteAccessesResp.data.results ?? undefined,
    total: careSiteAccessesResp.data.count ?? 0
  }
}

export const getCareSite = async (careSiteId: string): Promise<string | undefined> => {
  const careSiteResp = await api.get(`/perimeters/${careSiteId}/`)

  if (careSiteResp.status !== 200) return undefined

  return `${careSiteResp.data.care_site_source_value} - ${careSiteResp.data.care_site_name}` ?? undefined
}

export const searchInCareSites = async (isManageable?: boolean, searchInput?: string) => {
  try {
    if (!searchInput) {
      return []
    }
    const careSiteSearchResp = await api.get(
      isManageable ? `/perimeters/manageable/?search=${searchInput}` : `/perimeters/?treefy=true&search=${searchInput}`
    )

    if (careSiteSearchResp.data) {
      return parseCareSiteSearchResults(careSiteSearchResp.data[0].children, searchInput.trim())
    } else {
      return []
    }
  } catch (error) {
    console.error(error)
    return []
  }
}

const parseCareSiteSearchResults = (response: any[], searchInput: string) => {
  let scope: any[] = []

  const recursive = (table: CareSite[], existingTitle?: string) => {
    for (const item of table) {
      const name = existingTitle
        ? `${existingTitle} > ${item.care_site_source_value} - ${item.care_site_name}`
        : `${item.care_site_source_value} - ${item.care_site_name}`

      const regexp = new RegExp(searchInput.toLowerCase())

      if (
        item.care_site_name.toLowerCase().search(regexp) !== -1 ||
        item.care_site_source_value.toLowerCase().search(regexp) !== -1
      ) {
        scope = [
          ...scope,
          {
            ...item,
            name
          }
        ]
      }

      if (item.children && item.children.length > 0) {
        if (item.care_site_type_source_value === 'Groupe hospitalier (GH)') {
          recursive(item.children)
        } else {
          recursive(item.children, name)
        }
      }
    }
  }

  recursive(response, response[0].name)
  return scope
}
