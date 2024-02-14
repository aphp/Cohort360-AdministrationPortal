import { Authentication } from '../types'
import api from "./api";

export const authenticate = async (username: string, password: string): Promise<Authentication> => {
  const formData = new FormData()
  formData.append('username', username.toString())
  formData.append('password', password)
  return await api.post(`/auth/login/`, formData)
}

export const logout = async () => {
  await api.post(`/auth/logout/`)
  localStorage.clear()
}
