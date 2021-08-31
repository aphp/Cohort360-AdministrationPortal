import api from "services/api";

export const getProviders = async (
  orderBy: string,
  orderDirection: string,
  page?: number,
  searchInput?: string
) => {
  const searchFilter = searchInput ? `&search=${searchInput}` : ''

  const providersResp = await api.get(`/providers/?manual_only=true&page=${page}&ordering=${orderDirection === 'desc' ? '-' : ''}${orderBy}${searchFilter}`);

  if (providersResp.status !== 200){
    return {
      providers: undefined,
      total: 0
    }
  }

  return {
      providers : providersResp.data.results ?? undefined,
      total: providersResp.data.count ?? 0
  }
};

export const getProvider = async (providerId: string) => {
  try {
    const providerResp = await api.get(`/providers/${providerId}/`)

    return providerResp.data ?? undefined
  } catch (error){
    console.error("Erreur lors de la récupération de l'utilisateur", error)
  }
}