import { describe, it, expect } from 'vitest'
import { perimeterDisplay } from './perimeters'

describe('perimeterDisplay', () => {
  it('prefixes the name with the code', () => {
    expect(perimeterDisplay('H01', 'GH RCP')).toBe('H01 - GH RCP')
  })

  it('returns only the name when the code is null or undefined', () => {
    expect(perimeterDisplay(null, 'GH RCP')).toBe('GH RCP')
    expect(perimeterDisplay(undefined, 'GH RCP')).toBe('GH RCP')
  })

  it('returns an empty string when there is neither code nor name', () => {
    expect(perimeterDisplay(null, undefined)).toBe('')
  })
})
