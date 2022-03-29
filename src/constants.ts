export const BACK_API_URL =
  process.env.NODE_ENV != 'development' ? '{BACK_API_URL}' : process.env.REACT_APP_BACK_API_URL

export const ACCESS_TOKEN = 'access'
export const REFRESH_TOKEN = 'refresh'
