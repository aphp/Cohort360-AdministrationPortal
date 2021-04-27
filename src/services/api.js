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
  config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    if ((401 || 400) === error?.response?.status) {
      localStorage.clear()
      window.location = '/'
    }
    return Promise.reject(error)
  }
)

export default api
