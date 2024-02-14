import api from '../api'
import { Log, LogsFiltersObject } from 'types'
import moment from 'moment'

export const getLogs = async (filters: LogsFiltersObject, page: number) => {
  try {
    const urlsFilter = filters.url ? `&path_contains=${filters.url.code}` : ''
    const userFilter = filters.user ? `&user=${filters.user}` : ''
    const statusCodeFilter = filters.statusCode.length > 0 ? `&status_code=${filters.statusCode.join()}` : ''
    const httpMethodFilter = filters.httpMethod.length > 0 ? `&method=${filters.httpMethod.join()}` : ''
    const afterDateFilter = filters.afterDate
      ? `&requested_at_after=${moment(filters.afterDate).format('YYYY-MM-DD')}`
      : ''
    const beforeDateFilter = filters.beforeDate
      ? `&requested_at_before=${moment(filters.beforeDate).format('YYYY-MM-DD')}`
      : ''
    const accessFilters = filters.access ? `&path_contains=/accesses/${filters.access}/` : ''
    const perimeterFilters = filters.perimeter.perimeterId
      ? `&response="care_site_id":${filters.perimeter.perimeterId},`
      : ''

    const getLogsResp = await api.get(
      `/logs/?page=${page}&ordering=-requested_at${urlsFilter}${userFilter}${statusCodeFilter}${httpMethodFilter}${afterDateFilter}${beforeDateFilter}${accessFilters}${perimeterFilters}`
    )

    const logsResp = getLogsResp?.data.results ?? []

    if (filters.access && page === 1) {
      const getCreateAccessLogsResp = await api.get(
        `/logs/?page=${page}&ordering=-requested_at&path=/accesses/&response="id":${filters.access}${userFilter}${statusCodeFilter}${httpMethodFilter}${afterDateFilter}${beforeDateFilter}${perimeterFilters}`
      )

      const createAccessLogs: Log[] = getCreateAccessLogsResp?.data?.results ?? []

      let createAccessLog = createAccessLogs[0]
      if (createAccessLogs && createAccessLogs.length > 1) {
        for (const log of createAccessLogs) {
          if (log.requested_at && moment(log.requested_at).isAfter(createAccessLog.requested_at)) {
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
      total: getLogsResp?.data.count ?? 0
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des logs', error)
  }
}
