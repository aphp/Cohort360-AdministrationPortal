import { AxiosError, AxiosResponse } from 'axios'

import { Authentication } from '../types'
import api from './api'

const defaultErrorCode = 400

export const getCsrfToken = async (): Promise<AxiosResponse<any>> => {
  // not yet used
  return await api.get(`/accounts/login/`)
}

export const authenticate = async (username: string, password: string): Promise<Authentication> => {
  try {
    const formData = new FormData()
    formData.append('username', username.toString())
    formData.append('password', password)
    return await api.post(`/accounts/login/`, formData)
  } catch (error) {
    let status = defaultErrorCode
    let data = error

    if (error instanceof AxiosError && error.response) {
      status = error.response.status
    }

    return { status, data }
  }
}

export const logout = async () => {
  await api.post(`/accounts/logout/`)
  localStorage.clear()
}
