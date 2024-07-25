import { AxiosError } from 'axios';
import { Authentication } from '../types'
import api from "./api";
import { OIDC_REDIRECT_URI } from '../constants';

export const authenticate = async (username: string, password: string): Promise<Authentication> => {
  const formData = new FormData()
  formData.append('username', username.toString())
  formData.append('password', password)
  return await api.post(`/auth/login/`, formData)
}

export const authenticateWithOIDC = async (code: string): Promise<Authentication  | AxiosError> => {
  try {
    return await api.post<Authentication>(`/auth/oidc/login`, { auth_code: code, redirect_uri: OIDC_REDIRECT_URI }, {
      headers: { authorizationMethod: 'OIDC' }
    })
  } catch (error) {
    console.error('Error authenticating with an authorization code', error)
    return error as AxiosError
  }
}

export const logout = async () => {
  await api.post(`/auth/logout/`)
  localStorage.clear()
}
