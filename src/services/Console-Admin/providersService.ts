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
 let provider 

 await api.get(`/providers/${providerId}/`)
  .then((providerResp) => {
    provider = providerResp.data ?? undefined
  })
  .catch(() => {
    provider = undefined
  })

 return provider
}