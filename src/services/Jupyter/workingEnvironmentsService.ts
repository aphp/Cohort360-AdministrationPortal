import api from '../api'

export const getWorkingEnvironments = async () => {
  try {
    // TODO: change url to workspaces/users
    const workingEnvironmentsResp = await api.get('/workspaces/projects/')

    const workingEnvironments = workingEnvironmentsResp.data.results ?? []

    return {
      workingEnvironments: workingEnvironments,
      total: workingEnvironmentsResp.data.count ?? 0
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des environnements de travail', error)
  }
}

export const getWorkingEnvironmentFormInfos = async () => {
  try {
    const jupyterMachinesResp = await api.get('/workspaces/jupyter-machines/')

    const jupyterMachines = jupyterMachinesResp.data.results ?? []

    return {
      jupyterMachines: jupyterMachines
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des machines Jupyter ou des Rangerhive policies', error)
  }
}
