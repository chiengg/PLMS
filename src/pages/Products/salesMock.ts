export type SalesQuery = {
  sku: string
  startDate: string
  endDate: string
  warehouse: string
  platform: string
}

export type SalesPoint = { date: string; sales: number }

export type SalesSeriesResponse = { sku: string; points: SalesPoint[] }

function toDateUTC(v: string) {
  const [y, m, d] = v.split('-').map((x) => Number(x))
  return new Date(Date.UTC(y, m - 1, d))
}

export function listDateRange(start: string, end: string) {
  const s = toDateUTC(start)
  const e = toDateUTC(end)

  const out: string[] = []
  const cur = new Date(s)
  while (cur <= e) {
    const yyyy = cur.getUTCFullYear()
    const mm = String(cur.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(cur.getUTCDate()).padStart(2, '0')
    out.push(`${yyyy}-${mm}-${dd}`)
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  return out
}

export function seededRandom(seedStr: string) {
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }

  return function next() {
    h += 0x6d2b79f5
    let t = Math.imul(h ^ (h >>> 15), 1 | h)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildSalesSeries(query: SalesQuery): SalesSeriesResponse {
  const { sku, startDate, endDate, warehouse, platform } = query
  const seed = `${sku}|${startDate}|${endDate}|${warehouse}|${platform}`
  const rand = seededRandom(seed)
  const dates = listDateRange(startDate, endDate)

  const spikeCount = Math.max(2, Math.min(5, Math.floor(dates.length / 7)))
  const spikes = new Set<number>()
  while (spikes.size < spikeCount && dates.length > 0) {
    spikes.add(Math.floor(rand() * dates.length))
  }

  const points = dates.map((date, idx) => {
    const sales = spikes.has(idx) ? Math.max(1, Math.floor(rand() * 8) + 1) : 0
    return { date, sales }
  })

  return { sku, points }
}
