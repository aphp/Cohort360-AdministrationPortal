import { describe, it, expect } from 'vitest'
import topBarReducer, { open, close } from './portailTopBar'

describe('portailTopBar reducer', () => {
  it('starts open by default', () => {
    expect(topBarReducer(undefined, { type: '@@INIT' })).toBe(true)
  })

  it('open() sets state to true', () => {
    expect(topBarReducer(false, open())).toBe(true)
  })

  it('close() sets state to false', () => {
    expect(topBarReducer(true, close())).toBe(false)
  })
})
