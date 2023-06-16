import { AxiosResponse } from 'axios'


import { Authentication } from '../types'
import api from "./api";

export const getCsrfToken = async (): Promise<AxiosResponse<any>> => {
  // not yet used
  return await api.get(`/accounts/login/`)
}

export const authenticate = async (username: string, password: string): Promise<Authentication> => {
  const formData = new FormData()
  formData.append('username', username.toString())
  formData.append('password', password)
  return await api.post(`/accounts/login/`, formData)
}

export const logout = async () => {
  await api.post(`/accounts/logout/`)
  localStorage.clear()
}
