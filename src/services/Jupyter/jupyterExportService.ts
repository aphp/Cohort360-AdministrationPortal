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
