import type { PlanGroup, PlanItem } from './types'

export function updatePlanItemSupplier(params: {
  plans: PlanGroup[]
  itemId: string
  supplierName: string
}) {
  const { plans, itemId, supplierName } = params
  if (!itemId) return plans
  const next = plans.map((g) => ({
    ...g,
    items: g.items.map((i) => (i.id === itemId ? { ...i, supplierName } : i)),
  }))
  return next
}

export function mergeIntoBuyerGroups(params: {
  prev: PlanGroup[]
  incoming: Array<{
    id: string
    buyer: string
    supplierName: string
    sku: string
    name: string
    warehouse: string
    suggestedQuantity?: number
    quantity?: number
    purchasePrice?: number
    notes?: string
    source?: string
  }>
}) {
  const { prev, incoming } = params

  const next: PlanGroup[] = []
  const nowStr = new Date().toLocaleString()
  let planSeq = 0
  const generatePlanNumber = () => {
    const base = Math.floor(Math.random() * 1000)
    const suffix = (base + planSeq) % 1000
    planSeq += 1
    return (
      'JH' +
      new Date().toISOString().replace(/\D/g, '').slice(0, 14) +
      String(suffix).padStart(3, '0')
    )
  }

  prev.forEach((raw: any) => {
    if (!raw || typeof raw !== 'object') return
    const items = Array.isArray(raw.items) ? raw.items : []

    if (typeof raw.buyerName === 'string') {
      const buyerName = raw.buyerName || '未分配'
      next.push({
        planNumber:
          typeof raw.planNumber === 'string' && raw.planNumber ? raw.planNumber : generatePlanNumber(),
        buyerName,
        totalProducts: 0,
        totalQuantity: 0,
        totalPrice: 0,
        items: items.map((i: any) => ({
          id: typeof i?.id === 'string' ? i.id : `plan-${Date.now()}`,
          buyer: buyerName,
          supplierName: typeof i?.supplierName === 'string' ? i.supplierName : '未知供应商',
          sku: typeof i?.sku === 'string' ? i.sku : '--',
          name: typeof i?.name === 'string' ? i.name : '--',
          warehouse: typeof i?.warehouse === 'string' ? i.warehouse : '默认仓库',
          quantity: typeof i?.quantity === 'number' ? i.quantity : 0,
          purchasePrice: typeof i?.purchasePrice === 'number' ? i.purchasePrice : 0,
          inbound: typeof i?.inbound === 'string' ? i.inbound : '--',
          loss: typeof i?.loss === 'number' ? i.loss : 0,
          notes: typeof i?.notes === 'string' ? i.notes : '--',
          logistics: typeof i?.logistics === 'string' ? i.logistics : '--',
          status: typeof i?.status === 'string' ? i.status : '未采购',
          source: typeof i?.source === 'string' ? i.source : '采购建议',
          creator: typeof i?.creator === 'string' ? i.creator : '当前用户',
          createTime: typeof i?.createTime === 'string' ? i.createTime : nowStr,
        })),
      })
      return
    }

    if (typeof raw.supplierName === 'string') {
      const supplierName = raw.supplierName || '未知供应商'
      const buyerSet = new Set<string>()
      items.forEach((i: any) => {
        const buyerName = typeof i?.buyer === 'string' && i.buyer ? i.buyer : '未分配'
        buyerSet.add(buyerName)
      })
      const reusePlanNumber =
        buyerSet.size <= 1 && typeof raw.planNumber === 'string' && raw.planNumber ? raw.planNumber : ''

      items.forEach((i: any) => {
        const buyerName = typeof i?.buyer === 'string' && i.buyer ? i.buyer : '未分配'
        let group = next.find((g) => g.buyerName === buyerName)
        if (!group) {
          group = {
            planNumber: reusePlanNumber || generatePlanNumber(),
            buyerName,
            totalProducts: 0,
            totalQuantity: 0,
            totalPrice: 0,
            items: [],
          }
          next.push(group)
        }

        const normalized: PlanItem = {
          id: typeof i?.id === 'string' ? i.id : `plan-${Date.now()}`,
          buyer: buyerName,
          supplierName: typeof i?.supplierName === 'string' ? i.supplierName : supplierName,
          sku: typeof i?.sku === 'string' ? i.sku : '--',
          name: typeof i?.name === 'string' ? i.name : '--',
          warehouse: typeof i?.warehouse === 'string' ? i.warehouse : '默认仓库',
          quantity: typeof i?.quantity === 'number' ? i.quantity : 0,
          purchasePrice: typeof i?.purchasePrice === 'number' ? i.purchasePrice : 0,
          inbound: typeof i?.inbound === 'string' ? i.inbound : '--',
          loss: typeof i?.loss === 'number' ? i.loss : 0,
          notes: typeof i?.notes === 'string' ? i.notes : '--',
          logistics: typeof i?.logistics === 'string' ? i.logistics : '--',
          status: typeof i?.status === 'string' ? i.status : '未采购',
          source: typeof i?.source === 'string' ? i.source : '采购建议',
          creator: typeof i?.creator === 'string' ? i.creator : '当前用户',
          createTime: typeof i?.createTime === 'string' ? i.createTime : nowStr,
        }

        if (!group.items.some((x) => x.id === normalized.id)) group.items.push(normalized)
      })
    }
  })

  incoming.forEach((item) => {
    const buyerName = item.buyer || '未分配'
    let group = next.find((g) => g.buyerName === buyerName)
    if (!group) {
      group = {
        planNumber: generatePlanNumber(),
        buyerName,
        totalProducts: 0,
        totalQuantity: 0,
        totalPrice: 0,
        items: [],
      }
      next.push(group)
    }

    const newItemId = `plan-${item.id}`
    if (group.items.some((i) => i.id === newItemId)) return

    const quantity = item.suggestedQuantity ?? item.quantity ?? 0
    const purchasePrice = item.purchasePrice ?? 0

    const planItem: PlanItem = {
      id: newItemId,
      buyer: buyerName,
      supplierName: item.supplierName || '未知供应商',
      sku: item.sku,
      name: item.name,
      warehouse: item.warehouse || '默认仓库',
      quantity,
      purchasePrice,
      inbound: '--',
      loss: 0,
      notes: item.notes || '--',
      logistics: '--',
      status: '未采购',
      source: item.source || '采购建议',
      creator: '当前用户',
      createTime: nowStr,
    }

    group.items.push(planItem)
  })

  return next
    .map((g) => {
      const totalQuantity = g.items.reduce((sum, i) => sum + i.quantity, 0)
      const totalPrice = g.items.reduce((sum, i) => sum + i.quantity * i.purchasePrice, 0)
      return {
        ...g,
        totalProducts: g.items.length,
        totalQuantity,
        totalPrice,
      }
    })
    .sort((a, b) => (a.buyerName || '').localeCompare(b.buyerName || '', 'zh'))
}
