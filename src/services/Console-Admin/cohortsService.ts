import api from '../api'

export const getProviderCohorts = async (provider_source_value?: string) => {
  if (!provider_source_value) {
    return []
  }

  const cohortsResp = await api.get(`/exports/cohorts/?owner_id=${provider_source_value}&limit=1000`)

  if (cohortsResp.status !== 200) {
    return []
  }

  return cohortsResp.data.results ?? []
}
