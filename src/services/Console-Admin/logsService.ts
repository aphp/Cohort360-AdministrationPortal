import api from "../api"

export const getLogs = async () => {
  try {
    const getLogsResp = await api.get("/logs/")

    return getLogsResp?.data ?? []
  } catch (error) {
    console.error("Erreur lors de la récupération des logs", error)
  }
}
