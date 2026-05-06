import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./api', () => ({
  default: { post: vi.fn() }
}))

import api from './api'
import { authenticate, authenticateWithOIDC, logout } from './authentication'
import { REFRESH_TOKEN } from '../constants'

const mockedPost = api.post as ReturnType<typeof vi.fn>

describe('authenticate', () => {
  beforeEach(() => mockedPost.mockReset())

  it('posts FormData with username and password to /auth/login/', async () => {
    mockedPost.mockResolvedValue({ status: 200, data: { token: 'abc' } })
    const res = await authenticate('jdoe', 's3cret')
    expect(mockedPost).toHaveBeenCalledTimes(1)
    const [url, body] = mockedPost.mock.calls[0]
    expect(url).toBe('/auth/login/')
    expect(body).toBeInstanceOf(FormData)
    expect((body as FormData).get('username')).toBe('jdoe')
    expect((body as FormData).get('password')).toBe('s3cret')
    expect(res).toEqual({ status: 200, data: { token: 'abc' } })
  })
})

describe('authenticateWithOIDC', () => {
  beforeEach(() => mockedPost.mockReset())

  it('posts the auth code with the OIDC header on success', async () => {
    mockedPost.mockResolvedValue({ status: 200, data: { token: 'oidc' } })
    const res = await authenticateWithOIDC('code-123')
    expect(mockedPost).toHaveBeenCalledWith(
      '/auth/login/',
      expect.objectContaining({ auth_code: 'code-123' }),
      expect.objectContaining({ headers: { authorizationMethod: 'OIDC' } })
    )
    expect(res).toEqual({ status: 200, data: { token: 'oidc' } })
  })

  it('returns the AxiosError when the request throws', async () => {
    const err = new Error('boom')
    mockedPost.mockRejectedValueOnce(err)
    const res = await authenticateWithOIDC('bad')
    expect(res).toBe(err)
  })
})

describe('logout', () => {
  beforeEach(() => {
    mockedPost.mockReset()
    localStorage.clear()
  })

  it('sends the refresh token then clears localStorage', async () => {
    localStorage.setItem(REFRESH_TOKEN, 'refresh-xyz')
    localStorage.setItem('user', '{}')
    mockedPost.mockResolvedValue({ status: 200 })

    await logout()

    expect(mockedPost).toHaveBeenCalledWith('/auth/logout/', { refresh_token: 'refresh-xyz' })
    expect(localStorage.length).toBe(0)
  })
})
