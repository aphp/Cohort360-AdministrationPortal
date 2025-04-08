import { Datalab, DatalabCreation, Order } from 'types'
import api from '../api'

export const getDatalabs = async (order: Order, page: number, searchInput?: string) => {
  try {
    const searchFilter = searchInput ? `&search=${searchInput}` : ''

    const datalabsResp = await api.get(
      `/exports/datalabs/?page=${page}&ordering=${
        order.orderDirection === 'desc' ? '-' : ''
      }${order.orderBy}${searchFilter}`
    )

    const datalabs = datalabsResp.data.results ?? []

    return {
      datalabs: datalabs,
      total: datalabsResp.data.count ?? 0
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des datalabs', error)
  }
}

export const addNewDatalab = async (newDatalabData: DatalabCreation): Promise<Datalab> => {
  try {
    const newDatalabResp = await api.post('/exports/datalabs/', newDatalabData)

    if (newDatalabResp.status !== 201) {
      throw new Error('Error while adding a new datalab')
    }

    return newDatalabResp.data
  } catch (error) {
    console.error('Error while adding a new datalab', error)
    throw new Error('Error while adding a new datalab')
  }
}

export const getInfrastructureProviders = async () => {
  try {
    const infraProvidersResp = await api.get('/exports/infrastructure-providers/')

    return infraProvidersResp.data.results ?? []
  } catch (error) {
    console.error("Erreur lors de la récupération des fournisseurs d'infrastructure", error)
  }
}
