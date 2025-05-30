export const BACK_API_URL = import.meta.env.DEV ? import.meta.env.VITE_BACK_API_URL : '{VITE_BACK_API_URL}'

const BOOLEAN_TRUE = 'true'

export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'
export const SESSION_TIMEOUT = import.meta.env.VITE_SESSION_TIMEOUT
  ? process.env.REACT_APP_SESSION_TIMEOUT
  : 780000 /* 13 * 60 * 1000 ms*/
export const REFRESH_TOKEN_INTERVAL = import.meta.env.VITE_REFRESH_TOKEN_INTERVAL
  ? import.meta.env.VITE_REFRESH_TOKEN_INTERVAL
  : 180000 /* 3 * 60 * 1000 ms*/

export const USERNAME_REGEX = import.meta.env.DEV ? import.meta.env.VITE_USERNAME_REGEX : '{VITE_USERNAME_REGEX}'

export const OIDC_PROVIDER_URL = import.meta.env.DEV
  ? import.meta.env.VITE_OIDC_PROVIDER_URL
  : '{VITE_OIDC_PROVIDER_URL}'
export const OIDC_REDIRECT_URI = import.meta.env.DEV
  ? import.meta.env.VITE_OIDC_REDIRECT_URI
  : '{VITE_OIDC_REDIRECT_URI}'
export const OIDC_RESPONSE_TYPE = import.meta.env.DEV
  ? import.meta.env.VITE_OIDC_RESPONSE_TYPE
  : '{VITE_OIDC_RESPONSE_TYPE}'
export const OIDC_CLIENT_ID = import.meta.env.DEV ? import.meta.env.VITE_OIDC_CLIENT_ID : '{VITE_OIDC_CLIENT_ID}'
export const OIDC_SCOPE = import.meta.env.DEV ? import.meta.env.VITE_OIDC_SCOPE : '{VITE_OIDC_SCOPE}'
export const OIDC_STATE = import.meta.env.DEV ? import.meta.env.VITE_OIDC_STATE : '{VITE_OIDC_STATE}'

export const CODE_DISPLAY_JWT = import.meta.env.DEV ? import.meta.env.VITE_CODE_DISPLAY_JWT : '{VITE_CODE_DISPLAY_JWT}'

export const ROOT_PERIMETER_TYPE = import.meta.env.DEV
  ? import.meta.env.VITE_ROOT_PERIMETER_TYPE
  : '{VITE_ROOT_PERIMETER_TYPE}'

export const MAIL_SUPPORT = import.meta.env.DEV ? import.meta.env.VITE_MAIL_SUPPORT : '{VITE_MAIL_SUPPORT}'
export const MAIL_REGEX = import.meta.env.DEV ? import.meta.env.VITE_MAIL_REGEX : '{VITE_MAIL_REGEX}'

export const USE_CHECKED_PROFILES =
  (import.meta.env.DEV ? import.meta.env.VITE_USE_CHECKED_PROFILES : '{VITE_USE_CHECKED_PROFILES}') == `${BOOLEAN_TRUE}`
export const ENABLE_DATALABS =
  (import.meta.env.DEV ? import.meta.env.VITE_ENABLE_DATALABS : '{VITE_ENABLE_DATALABS}') == `${BOOLEAN_TRUE}`
