import api from 'services/api'
import { Order } from 'types'

export const getProviders = async (order: Order, page?: number, searchInput?: string) => {
  const searchFilter = searchInput ? `&search=${searchInput}` : ''

  const providersResp = await api.get(
    `/providers/?manual_only=true&page=${page}&ordering=${order.orderDirection === 'desc' ? '-' : ''}${
      order.orderBy
    }${searchFilter}`
  )

  if (providersResp.status !== 200) {
    return {
      providers: undefined,
      total: 0
    }
  }

  return {
    providers: providersResp.data.results ?? undefined,
    total: providersResp.data.count ?? 0
  }
}

export const getProvider = async (providerId: string) => {
  try {
    const providerResp = await api.get(`/providers/${providerId}/`)

    return providerResp.data ?? undefined
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur", error)
  }
}
