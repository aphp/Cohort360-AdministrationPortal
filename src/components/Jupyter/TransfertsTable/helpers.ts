import { Export, ExportFilters } from 'types'

export type ChipDisplayProps = { label: string; backgroundColor: string; color: string }

export const getExportStatusChipProps = (status: Export['request_job_status']): ChipDisplayProps => {
  const props: ChipDisplayProps = { label: 'Inconnu', backgroundColor: '#dc3545', color: '#FFF' }
  switch (status) {
    case 'finished':
      return { ...props, label: 'Terminé', backgroundColor: '#28A745' }
    case 'validated':
      return { label: 'Confirmé', backgroundColor: '#FFC107', color: '#153D8A' }
    case 'new':
    case 'pending':
    case 'started':
      return { label: 'En cours', backgroundColor: '#FFC107', color: '#153D8A' }
    case 'denied':
      return { ...props, label: 'Refusé' }
    case 'cancelled':
      return { ...props, label: 'Annulé' }
    case 'failed':
      return { ...props, label: 'Erreur' }
    default:
      return props
  }
}

export type FilterKey = 'exportType' | 'request_job_status' | 'insert_datetime_gte' | 'insert_datetime_lte'

export const removeFilterValue = (filters: ExportFilters, filter: FilterKey, value?: object | string | null): ExportFilters => {
  switch (filter) {
    case 'exportType':
      return { ...filters, exportType: filters.exportType.filter((elem) => elem !== value) }
    case 'request_job_status':
      return { ...filters, request_job_status: filters.request_job_status.filter((elem) => elem !== value) }
    case 'insert_datetime_gte':
    case 'insert_datetime_lte':
      return { ...filters, [filter]: null }
    default:
      return filters
  }
}
