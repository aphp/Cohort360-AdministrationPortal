export const BACK_API_URL = import.meta.env.DEV ? import.meta.env.VITE_BACK_API_URL : '{VITE_BACK_API_URL}'

export const ACCESS_TOKEN = 'access'
export const REFRESH_TOKEN = 'refresh'
export const SESSION_TIMEOUT = import.meta.env.VITE_SESSION_TIMEOUT
  ? process.env.REACT_APP_SESSION_TIMEOUT
  : 780000 /* 13 * 60 * 1000 ms*/
export const REFRESH_TOKEN_INTERVAL = import.meta.env.VITE_REFRESH_TOKEN_INTERVAL
  ? import.meta.env.VITE_REFRESH_TOKEN_INTERVAL
  : 180000 /* 3 * 60 * 1000 ms*/
