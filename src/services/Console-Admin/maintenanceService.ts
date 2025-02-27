import { Order } from 'types'
import api from '../api'

export type MaintenancePhaseCreation = {
  subject: string
  message: string
  type: 'partial' | 'full'
  start_datetime: string
  end_datetime: string
}

export type MaintenancePhase = MaintenancePhaseCreation & {
  id: number
  active: boolean
}

export type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const listMaintenancePhases = async (
  page: number = 1,
  pageSize: number = 20,
  order: Order = { orderBy: 'start_datetime', orderDirection: 'desc' }
): Promise<{ results: MaintenancePhase[]; total: number }> => {
  try {
    const orderingDirection = order.orderDirection === 'desc' ? '-' : ''
    const params = `?ordering=${orderingDirection}${order.orderBy}&page=${page}&page_size=${pageSize}`
    const maintenancePhases = await api.get(`/maintenances/${params}`)
    if (maintenancePhases.status !== 200) {
      throw new Error('Error while fetching maintenance phases')
    }
    return {
      results: maintenancePhases.data?.results ?? [],
      total: maintenancePhases.data?.count ?? 0
    }
  } catch (error) {
    console.error('Error while fetching maintenance phases', error)
    throw new Error('Error while fetching maintenance phases')
  }
}

export const deleteMaintenancePhase = async (maintenancePhaseId: number): Promise<boolean> => {
  try {
    const deleteMaintenancePhaseResp = await api.delete(`/maintenances/${maintenancePhaseId}/`)
    return deleteMaintenancePhaseResp.status === 204
  } catch (error) {
    console.error('Error while deleting MaintenancePhase', error)
    throw new Error('Error while deleting MaintenancePhase')
  }
}

export const createMaintenancePhase = async (
  maintenancePhaseData: MaintenancePhaseCreation
): Promise<MaintenancePhase> => {
  try {
    const createMaintenancePhaseResp = await api.post(`/maintenances/`, maintenancePhaseData)

    if (createMaintenancePhaseResp.status !== 201) {
      throw new Error('Error while creating MaintenancePhase')
    }
    return createMaintenancePhaseResp.data
  } catch (error) {
    console.error('Error while creating MaintenancePhase', error)
    throw new Error('Error while creating MaintenancePhase')
  }
}

export const updateMaintenancePhase = async (
  maintenancePhaseData: MaintenancePhase,
  maintenancePhaseId: number
): Promise<MaintenancePhase> => {
  try {
    const updateMaintenancePhaseResp = await api.patch(`/maintenances/${maintenancePhaseId}/`, maintenancePhaseData)

    if (updateMaintenancePhaseResp.status !== 200) {
      throw new Error('Error while updating MaintenancePhase')
    }
    return updateMaintenancePhaseResp.data
  } catch (error) {
    console.error('Error while updating MaintenancePhase', error)
    throw new Error('Error while updating MaintenancePhase')
  }
}
