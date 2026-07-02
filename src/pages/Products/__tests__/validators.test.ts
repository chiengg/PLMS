import { describe, expect, it } from 'vitest'
import { validateSku } from '../addProduct/validators'

describe('validateSku', () => {
  it('rejects empty sku', () => {
    expect(validateSku({ sku: '   ', existingSkus: [] }).ok).toBe(false)
  })

  it('rejects blacklist chars', () => {
    const res = validateSku({ sku: 'ABC_123', existingSkus: [] })
    expect(res.ok).toBe(false)
  })

  it('rejects duplicates', () => {
    const res = validateSku({ sku: 'A1', existingSkus: ['A1'] })
    expect(res.ok).toBe(false)
  })

  it('accepts normal sku', () => {
    expect(validateSku({ sku: 'A1-BC', existingSkus: ['X'] }).ok).toBe(true)
  })
})
