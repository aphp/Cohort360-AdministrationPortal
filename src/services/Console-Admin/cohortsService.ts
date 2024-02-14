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
