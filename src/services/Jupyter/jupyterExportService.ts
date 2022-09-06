import api from 'services/api'

export const jupyterTransfer = async (transferRequestData: {}) => {
  try {
    const createProfile = await api.post(`/exports/`, transferRequestData)
    return createProfile.status === 201
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande de transfert Jupyter", error)
    return false
  }
}

export const getExportsList = async (page: number, searchInput?: string) => {
  try {
    const searchFilter = searchInput ? `&search=${searchInput}` : ''
    const exportsResp = await api.get(`/exports/?page=${page}${searchFilter}`)

    return {
      list: exportsResp.data.results ?? [],
      total: exportsResp.data.count ?? 0
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des exports')
    return {
      list: [],
      total: 0
    }
  }
}
