import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn (className utility)', () => {
  it('should merge class names', () => {
    const result = cn('px-2', 'py-3')
    expect(result).toBe('px-2 py-3')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class active-class')
  })

  it('should handle false/undefined/null values', () => {
    const result = cn('base', false, undefined, null, 'valid')
    expect(result).toBe('base valid')
  })

  it('should merge conflicting Tailwind classes (last wins)', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('should handle empty inputs', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle object notation', () => {
    const result = cn({ active: true, disabled: false })
    expect(result).toBe('active')
  })
})
