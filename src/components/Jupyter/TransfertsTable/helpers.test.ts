import { describe, it, expect } from 'vitest'
import { getExportStatusChipProps, removeFilterValue } from './helpers'

describe('getExportStatusChipProps', () => {
  it('returns the green/Terminé style for finished exports', () => {
    expect(getExportStatusChipProps('finished' as never)).toEqual({
      label: 'Terminé',
      backgroundColor: '#28A745',
      color: '#FFF'
    })
  })

  it('returns the validated/Confirmé style for validated exports', () => {
    expect(getExportStatusChipProps('validated' as never).label).toBe('Confirmé')
  })

  it.each(['new', 'pending', 'started'])('groups %s under "En cours"', (status) => {
    expect(getExportStatusChipProps(status as never).label).toBe('En cours')
  })

  it.each([
    ['denied', 'Refusé'],
    ['cancelled', 'Annulé'],
    ['failed', 'Erreur']
  ])('maps %s to %s', (status, label) => {
    expect(getExportStatusChipProps(status as never).label).toBe(label)
  })

  it('falls back to "Inconnu" for unknown statuses', () => {
    expect(getExportStatusChipProps('mystery' as never).label).toBe('Inconnu')
  })
})

describe('removeFilterValue', () => {
  const baseFilters = {
    exportType: [{ code: 'csv', display: 'CSV' }, { code: 'hive', display: 'Jupyter' }],
    request_job_status: [{ code: 'pending', display: 'En attente' }],
    insert_datetime_gte: '2026-01-01',
    insert_datetime_lte: '2026-12-31'
  } as never

  it('removes a single export type from the list', () => {
    const value = (baseFilters as any).exportType[0]
    const next = removeFilterValue(baseFilters, 'exportType', value)
    expect((next as any).exportType).toEqual([{ code: 'hive', display: 'Jupyter' }])
  })

  it('removes a status from the list', () => {
    const value = (baseFilters as any).request_job_status[0]
    const next = removeFilterValue(baseFilters, 'request_job_status', value)
    expect((next as any).request_job_status).toEqual([])
  })

  it('clears insert_datetime_gte', () => {
    expect(removeFilterValue(baseFilters, 'insert_datetime_gte').insert_datetime_gte).toBeNull()
  })

  it('clears insert_datetime_lte', () => {
    expect(removeFilterValue(baseFilters, 'insert_datetime_lte').insert_datetime_lte).toBeNull()
  })
})
