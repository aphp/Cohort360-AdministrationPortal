import { Order } from 'types'
import api from '../api'

export const getWorkingEnvironments = async (order: Order, page: number) => {
  try {
    const workingEnvironmentsResp = await api.get(
      `/workspaces/users/?page=${page}&ordering=${order.orderDirection === 'desc' ? '-' : ''}${order.orderBy}`
    )

    const workingEnvironments = workingEnvironmentsResp.data.results ?? []

    return {
      workingEnvironments: workingEnvironments,
      total: workingEnvironmentsResp.data.count ?? 0
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des environnements de travail', error)
  }
}

export const getJupyterMachines = async () => {
  try {
    const jupyterMachinesResp = await api.get('/workspaces/jupyter-machines/')

    return jupyterMachinesResp.data.results ?? []
  } catch (error) {
    console.error('Erreur lors de la récupération des machines Jupyter ou des Rangerhive policies', error)
  }
}
