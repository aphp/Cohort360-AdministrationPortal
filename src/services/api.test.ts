import { describe, expect, it, beforeEach } from 'vitest'
import api from './api'
import { ACCESS_TOKEN } from '../constants'

const requestHandlers = (api.interceptors.request as never as { handlers: Array<{ fulfilled: (config: any) => any }> })
  .handlers

describe('api interceptors', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds authorization headers from local storage', () => {
    localStorage.setItem('oidcAuth', 'true')
    localStorage.setItem(ACCESS_TOKEN, 'token-value')

    const config = requestHandlers[0].fulfilled({ headers: {} })

    expect(config.headers.Authorization).toBe('Bearer token-value')
    expect(config.headers.authorizationMethod).toBe('OIDC')
  })
})
