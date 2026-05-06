import { describe, it, expect } from 'vitest'
import { extractFilename } from './download'

describe('extractFilename', () => {
  it('extracts a quoted filename', () => {
    expect(extractFilename('attachment; filename="report.csv"')).toBe('report.csv')
  })

  it('extracts a single-quoted filename', () => {
    expect(extractFilename("attachment; filename='report.csv'")).toBe('report.csv')
  })

  it('extracts an unquoted filename', () => {
    expect(extractFilename('attachment; filename=report.csv')).toBe('report.csv')
  })

  it('falls back to the default filename when no filename token is present', () => {
    expect(extractFilename('attachment')).toBe('export_logs.json')
  })

  it('falls back to the default filename for an empty header', () => {
    expect(extractFilename('')).toBe('export_logs.json')
  })
})
