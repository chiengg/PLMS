import type { SingleSkuFilters, SingleSkuRow } from './types'

export function filterRows(rows: SingleSkuRow[], filters: SingleSkuFilters) {
  const kwPattern = filters.patternCode.trim().toLowerCase()
  const kwName = filters.productName.trim().toLowerCase()
  const kwSku = filters.sku.trim().toLowerCase()

  return rows.filter((r) => {
    if (filters.status !== '全部' && r.status !== filters.status) return false
    if (filters.activity !== '全部' && r.activity !== filters.activity) return false

    if (filters.mainCategory !== '全部' && filters.mainCategory && r.mainCategory !== filters.mainCategory) return false
    if (filters.brand !== '全部' && filters.brand && r.brand !== filters.brand) return false
    if (filters.productCategory !== '全部' && filters.productCategory && r.productCategory !== filters.productCategory) return false
    if (filters.customCategory !== '全部' && filters.customCategory && r.customCategory !== filters.customCategory) return false
    if (filters.purchaser !== '全部' && filters.purchaser && r.purchaser !== filters.purchaser) return false

    if (kwPattern && !r.patternCode.toLowerCase().includes(kwPattern)) return false
    if (kwName && !r.productName.toLowerCase().includes(kwName)) return false
    if (kwSku && !r.sku.toLowerCase().includes(kwSku)) return false

    return true
  })
}

export function formatDateTime(ts: number) {
  if (!Number.isFinite(ts)) return '--'
  return new Date(ts).toLocaleString()
}

export function applyStatusPatch(rows: SingleSkuRow[], selectedIds: string[], status: SingleSkuRow['status']) {
  if (!Array.isArray(rows) || rows.length === 0) return rows
  if (!Array.isArray(selectedIds) || selectedIds.length === 0) return rows
  const set = new Set(selectedIds)
  return rows.map((r) => (set.has(r.id) ? { ...r, status } : r))
}

export function applyWarehouseLocationPatch(rows: SingleSkuRow[], selectedIds: string[], warehouseLocation: string) {
  if (!Array.isArray(rows) || rows.length === 0) return rows
  if (!Array.isArray(selectedIds) || selectedIds.length === 0) return rows
  if (!warehouseLocation) return rows
  const set = new Set(selectedIds)
  return rows.map((r) => (set.has(r.id) ? { ...r, warehouseLocation } : r))
}

function hashString(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function lcg(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 4294967296
  }
}

export function buildSalesSeries(params: { sku: string; days: number; baseline?: number }) {
  const days = Math.max(1, Math.floor(params.days))
  const rand = lcg(hashString(params.sku))
  const base = Number.isFinite(params.baseline) ? (params.baseline as number) : 50

  let v = base + (rand() - 0.5) * base * 0.1
  const out: number[] = []
  for (let i = 0; i < days; i++) {
    const drift = (rand() - 0.5) * base * 0.08
    const noise = (rand() - 0.5) * base * 0.15
    v = Math.max(0, v + drift + noise)
    out.push(Number(v.toFixed(2)))
  }
  return out
}

export function buildMonthlySalesTotals(params: { skuSeed: string; year: number; baseline?: number; cutoffTs?: number }) {
  const start = new Date(params.year, 0, 1)
  const end = new Date(params.year + 1, 0, 1)
  const days = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000))
  const series = buildSalesSeries({ sku: params.skuSeed, days, baseline: params.baseline })
  const totals = Array.from({ length: 12 }).map(() => 0)
  for (let i = 0; i < days; i++) {
    const ts = start.getTime() + i * 86400000
    if (params.cutoffTs != null && ts > params.cutoffTs) break
    const m = new Date(ts).getMonth()
    totals[m] += series[i] ?? 0
  }
  return totals.map((n) => Number(n.toFixed(2)))
}
