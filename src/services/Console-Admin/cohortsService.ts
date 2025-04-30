import { ResourceType } from 'types'
import api from '../api'

export const getUserCohorts = async (username?: string) => {
  if (!username) {
    return []
  }

  const cohortsResp = await api.get(`/exports/cohorts/?owner_id=${username}&limit=1000`)

  if (cohortsResp.status !== 200) {
    return []
  }

  return cohortsResp.data.results ?? []
}

export const getUserFilters = async (
  confidentiality: 'nomi' | 'pseudo',
  provider_source_value?: string,
  fhir_resource?: ResourceType
) => {
  if (!provider_source_value || !fhir_resource) {
    return []
  }

  let queryParams = `owner_id=${provider_source_value}&fhir_resource=${fhir_resource}`
  if (confidentiality === 'pseudo') {
    queryParams += '&identifying=false'
  }
  const filtersResp = await api.get(`/exports/fhir-filters/?${queryParams}&ordering=-created_at&limit=1000`)

  if (filtersResp.status !== 200) {
    return []
  }

  return filtersResp.data.results ?? []
}
