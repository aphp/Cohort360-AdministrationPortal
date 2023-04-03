import axios from 'axios'
import { ACCESS_TOKEN, BACK_API_URL } from '../constants'

const api = axios.create({
  baseURL: BACK_API_URL,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN)
  if (config && config.headers && config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    if (
      error?.response?.status === 401 ||
      (error?.response?.status === 403 && error.config.url.includes('/accounts/refresh/'))
    ) {
      localStorage.clear()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
