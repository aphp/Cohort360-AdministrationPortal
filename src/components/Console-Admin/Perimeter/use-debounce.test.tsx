import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useDebounce from './use-debounce'

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
})

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce(200, 'hello'))
    expect(result.current).toBe('hello')
  })

  it('updates only after the delay has elapsed', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(200, v), { initialProps: { v: 'a' } })
    rerender({ v: 'b' })
    expect(result.current).toBe('a')
    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(result.current).toBe('a')
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('b')
  })

  it('resets the timer when value changes again before the delay', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(200, v), { initialProps: { v: 'a' } })
    rerender({ v: 'b' })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    rerender({ v: 'c' })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current).toBe('a')
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBe('c')
  })
})
