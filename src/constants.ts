export const BACK_API_URL =
  process.env.NODE_ENV != 'development' ? '{BACK_API_URL}' : process.env.REACT_APP_BACK_API_URL

export const ACCESS_TOKEN = 'access'
export const REFRESH_TOKEN = 'refresh'
export const SESSION_TIMEOUT = process.env.REACT_APP_SESSION_TIMEOUT
  ? process.env.REACT_APP_SESSION_TIMEOUT
  : 780000 /* 13 * 60 * 1000 ms*/
export const REFRESH_TOKEN_INTERVAL = process.env.REACT_APP_REFRESH_TOKEN_INTERVAL
  ? process.env.REACT_APP_REFRESH_TOKEN_INTERVAL
  : 180000 /* 3 * 60 * 1000 ms*/
