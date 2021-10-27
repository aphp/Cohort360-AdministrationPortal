import api from "../api"
import { LogsFiltersObject } from "types"
import moment from "moment"

export const getLogs = async (filters: LogsFiltersObject, page: number) => {
  try {
    const userFilter = filters.user ? `&user=${filters.user}` : ""
    const statusCodeFilter =
      filters.statusCode.length > 0
        ? `&status_code=${filters.statusCode.join()}`
        : ""
    const httpMethodFilter =
      filters.httpMethod.length > 0
        ? `&method=${filters.httpMethod.join()}`
        : ""
    const afterDateFilter = filters.afterDate
      ? `&requested_at_after=${moment(filters.afterDate).format("YYYY-MM-DD")}`
      : ""
    const beforeDateFilter = filters.beforeDate
      ? `&requested_at_before=${moment(filters.beforeDate).format(
          "YYYY-MM-DD"
        )}`
      : ""
    const accessFilters = filters.access
      ? `&path=/accesses/${filters.access}/`
      : ""
    const careSiteFilters = filters.careSite
      ? `&response="care_site_id":${filters.careSite}`
      : ""

    const getLogsResp = await api.get(
      `/logs/?page=${page}${userFilter}${statusCodeFilter}${httpMethodFilter}${afterDateFilter}${beforeDateFilter}${accessFilters}${careSiteFilters}`
    )

    return {
      logs: getLogsResp?.data.results ?? [],
      total: getLogsResp?.data.count ?? 0,
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des logs", error)
  }
}
