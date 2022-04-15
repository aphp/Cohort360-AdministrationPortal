import { Order } from 'types'
import api from '../api'

export const getWorkingEnvironments = async (order: Order, page: number, exports: boolean, searchInput?: string) => {
  try {
    const searchFilter = searchInput ? `&search=${searchInput}` : ''
    const workingEnvironmentsResp = await api.get(
      `/${exports ? 'exports/unix-accounts' : 'workspaces/users'}/?page=${page}&ordering=${
        order.orderDirection === 'desc' ? '-' : ''
      }${order.orderBy}${searchFilter}`
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
