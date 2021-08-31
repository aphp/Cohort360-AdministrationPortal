import api from "../api"
import { CareSite, ScopeTreeRow } from "types"

const loadingItem: ScopeTreeRow = {
  care_site_id: "loading",
  name: "loading",
  children: [],
}

export const getCareSites = async () => {
  const caresiteResp = await api.get(
    `/care-sites/?care_site_type_source_value=AP-HP`
  )

  if (!caresiteResp) return undefined

  const { data } = caresiteResp
  if (!data) return [{ care_site_id: "loading" }]

  const careSitesData = data.results
  // a proteger

  return careSitesData && careSitesData.length > 0 ? careSitesData : []
}

export const getScopeCareSites = async (getCareSites: any) => {
  const careSitesResult = (await getCareSites()) ?? []

  let scopeRows: ScopeTreeRow[] = []

  for (const careSite of careSitesResult) {
    const scopeRow: ScopeTreeRow = careSite as ScopeTreeRow
    scopeRow.name = careSite.care_site_name
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
      name: child.care_site_name ?? "",
      children: [loadingItem],
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
  careSite: ScopeTreeRow | null
): Promise<ScopeTreeRow[]> => {
  if (!careSite) return []
  const children = await api.get(
    `/care-sites/${careSite.care_site_id}/children/`
  )
  if (!children) return []

  const childrenData: CareSite[] =
    children && children.data && children.status === 200
      ? children.data.results
      : []

  let _childrenData = childrenData
    ? childrenData?.map<ScopeTreeRow>((childrenData) => {
        return {
          ...childrenData,
          name: childrenData.care_site_name ?? "",
          children: [loadingItem],
        }
      })
    : []

  _childrenData = _childrenData.filter(
    (child) => child.care_site_id !== careSite.care_site_id
  )

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
  const manageableCareSitesResp = await api.get(`/care-sites/manageable/`)

  if (manageableCareSitesResp.status !== 200) {
    return []
  }

  return manageableCareSitesResp.data ?? []
}

export const getCareSiteAccesses = async (
  careSiteId: string,
  page?: number,
  searchInput?: string
) => {
  const searchFilter = searchInput ? `&search=${searchInput}` : ""
  const careSiteAccessesResp = await api.get(
    `/accesses/?care_site_id=${careSiteId}&page=${page}${searchFilter}`
  )

  if (careSiteAccessesResp.status !== 200) return undefined

  return {
    accesses: careSiteAccessesResp.data.results ?? undefined,
    total: careSiteAccessesResp.data.count ?? 0,
  }
}

export const getCareSite = async (
  careSiteId: string
): Promise<string | undefined> => {
  const careSiteResp = await api.get(`/care-sites/${careSiteId}/`)

  if (careSiteResp.status !== 200) return undefined

  return careSiteResp.data.care_site_name ?? undefined
}
