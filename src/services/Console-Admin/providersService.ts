import axios from "axios";
import { BACK_API_URL } from "../../constants";

export const getProviders = async (
  orderBy: string,
  orderDirection: string,
  page?: number,
  searchInput?: string
) => {
  const baseURL = BACK_API_URL;
  const searchFilter = searchInput ? `&search=${searchInput}` : ''

  let url = `${baseURL}/providers/?page=${page}&ordering=${orderDirection === 'desc' ? '-' : ''}${orderBy}${searchFilter}`;

  const providersResp = await axios.get(url);

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
