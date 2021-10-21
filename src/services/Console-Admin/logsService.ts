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

    const getLogsResp = await api.get(
      `/logs/?page=${page}${userFilter}${statusCodeFilter}${httpMethodFilter}${afterDateFilter}${beforeDateFilter}`
    )

    return {
      logs: getLogsResp?.data.results ?? [],
      total: getLogsResp?.data.count ?? 0,
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des logs", error)
  }
}
