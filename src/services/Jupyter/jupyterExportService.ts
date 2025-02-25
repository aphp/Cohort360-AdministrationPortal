import api from 'services/api'
import { ExportFilters, Order } from 'types'

export const jupyterTransfer = async (transferRequestData: {}) => {
  try {
    const createProfile = await api.post(`/exports/`, transferRequestData)
    return createProfile.status === 201
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande de transfert Jupyter", error)
    return false
  }
}

export const datalabTransfer = async (transferRequestData: {}) => {
  try {
    const exportResponse = await api.post(`/exports/`, transferRequestData)
    return exportResponse.status === 201
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande de transfert vers un Datalab", error)
    return false
  }
}

export const getExportsList = async (
  page: number,
  limit: number,
  order: Order,
  filters: ExportFilters,
  searchInput?: string
) => {
  try {
    const { exportType, insert_datetime_gte, insert_datetime_lte, request_job_status } = filters
    let _filters: string[] = [
      `limit=${limit}`,
      `offset=${(page - 1) * limit}`,
      `ordering=${order.orderDirection === 'desc' ? '-' : ''}${order.orderBy}`
    ]

    if (exportType && exportType.length > 0)
      _filters = [..._filters, `output_format=${exportType.map((output_format) => output_format.code).join()}`]
    if (request_job_status && request_job_status.length > 0)
      _filters = [..._filters, `request_job_status=${request_job_status.map((status) => status.code).join()}`]
    if (insert_datetime_gte) _filters = [..._filters, `insert_datetime_gte=${insert_datetime_gte}`]
    if (insert_datetime_lte) _filters = [..._filters, `insert_datetime_lte=${insert_datetime_lte}`]
    if (searchInput) _filters = [..._filters, `search=${searchInput.trim()}`]

    const exportsResp = await api.get(`/exports/?${_filters.join('&')}`)

    return {
      list: exportsResp.data.results ?? [],
      total: exportsResp.data.count ?? 0
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des exports')
    return {
      list: [],
      total: 0
    }
  }
}

export const getDatalabExportsList = async (
  page: number,
  limit: number,
  order: Order,
  filters: ExportFilters,
  searchInput?: string
) => {
  try {
    const { exportType, insert_datetime_gte, insert_datetime_lte, request_job_status } = filters
    let _filters: string[] = [
      `limit=${limit}`,
      `offset=${(page - 1) * limit}`,
      `ordering=${order.orderDirection === 'desc' ? '-' : ''}${order.orderBy}`
    ]

    if (exportType && exportType.length > 0)
      _filters = [..._filters, `output_format=${exportType.map((output_format) => output_format.code).join()}`]
    if (request_job_status && request_job_status.length > 0)
      _filters = [..._filters, `request_job_status=${request_job_status.map((status) => status.code).join()}`]
    if (insert_datetime_gte) _filters = [..._filters, `created_at_gte=${insert_datetime_gte}`]
    if (insert_datetime_lte) _filters = [..._filters, `created_at_lte=${insert_datetime_lte}`]
    if (searchInput) _filters = [..._filters, `search=${searchInput.trim()}`]

    const exportsResp = await api.get(`/exports/?${_filters.join('&')}`)

    return {
      list: exportsResp.data.results ?? [],
      total: exportsResp.data.count ?? 0
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des exports')
    return {
      list: [],
      total: 0
    }
  }
}
