import api from "../api"
import { Log, LogsFiltersObject } from "types"
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
    const careSiteFilters = filters.careSite.careSiteId
      ? `&response="care_site_id":${filters.careSite.careSiteId}`
      : ""

    const getLogsResp = await api.get(
      `/logs/?page=${page}${userFilter}${statusCodeFilter}${httpMethodFilter}${afterDateFilter}${beforeDateFilter}${accessFilters}${careSiteFilters}`
    )

    const logsResp = getLogsResp?.data.results ?? []

    if (filters.access && page === 1) {
      const getCreateAccessLogsResp = await api.get(
        `/logs/?page=${page}&path=/accesses/&response="care_site_history_id":${filters.access}${userFilter}${statusCodeFilter}${httpMethodFilter}${afterDateFilter}${beforeDateFilter}${careSiteFilters}`
      )

      const createAccessLogs: Log[] =
        getCreateAccessLogsResp?.data?.results ?? []

      let createAccessLog = createAccessLogs[0]
      if (createAccessLogs && createAccessLogs.length > 1) {
        for (const log of createAccessLogs) {
          if (
            log.requested_at &&
            moment(log.requested_at).isAfter(createAccessLog.requested_at)
          ) {
            createAccessLog = log
          }
        }
      }
      if (createAccessLog) {
        logsResp.push(createAccessLog)
      }
    }

    return {
      logs: logsResp,
      total: getLogsResp?.data.count ?? 0,
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des logs", error)
  }
}
