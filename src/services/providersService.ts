import axios from "axios";
import { BACK_API_URL } from "../constants";

export const submitGetProfiles = async (
  orderBy: string,
  orderDirection: string,
  page?: number,
  searchBy?: any,
  searchInput?: string
) => {
  const baseURL = BACK_API_URL;
  const searchFilter = searchInput ? `&${searchBy.code}=${searchInput}` : ''

  let url = `${baseURL}/providers/?ordering=${orderDirection === 'desc' ? '-' : ''}${orderBy}${searchFilter}`;

  const profiles = await axios.get(url);

  console.log(`profiles`, profiles);

  return profiles.data.results;
};
