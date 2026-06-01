import { describe, it, expect } from 'vitest'
import autoLogoutReducer, { open, close } from './autoLogout'

describe('autoLogout reducer', () => {
  it('starts closed by default', () => {
    expect(autoLogoutReducer(undefined, { type: '@@INIT' })).toEqual({ isOpen: false })
  })

  it('open() flips isOpen to true', () => {
    expect(autoLogoutReducer({ isOpen: false }, open())).toEqual({ isOpen: true })
  })

  it('close() flips isOpen to false', () => {
    expect(autoLogoutReducer({ isOpen: true }, close())).toEqual({ isOpen: false })
  })
})
